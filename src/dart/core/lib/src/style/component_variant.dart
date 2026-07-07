/// Read-only view over an entry in a component's `variants` block.
library;

import 'element.dart';

/// A single variant of a component: the element subtree it renders and its
/// weighted-pick weight.
class ComponentVariant {
  final Map<String, Object?> _data;
  List<ElementNode>? _elements;

  ComponentVariant(Map<String, Object?> data) : _data = data;

  /// Returns the variant's elements, lazily wrapped as [ElementNode]
  /// instances on first access.
  List<ElementNode> elements() => _elements ??= List.unmodifiable(
        (_data['elements'] as List<Object?>)
            .map((element) => ElementNode(element as Map<String, Object?>)),
      );

  /// Returns the weighted-pick weight for this variant, defaulting to `1`.
  double weight() {
    final weight = _data['weight'];

    return weight == null ? 1 : (weight as num).toDouble();
  }
}
