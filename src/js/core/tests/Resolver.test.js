import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Style } from '../lib/index.js';
import { Options } from '../lib/Options.js';
import { Resolver } from '../lib/Resolver.js';
import { CircularColorReferenceError } from '../lib/Error/CircularColorReferenceError.js';

const makeResolver = (style, data = {}) => new Resolver(style, new Options(data));

const aliasFixture = JSON.parse(
  readFileSync(
    join(import.meta.dirname, '..', '..', '..', '..', 'tests', 'fixtures', 'parity', 'styles', 'aliasTest.json'),
    'utf8',
  ),
);

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

const styleWithComponents = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 50,
      height: 50,
      variants: {
        open: { elements: [] },
        closed: { elements: [] },
        wink: { elements: [] },
      },
    },
  },
});

const styleWithColors = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  colors: {
    skin: {
      values: ['#f0c8a0', '#d4a574', '#8d5524'],
    },
    hair: {
      values: ['#2c1b18', '#b55239', '#d6b370'],
      notEqualTo: ['skin'],
    },
    background: {
      values: ['#ffffff', '#000000', '#cccccc'],
      contrastTo: 'skin',
    },
  },
});

const styleWithWeights = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 50,
      height: 50,
      variants: {
        common: { elements: [], weight: 10 },
        rare: { elements: [], weight: 1 },
        hidden: { elements: [], weight: 0 },
      },
    },
  },
});

const minimal = {};

const full = {
  seed: 'test-seed',
  size: 128,
  idRandomization: true,
  flip: ['horizontal', 'vertical'],
  fontFamily: ['Arial', 'Helvetica'],
  fontWeight: [400, 700],
  scale: [0.8, 1.2],
  borderRadius: [0, 50],
  eyesProbability: 80,
  eyesVariant: ['open', 'closed', 'wink'],
  skinColor: ['#f0c8a0', '#d4a574'],
  rotate: [-15, 15],
  translateX: [-5, 5],
  translateY: [-2, 2],
};

