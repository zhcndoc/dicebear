/// Derives every deterministic value for an avatar from the style, the user
/// options, and a seeded PRNG, exposing them as memoized named accessors.
library;

import 'error/circular_color_reference_error.dart';
import 'options.dart';
import 'prng/prng.dart';
import 'range.dart';
import 'style.dart';
import 'style/color.dart';
import 'style/component.dart';
import 'utils/color.dart';

/// Bundles the three inputs needed to derive any deterministic value for an
/// avatar — the [Style], the validated user [Options], and a seeded [Prng] —
/// and exposes them as named accessors. Each accessor memoizes its result so
/// that repeated calls cannot drift. The memo also serves as the
/// informational snapshot returned by [resolved] — every value the resolver
/// picks during one resolution lands there, except for the raw seed.
class Resolver {
  final Style _style;
  final Options _options;
  final Prng _prng;
  final List<String> _colorResolving = [];

  // The memo doubles as the resolved-options snapshot: the first write wins,
  // and the map's insertion order is the first-resolution order the JSON
  // envelope emits (Dart maps preserve it natively; Go had to track the order
  // explicitly). Unset values are recorded as null and filtered on exposure.
  final Map<String, Object?> _result = {};

  Resolver(Style style, Options options)
      : _style = style,
        _options = options,
        _prng = Prng(options.seed() ?? '');

  /// Deliberately not memoized — the seed is the only input we keep out of
  /// the [resolved] snapshot, so a serialized avatar never leaks it.
  String seed() => _options.seed() ?? '';

  double? size() => _memo('size', () => _options.size());

  bool idRandomization() =>
      _memo('idRandomization', () => _options.idRandomization() ?? false);

  String? title() => _memo('title', () => _options.title());

  String flip() =>
      _memo('flip', () => _prng.pick('flip', _options.flip()) ?? 'none');

  String fontFamily() => _memo(
        'fontFamily',
        () => _prng.pick('fontFamily', _options.fontFamily()) ?? 'system-ui',
      );

  double fontWeight() => _memo(
        'fontWeight',
        () => _prng.pick('fontWeight', _options.fontWeight()) ?? 400.0,
      );

  double scale() => _memoFloat('scale', _options.scale(), 1);

  double borderRadius() =>
      _memoFloat('borderRadius', _options.borderRadius(), 0);

  double rotate() => _memoFloat('rotate', _options.rotate(), 0);

  double translateX() => _memoFloat('translateX', _options.translateX(), 0);

  double translateY() => _memoFloat('translateY', _options.translateY(), 0);

  /// Selects a variant for the given component, or `null` when the component
  /// is unknown or rolled invisible. Depending on what was passed as
  /// `${name}Variant` in the input data:
  ///
  /// - unset: the PRNG picks from all style variants using their weights.
  /// - otherwise: the PRNG picks using the user-supplied weighted map (a bare
  ///   string or string list is normalized to weight `1` each in
  ///   [Options.componentVariant]).
  ///
  /// Only variants that exist in the style definition are considered. User
  /// option lookup uses the component's source name (so a single option
  /// propagates to every alias), while the PRNG keys use the element's own
  /// name — each alias rolls its own visibility and variant.
  String? variant(String name) {
    return _memo('${name}Variant', () {
      final component = _style.components[name];

      if (component == null || !_isVisible(name, component)) {
        return null;
      }

      final raw = _options.componentVariant(component.sourceName);
      final variants = component.variants();
      final weights = <String, double>{};

      if (raw == null) {
        for (final entry in variants.entries) {
          weights[entry.key] = entry.value.weight();
        }
      } else {
        for (final entry in raw.entries) {
          if (variants.containsKey(entry.key)) {
            weights[entry.key] = entry.value;
          }
        }
      }

      return _prng.weightedPick('${name}Variant', weights);
    });
  }

  /// Resolves a named color to its final stop list.
  ///
  /// The memo is also a DoS guard: a color already resolved this pass is
  /// returned from the snapshot instead of being recomputed. Without it, a
  /// graph where each color references the next via both `contrastTo` and
  /// `notEqualTo` re-resolves exponentially (a schema-valid hang).
  List<String> color(String name) =>
      _memo('${name}Color', () => _resolveColor(name));

  String colorFill(String name) => _memo(
        '${name}ColorFill',
        () =>
            _prng.pick('${name}ColorFill', _options.colorFill(name)) ?? 'solid',
      );

  /// Memoized like every float option, but only ever called while a gradient
  /// def is built — `${name}ColorAngle` therefore appears in the snapshot
  /// only for colors that actually rendered as a gradient.
  double colorAngle(String name) =>
      _memoFloat('${name}ColorAngle', _options.colorAngle(name), 0);

  /// Picks the rotate/translateX/translateY/scale values for a single
  /// component. Memoized per `name`, so the four values land in [resolved] as
  /// `${name}Rotate` / `${name}TranslateX` / `${name}TranslateY` /
  /// `${name}Scale` for downstream introspection — recorded in exactly that
  /// order, which the snapshot key order depends on.
  ({double rotate, double translateX, double translateY, double scale})
      componentTransform(String name) {
    final component = _style.components[name];

    // Record fields evaluate in source order: Rotate, TranslateX,
    // TranslateY, Scale — the same order the JS port memoizes them in.
    return (
      rotate: _memoFloat('${name}Rotate', component?.rotate(), 0),
      translateX:
          _memoFloat('${name}TranslateX', component?.translate().x(), 0),
      translateY:
          _memoFloat('${name}TranslateY', component?.translate().y(), 0),
      scale: _memoFloat('${name}Scale', component?.scale(), 1),
    );
  }

  /// Returns an informational snapshot of every value the resolver picked.
  /// Includes top-level options (scale/rotate/translate/…), per-component
  /// variants/colors, and per-component transform picks. The raw seed is
  /// deliberately excluded; unset values are recorded as `null` and filtered
  /// out on exposure (Avatar drops them, like `JSON.stringify` drops
  /// `undefined` properties in JS).
  ///
  /// The returned map aliases the internal cache; callers that need isolation
  /// (e.g. `Avatar.toJson`) clone it themselves.
  Map<String, Object?> resolved() => _result;

  /// Returns the visibility probability (0–100) for the given component.
  /// Aliases read the source component's user-set probability so a single
  /// `<source>Probability` option propagates to every alias of the source.
  double _probability(Component component) =>
      _options.componentProbability(component.sourceName) ??
      component.probability();

  // `${name}Probability` is a PRNG key but never a memo key — visibility
  // rolls are not part of the resolved snapshot in any port.
  bool _isVisible(String name, Component component) =>
      _prng.boolean('${name}Probability', _probability(component));

  /// Resolves a named color to its final stop list, applying contrast sorting
  /// and `notEqualTo` filtering from the style definition. Detects circular
  /// references between colors and throws [CircularColorReferenceError].
  List<String> _resolveColor(String name) {
    final userColors = _options.color(name);
    final styleColor = _style.colors[name];
    final source = userColors ?? styleColor?.values() ?? const <String>[];

    var candidates = [for (final c in source) Color.toHex(c)];

    // colorFill is memoized inside this computation, so it lands in the
    // snapshot before `${name}Color` — the memo writes after compute returns.
    final fill = colorFill(name);
    final stops = fill == 'solid' ? 1 : _colorFillStops(name);

    if (styleColor == null) {
      return _takeN(_prng.shuffle('${name}Color', candidates), stops);
    }

    // Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a).
    if (_colorResolving.contains(name)) {
      throw CircularColorReferenceError([..._colorResolving, name]);
    }

    _colorResolving.add(name);
    final contrastTo = _contrastTo(styleColor);
    final notEqualTo = styleColor.notEqualTo();

    try {
      if (contrastTo != null) {
        final refColors = color(contrastTo);

        if (refColors.isNotEmpty) {
          candidates = Color.sortByContrast(candidates, refColors[0]);
        }
      }

      if (notEqualTo.isNotEmpty) {
        final excluded = <String>[];

        for (final ref in notEqualTo) {
          excluded.addAll(color(ref));
        }

        candidates = Color.filterNotEqualTo(candidates, excluded);
      }
    } finally {
      _colorResolving.removeLast();
    }

    // Skip the shuffle when sorted by contrast, to preserve that ordering.
    final ordered = contrastTo != null
        ? candidates
        : _prng.shuffle('${name}Color', candidates);

    return _takeN(ordered, stops);
  }

  // The JS port's truthy check: an empty `contrastTo` counts as unset.
  static String? _contrastTo(ColorDefinition styleColor) {
    final value = styleColor.contrastTo();

    return value == null || value.isEmpty ? null : value;
  }

  /// Draws the gradient stop count, defaulting to `2`. Not memoized — the
  /// `${name}ColorFillStops` PRNG key never appears in the snapshot.
  int _colorFillStops(String name) {
    final range = _options.colorFillStops(name);

    return range != null ? _prng.integer('${name}ColorFillStops', range) : 2;
  }

  double _memoFloat(String key, Range? range, double fallback) =>
      _memo(key, () => range != null ? _prng.float(key, range) : fallback);

  T _memo<T>(String key, T Function() compute) {
    if (_result.containsKey(key)) {
      return _result[key] as T;
    }

    final value = compute();

    _result[key] = value;

    return value;
  }

  /// Returns a copy of the first [n] elements of [list] (or all of them when
  /// [n] is larger), mirroring the JS `slice(0, stops)`. Negative counts are
  /// clamped to 0, like the Go and Rust ports — the schema forbids them.
  static List<String> _takeN(List<String> list, int n) {
    if (n > list.length) {
      n = list.length;
    }

    if (n < 0) {
      n = 0;
    }

    return list.sublist(0, n);
  }
}