describe('Resolver', () => {
  describe('constructor', () => {
    it('should accept minimal options', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.ok(resolver);
    });

    it('should accept full options', () => {
      const resolver = makeResolver(minimalStyle, full);

      assert.ok(resolver);
    });
  });

  describe('defaults', () => {
    it('should return defaults for unset properties', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.equal(resolver.seed(), '');
      assert.equal(resolver.size(), undefined);
      assert.equal(resolver.idRandomization(), false);
      assert.equal(resolver.flip(), 'none');
      assert.equal(resolver.fontFamily(), 'system-ui');
      assert.equal(resolver.fontWeight(), 400);
      assert.equal(resolver.scale(), 1);
      assert.equal(resolver.borderRadius(), 0);
    });

    it('should return defaults for pattern properties', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.equal(resolver.variant('eyes'), undefined);
      assert.deepEqual(resolver.color('skin'), []);
      assert.equal(resolver.colorFill('skin'), 'solid');
      assert.equal(resolver.rotate(), 0);
      assert.equal(resolver.translateX(), 0);
      assert.equal(resolver.translateY(), 0);
    });
  });

  describe('single values', () => {
    it('should return single values as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'my-seed',
        size: 256,
        idRandomization: true,
        flip: 'horizontal',
        fontFamily: 'Arial',
        fontWeight: 700,
        scale: 1.5,
        borderRadius: 25,
      });

      assert.equal(resolver.seed(), 'my-seed');
      assert.equal(resolver.size(), 256);
      assert.equal(resolver.idRandomization(), true);
      assert.equal(resolver.flip(), 'horizontal');
      assert.equal(resolver.fontFamily(), 'Arial');
      assert.equal(resolver.fontWeight(), 700);
      assert.equal(resolver.scale(), 1.5);
      assert.equal(resolver.borderRadius(), 25);
    });

    it('should return single pattern property values as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        eyesProbability: 80,
        eyesVariant: 'open',
        skinColor: '#f0c8a0',
        rotate: 45,
        translateX: 5,
        translateY: -3,
      });

      assert.equal(resolver.variant('eyes'), undefined);
      assert.deepEqual(resolver.color('skin'), ['#f0c8a0']);
      assert.equal(resolver.rotate(), 45);
      assert.equal(resolver.translateX(), 5);
      assert.equal(resolver.translateY(), -3);
    });
  });

  describe('PRNG resolution', () => {
    it('should be deterministic for the same seed', () => {
      const a = makeResolver(minimalStyle, full);
      const b = makeResolver(minimalStyle, full);

      assert.equal(a.flip(), b.flip());
      assert.equal(a.fontFamily(), b.fontFamily());
      assert.equal(a.fontWeight(), b.fontWeight());
      assert.equal(a.scale(), b.scale());
      assert.equal(a.borderRadius(), b.borderRadius());
      assert.equal(a.variant('eyes'), b.variant('eyes'));
      assert.deepEqual(a.color('skin'), b.color('skin'));
      assert.equal(a.rotate(), b.rotate());
      assert.equal(a.translateX(), b.translateX());
    });

    it('should produce different results for different seeds', () => {
      const a = makeResolver(minimalStyle, { ...full, seed: 'seed-a' });
      const b = makeResolver(minimalStyle, { ...full, seed: 'seed-b' });

      const results = [
        a.flip() !== b.flip(),
        a.fontFamily() !== b.fontFamily(),
        a.scale() !== b.scale(),
        a.rotate() !== b.rotate(),
        a.variant('eyes') !== b.variant('eyes'),
      ];

      assert.ok(results.some(Boolean));
    });

    it('should pick from arrays', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'pick-test',
        flip: ['horizontal', 'vertical'],
        eyesVariant: ['open', 'closed', 'wink'],
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
      });

      assert.ok(['horizontal', 'vertical'].includes(resolver.flip()));
      assert.equal(resolver.variant('eyes'), undefined);
      assert.equal(resolver.color('skin').length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(resolver.color('skin')[0]));
    });

    it('should pick colorFill from arrays', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'fill-test',
        skinColorFill: ['solid', 'linear', 'radial'],
      });

      assert.ok(['solid', 'linear', 'radial'].includes(resolver.colorFill('skin')));
    });

    it('should return colorFillStops colors for gradient fills', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'gradient-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'linear',
        skinColorFillStops: 2,
      });

      const colors = resolver.color('skin');

      assert.equal(colors.length, 2);

      for (const c of colors) {
        assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(c));
      }
    });

    it('should default to 2 stops for gradient fills', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'gradient-default-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'radial',
      });

      assert.equal(resolver.color('skin').length, 2);
    });

    it('should return single color for solid fill', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'solid-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'solid',
      });

      const colors = resolver.color('skin');

      assert.equal(colors.length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(colors[0]));
    });

    it('should interpolate ranges', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'range-test',
        scale: [0.8, 1.2],
        borderRadius: [0, 50],
        rotate: [-15, 15],
        translateX: [-5, 5],
      });

      assert.ok(resolver.scale() >= 0.8 && resolver.scale() <= 1.2);
      assert.ok(resolver.borderRadius() >= 0 && resolver.borderRadius() <= 50);
      assert.ok(resolver.rotate() >= -15 && resolver.rotate() <= 15);
      assert.ok(resolver.translateX() >= -5 && resolver.translateX() <= 5);
    });

    it('should pick from fontWeight array (not interpolate)', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'fw-test',
        fontWeight: [400, 700],
      });

      assert.ok([400, 700].includes(resolver.fontWeight()));
    });
  });

  describe('probability / visibility', () => {
    it('should return variant when probability is 100', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'visible-test',
        eyesProbability: 100,
      });

      assert.ok(resolver.variant('eyes'));
    });

    it('should return undefined variant when probability is 0', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'hidden-test',
        eyesProbability: 0,
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should return variant when probability is not set', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'default-visible-test',
      });

      assert.ok(resolver.variant('eyes'));
    });
  });

  describe('colorFillStops via color()', () => {
    it('should respect custom stops count', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'stops-test',
        skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
        skinColorFill: 'linear',
        skinColorFillStops: 3,
      });

      assert.equal(resolver.color('skin').length, 3);
    });

    it('should pick integer stops from range', () => {
      for (let i = 0; i < 20; i++) {
        const resolver = makeResolver(minimalStyle, {
          seed: `stops-${i}`,
          skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'],
          skinColorFill: 'radial',
          skinColorFillStops: [2, 4],
        });

        const count = resolver.color('skin').length;

        assert.ok(count >= 2 && count <= 4);
      }
    });
  });

  describe('componentTransform()', () => {
    it('should default to identity transform when component has no definition ranges', () => {
      const resolver = makeResolver(styleWithComponents, { seed: 'identity' });
      const t = resolver.componentTransform('eyes');

      assert.equal(t.rotate, 0);
      assert.equal(t.translateX, 0);
      assert.equal(t.translateY, 0);
      assert.equal(t.scale, 1);
    });

    it('should draw rotate from the component definition range', () => {
      const styleWithRotate = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          eyes: {
            width: 50,
            height: 50,
            rotate: [-10, 10],
            variants: { open: { elements: [] } },
          },
        },
      });
      const resolver = makeResolver(styleWithRotate, { seed: 'rotate' });
      const t = resolver.componentTransform('eyes');

      assert.ok(t.rotate >= -10 && t.rotate <= 10);
    });

    it('should be deterministic for the same seed', () => {
      const a = makeResolver(styleWithComponents, { seed: 'pick' });
      const b = makeResolver(styleWithComponents, { seed: 'pick' });

      assert.deepEqual(a.componentTransform('eyes'), b.componentTransform('eyes'));
    });

    it('should return identity for an unknown component name', () => {
      const resolver = makeResolver(minimalStyle, { seed: 'unknown' });
      const t = resolver.componentTransform('missing');

      assert.equal(t.rotate, 0);
      assert.equal(t.translateX, 0);
      assert.equal(t.translateY, 0);
      assert.equal(t.scale, 1);
    });
  });

  describe('component aliases', () => {
    const aliasStyle = new Style(aliasFixture);

    it('should silently ignore user options keyed against an alias component', () => {
      const resolver = makeResolver(aliasStyle, {
        seed: 'alias-key-ignored',
        eyesVariant: 'a',
        eyesRightVariant: 'b',
      });

      assert.equal(resolver.variant('eyes'), 'a');
      assert.equal(resolver.variant('eyesRight'), 'a');
    });

    it('should propagate the source probability to the alias', () => {
      const resolver = makeResolver(aliasStyle, {
        seed: 'alias-probability',
        eyesProbability: 0,
      });

      assert.equal(resolver.variant('eyes'), undefined);
      assert.equal(resolver.variant('eyesRight'), undefined);
    });

    it('should resolve the alias variant via the source component variants', () => {
      const resolver = makeResolver(aliasStyle, { seed: 'alias-variant' });
      const result = resolver.variant('eyesRight');

      const sourceVariants = aliasStyle
        .components()
        .get('eyes')
        .variants();

      assert.ok(sourceVariants.has(result));
    });
  });

  describe('variant constraints', () => {
    it('should only pick from style-defined variants', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'variant-test',
        eyesVariant: ['open', 'closed', 'invalid'],
      });

      const result = resolver.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
      assert.notEqual(result, 'invalid');
    });

    it('should return undefined when no user variants match', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'fallback-test',
        eyesVariant: ['invalid1', 'invalid2'],
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should yield undefined variant for an empty variant array', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'empty-test',
        eyesVariant: [],
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should pick from style variants when no option is set', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'default-test',
      });

      const result = resolver.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
    });

    it('should return undefined when component does not exist in style', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'no-component-test',
        eyesVariant: 'open',
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });
  });

  describe('color constraints', () => {
    it('should sort by contrast when contrastTo is set', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'contrast-test',
        skinColor: '#f0c8a0',
        backgroundColor: ['#ffffff', '#000000', '#cccccc'],
      });

      const colors = resolver.color('background');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#000000');
    });

    it('should filter colors matching notEqualTo references', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'not-equal-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0', '#2c1b18', '#b55239'],
      });

      const colors = resolver.color('hair');

      assert.equal(colors.length, 1);
      assert.notEqual(colors[0], '#f0c8a0');
    });

    it('should ignore notEqualTo when all colors would be filtered', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'all-filtered-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0'],
      });

      const colors = resolver.color('hair');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#f0c8a0');
    });

    it('should cache color results', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'cache-test',
        skinColor: ['#f0c8a0', '#d4a574'],
      });

      assert.equal(resolver.color('skin'), resolver.color('skin'));
    });

    it('should handle colors without style definition', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'no-style-test',
        customColor: ['#ff0000', '#00ff00'],
      });

      const colors = resolver.color('custom');

      assert.equal(colors.length, 1);
      assert.ok(['#ff0000', '#00ff00'].includes(colors[0]));
    });

    it('should throw CircularColorReferenceError on circular contrastTo', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        colors: {
          a: { values: ['#ff0000', '#00ff00'], contrastTo: 'b' },
          b: { values: ['#0000ff', '#ffffff'], contrastTo: 'a' },
        },
      });

      const resolver = makeResolver(style, {
        seed: 'circular-test',
        aColor: ['#ff0000', '#00ff00'],
        bColor: ['#0000ff', '#ffffff'],
      });

      try {
        resolver.color('a');
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof CircularColorReferenceError);
        assert.deepEqual(e.chain, ['a', 'b', 'a']);
        assert.ok(e.message.includes('a → b → a'));
      }
    });

    it('should throw CircularColorReferenceError on circular notEqualTo', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        colors: {
          a: { values: ['#ff0000'], notEqualTo: ['b'] },
          b: { values: ['#00ff00'], notEqualTo: ['a'] },
        },
      });

      const resolver = makeResolver(style, {
        seed: 'circular-not-equal-test',
        aColor: ['#ff0000'],
        bColor: ['#00ff00'],
      });

      try {
        resolver.color('a');
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof CircularColorReferenceError);
        assert.deepEqual(e.chain, ['a', 'b', 'a']);
        assert.ok(e.message.includes('a → b → a'));
      }
    });
  });

  describe('resolved()', () => {
    it('should include consumed values', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
        scale: [0.5, 1],
      });

      resolver.seed();
      resolver.flip();
      resolver.scale();

      const resolved = resolver.resolved();

      assert.equal(resolved.seed, 'test');
      assert.ok(['horizontal', 'vertical', 'none'].includes(resolved.flip));
      assert.equal(typeof resolved.scale, 'number');
    });

    it('should include variant values', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'test',
        eyesVariant: ['open', 'closed'],
      });

      resolver.variant('eyes');

      const resolved = resolver.resolved();

      assert.ok('eyesVariant' in resolved);
      assert.ok(['open', 'closed', 'wink'].includes(resolved.eyesVariant));
    });

    it('should include color values', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'test',
        skinColor: ['#ff0000', '#00ff00'],
      });

      resolver.color('skin');

      const resolved = resolver.resolved();

      assert.ok('skinColor' in resolved);
      assert.ok(Array.isArray(resolved.skinColor));
    });

    it('should return memoized values on repeated calls', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
      });

      const first = resolver.flip();
      const second = resolver.flip();

      assert.equal(first, second);
    });
  });

  describe('variant weights', () => {
    it('should never pick a weight-0 variant via PRNG', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, { seed: `weight-${i}` });
        const result = resolver.variant('eyes');

        assert.notEqual(result, 'hidden');
      }
    });

    it('should allow weight-0 variant when explicitly specified as string', () => {
      const resolver = makeResolver(styleWithWeights, {
        seed: 'explicit-hidden',
        eyesVariant: 'hidden',
      });

      assert.equal(resolver.variant('eyes'), 'hidden');
    });

    it('should favor higher-weight variants', () => {
      let commonCount = 0;

      for (let i = 0; i < 200; i++) {
        const resolver = makeResolver(styleWithWeights, { seed: `favor-${i}` });

        if (resolver.variant('eyes') === 'common') {
          commonCount++;
        }
      }

      assert.ok(commonCount > 100, `Expected common to be picked most of the time, got ${commonCount}/200`);
    });

    it('should override weights via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, {
          seed: `override-${i}`,
          eyesVariant: { hidden: 1 },
        });

        assert.equal(resolver.variant('eyes'), 'hidden');
      }
    });

    it('should filter and weight via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, {
          seed: `filter-${i}`,
          eyesVariant: { common: 1, rare: 1 },
        });

        const result = resolver.variant('eyes');

        assert.ok(['common', 'rare'].includes(result));
      }
    });

    it('should fall back to uniform pick when all variants have weight 0', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          eyes: {
            width: 50,
            height: 50,
            variants: {
              a: { elements: [], weight: 0 },
              b: { elements: [], weight: 0 },
            },
          },
        },
      });
      const resolver = makeResolver(style, { seed: 'all-zero' });

      assert.ok(['a', 'b'].includes(resolver.variant('eyes')));
    });

    it('should be deterministic with weights', () => {
      const a = makeResolver(styleWithWeights, { seed: 'deterministic-test' });
      const b = makeResolver(styleWithWeights, { seed: 'deterministic-test' });

      assert.equal(a.variant('eyes'), b.variant('eyes'));
    });
  });

  describe('colorAngle', () => {
    it('should return 0 by default', () => {
      const resolver = makeResolver(minimalStyle, {});

      assert.equal(resolver.colorAngle('skin'), 0);
    });

    it('should return single value as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        skinColorAngle: 45,
      });

      assert.equal(resolver.colorAngle('skin'), 45);
    });

    it('should interpolate range', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'angle-test',
        skinColorAngle: [-90, 90],
      });

      const value = resolver.colorAngle('skin');

      assert.ok(value >= -90 && value <= 90);
    });
  });
});
