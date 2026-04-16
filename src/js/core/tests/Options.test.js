import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style } from '../lib/index.js';
import { Options } from '../lib/Options.js';
import { OptionsValidationError } from '../lib/Error/OptionsValidationError.js';
import { ValidationError } from '../lib/Error/ValidationError.js';
import { CircularColorReferenceError } from '../lib/Error/CircularColorReferenceError.js';

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
  eyesRotate: [-10, 10],
  translateX: [-5, 5],
  eyesTranslateX: [-3, 3],
  translateY: [-2, 2],
  mouthTranslateY: [0, 4],
};

describe('Options', () => {
  describe('constructor', () => {
    it('should accept minimal options', () => {
      const options = new Options(minimalStyle, minimal);

      assert.ok(options);
    });

    it('should accept full options', () => {
      const options = new Options(minimalStyle, full);

      assert.ok(options);
    });

    it('should throw OptionsValidationError for invalid data', () => {
      assert.throws(() => new Options(minimalStyle, { size: -1 }), OptionsValidationError);
    });

    it('should throw an instance of ValidationError', () => {
      assert.throws(() => new Options(minimalStyle, { size: -1 }), ValidationError);
    });

    it('should throw an instance of Error', () => {
      assert.throws(() => new Options(minimalStyle, { size: -1 }), Error);
    });

    it('should include details on the error', () => {
      try {
        new Options(minimalStyle, { size: -1 });
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof OptionsValidationError);
        assert.ok(Array.isArray(e.details));
        assert.ok(e.details.length > 0);
      }
    });
  });

  describe('defaults', () => {
    it('should return defaults for unset properties', () => {
      const options = new Options(minimalStyle, minimal);

      assert.equal(options.seed(), '');
      assert.equal(options.size(), undefined);
      assert.equal(options.idRandomization(), false);
      assert.equal(options.flip(), 'none');
      assert.equal(options.fontFamily(), 'system-ui');
      assert.equal(options.fontWeight(), 400);
      assert.equal(options.scale(), 1);
      assert.equal(options.borderRadius(), 0);
    });

    it('should return defaults for pattern properties', () => {
      const options = new Options(minimalStyle, minimal);

      assert.equal(options.variant('eyes'), undefined);
      assert.deepEqual(options.color('skin'), []);
      assert.equal(options.colorFill('skin'), 'solid');
      assert.equal(options.rotate(), 0);
      assert.equal(options.rotate('eyes'), 0);
      assert.equal(options.translateX(), 0);
      assert.equal(options.translateY(), 0);
    });
  });

  describe('single values', () => {
    it('should return single values as-is', () => {
      const options = new Options(minimalStyle, {
        seed: 'my-seed',
        size: 256,
        idRandomization: true,
        flip: 'horizontal',
        fontFamily: 'Arial',
        fontWeight: 700,
        scale: 1.5,
        borderRadius: 25,
      });

      assert.equal(options.seed(), 'my-seed');
      assert.equal(options.size(), 256);
      assert.equal(options.idRandomization(), true);
      assert.equal(options.flip(), 'horizontal');
      assert.equal(options.fontFamily(), 'Arial');
      assert.equal(options.fontWeight(), 700);
      assert.equal(options.scale(), 1.5);
      assert.equal(options.borderRadius(), 25);
    });

    it('should return single pattern property values as-is', () => {
      const options = new Options(minimalStyle, {
        eyesProbability: 80,
        eyesVariant: 'open',
        skinColor: '#f0c8a0',
        rotate: 45,
        eyesRotate: -10,
        translateX: 5,
        translateY: -3,
      });

      assert.equal(options.variant('eyes'), undefined);
      assert.deepEqual(options.color('skin'), ['#f0c8a0']);
      assert.equal(options.rotate(), 45);
      assert.equal(options.rotate('eyes'), -10);
      assert.equal(options.translateX(), 5);
      assert.equal(options.translateY(), -3);
    });
  });

  describe('PRNG resolution', () => {
    it('should be deterministic for the same seed', () => {
      const a = new Options(minimalStyle, full);
      const b = new Options(minimalStyle, full);

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
      const a = new Options(minimalStyle, { ...full, seed: 'seed-a' });
      const b = new Options(minimalStyle, { ...full, seed: 'seed-b' });

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
      const options = new Options(minimalStyle, {
        seed: 'pick-test',
        flip: ['horizontal', 'vertical'],
        eyesVariant: ['open', 'closed', 'wink'],
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
      });

      assert.ok(['horizontal', 'vertical'].includes(options.flip()));
      assert.equal(options.variant('eyes'), undefined);
      assert.equal(options.color('skin').length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(options.color('skin')[0]));
    });

    it('should pick colorFill from arrays', () => {
      const options = new Options(minimalStyle, {
        seed: 'fill-test',
        skinColorFill: ['solid', 'linear', 'radial'],
      });

      assert.ok(['solid', 'linear', 'radial'].includes(options.colorFill('skin')));
    });

    it('should return colorFillStops colors for gradient fills', () => {
      const options = new Options(minimalStyle, {
        seed: 'gradient-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'linear',
        skinColorFillStops: 2,
      });

      const colors = options.color('skin');

      assert.equal(colors.length, 2);

      for (const c of colors) {
        assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(c));
      }
    });

    it('should default to 2 stops for gradient fills', () => {
      const options = new Options(minimalStyle, {
        seed: 'gradient-default-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'radial',
      });

      assert.equal(options.color('skin').length, 2);
    });

    it('should return single color for solid fill', () => {
      const options = new Options(minimalStyle, {
        seed: 'solid-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'solid',
      });

      const colors = options.color('skin');

      assert.equal(colors.length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(colors[0]));
    });

    it('should interpolate ranges', () => {
      const options = new Options(minimalStyle, {
        seed: 'range-test',
        scale: [0.8, 1.2],
        borderRadius: [0, 50],
        rotate: [-15, 15],
        translateX: [-5, 5],
      });

      assert.ok(options.scale() >= 0.8 && options.scale() <= 1.2);
      assert.ok(options.borderRadius() >= 0 && options.borderRadius() <= 50);
      assert.ok(options.rotate() >= -15 && options.rotate() <= 15);
      assert.ok(options.translateX() >= -5 && options.translateX() <= 5);
    });

    it('should pick from fontWeight array (not interpolate)', () => {
      const options = new Options(minimalStyle, {
        seed: 'fw-test',
        fontWeight: [400, 700],
      });

      assert.ok([400, 700].includes(options.fontWeight()));
    });
  });

  describe('probability / visibility', () => {
    it('should return variant when probability is 100', () => {
      const options = new Options(styleWithComponents, {
        seed: 'visible-test',
        eyesProbability: 100,
      });

      assert.ok(options.variant('eyes'));
    });

    it('should return undefined variant when probability is 0', () => {
      const options = new Options(styleWithComponents, {
        seed: 'hidden-test',
        eyesProbability: 0,
      });

      assert.equal(options.variant('eyes'), undefined);
    });

    it('should return variant when probability is not set', () => {
      const options = new Options(styleWithComponents, {
        seed: 'default-visible-test',
      });

      assert.ok(options.variant('eyes'));
    });
  });

  describe('colorFillStops via color()', () => {
    it('should respect custom stops count', () => {
      const options = new Options(minimalStyle, {
        seed: 'stops-test',
        skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
        skinColorFill: 'linear',
        skinColorFillStops: 3,
      });

      assert.equal(options.color('skin').length, 3);
    });

    it('should pick integer stops from range', () => {
      for (let i = 0; i < 20; i++) {
        const options = new Options(minimalStyle, {
          seed: `stops-${i}`,
          skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'],
          skinColorFill: 'radial',
          skinColorFillStops: [2, 4],
        });

        const count = options.color('skin').length;

        assert.ok(count >= 2 && count <= 4);
      }
    });
  });

  describe('component-specific transforms', () => {
    it('should resolve component-specific rotate', () => {
      const options = new Options(minimalStyle, {
        seed: 'transform-test',
        eyesRotate: [-10, 10],
      });

      const value = options.rotate('eyes');

      assert.ok(value >= -10 && value <= 10);
    });

    it('should resolve component-specific translateX', () => {
      const options = new Options(minimalStyle, {
        seed: 'transform-test',
        eyesTranslateX: [-5, 5],
      });

      const value = options.translateX('eyes');

      assert.ok(value >= -5 && value <= 5);
    });

    it('should resolve component-specific translateY', () => {
      const options = new Options(minimalStyle, {
        seed: 'transform-test',
        mouthTranslateY: [0, 4],
      });

      const value = options.translateY('mouth');

      assert.ok(value >= 0 && value <= 4);
    });

    it('should resolve root and component transforms independently', () => {
      const options = new Options(minimalStyle, {
        seed: 'independent-test',
        rotate: 45,
        eyesRotate: [-10, 10],
      });

      assert.equal(options.rotate(), 45);
      assert.notEqual(options.rotate('eyes'), 45);
    });
  });

  describe('variant constraints', () => {
    it('should only pick from style-defined variants', () => {
      const options = new Options(styleWithComponents, {
        seed: 'variant-test',
        eyesVariant: ['open', 'closed', 'invalid'],
      });

      const result = options.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
      assert.notEqual(result, 'invalid');
    });

    it('should return undefined when no user variants match', () => {
      const options = new Options(styleWithComponents, {
        seed: 'fallback-test',
        eyesVariant: ['invalid1', 'invalid2'],
      });

      assert.equal(options.variant('eyes'), undefined);
    });

    it('should yield undefined variant for an empty variant array', () => {
      const options = new Options(styleWithComponents, {
        seed: 'empty-test',
        eyesVariant: [],
      });

      assert.equal(options.variant('eyes'), undefined);
    });

    it('should pick from style variants when no option is set', () => {
      const options = new Options(styleWithComponents, {
        seed: 'default-test',
      });

      const result = options.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
    });

    it('should return undefined when component does not exist in style', () => {
      const options = new Options(minimalStyle, {
        seed: 'no-component-test',
        eyesVariant: 'open',
      });

      assert.equal(options.variant('eyes'), undefined);
    });
  });

  describe('color constraints', () => {
    it('should sort by contrast when contrastTo is set', () => {
      const options = new Options(styleWithColors, {
        seed: 'contrast-test',
        skinColor: '#f0c8a0',
        backgroundColor: ['#ffffff', '#000000', '#cccccc'],
      });

      const colors = options.color('background');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#000000');
    });

    it('should filter colors matching notEqualTo references', () => {
      const options = new Options(styleWithColors, {
        seed: 'not-equal-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0', '#2c1b18', '#b55239'],
      });

      const colors = options.color('hair');

      assert.equal(colors.length, 1);
      assert.notEqual(colors[0], '#f0c8a0');
    });

    it('should ignore notEqualTo when all colors would be filtered', () => {
      const options = new Options(styleWithColors, {
        seed: 'all-filtered-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0'],
      });

      const colors = options.color('hair');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#f0c8a0');
    });

    it('should cache color results', () => {
      const options = new Options(styleWithColors, {
        seed: 'cache-test',
        skinColor: ['#f0c8a0', '#d4a574'],
      });

      assert.equal(options.color('skin'), options.color('skin'));
    });

    it('should handle colors without style definition', () => {
      const options = new Options(minimalStyle, {
        seed: 'no-style-test',
        customColor: ['#ff0000', '#00ff00'],
      });

      const colors = options.color('custom');

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

      const options = new Options(style, {
        seed: 'circular-test',
        aColor: ['#ff0000', '#00ff00'],
        bColor: ['#0000ff', '#ffffff'],
      });

      try {
        options.color('a');
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

      const options = new Options(style, {
        seed: 'circular-not-equal-test',
        aColor: ['#ff0000'],
        bColor: ['#00ff00'],
      });

      try {
        options.color('a');
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
      const options = new Options(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
        scale: [0.5, 1],
      });

      options.seed();
      options.flip();
      options.scale();

      const resolved = options.resolved();

      assert.equal(resolved.seed, 'test');
      assert.ok(['horizontal', 'vertical', 'none'].includes(resolved.flip));
      assert.equal(typeof resolved.scale, 'number');
    });

    it('should include variant values', () => {
      const options = new Options(styleWithComponents, {
        seed: 'test',
        eyesVariant: ['open', 'closed'],
      });

      options.variant('eyes');

      const resolved = options.resolved();

      assert.ok('eyesVariant' in resolved);
      assert.ok(['open', 'closed', 'wink'].includes(resolved.eyesVariant));
    });

    it('should include color values', () => {
      const options = new Options(styleWithColors, {
        seed: 'test',
        skinColor: ['#ff0000', '#00ff00'],
      });

      options.color('skin');

      const resolved = options.resolved();

      assert.ok('skinColor' in resolved);
      assert.ok(Array.isArray(resolved.skinColor));
    });

    it('should return memoized values on repeated calls', () => {
      const options = new Options(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
      });

      const first = options.flip();
      const second = options.flip();

      assert.equal(first, second);
    });
  });

  describe('variant weights', () => {
    it('should never pick a weight-0 variant via PRNG', () => {
      for (let i = 0; i < 100; i++) {
        const options = new Options(styleWithWeights, { seed: `weight-${i}` });
        const result = options.variant('eyes');

        assert.notEqual(result, 'hidden');
      }
    });

    it('should allow weight-0 variant when explicitly specified as string', () => {
      const options = new Options(styleWithWeights, {
        seed: 'explicit-hidden',
        eyesVariant: 'hidden',
      });

      assert.equal(options.variant('eyes'), 'hidden');
    });

    it('should favor higher-weight variants', () => {
      let commonCount = 0;

      for (let i = 0; i < 200; i++) {
        const options = new Options(styleWithWeights, { seed: `favor-${i}` });

        if (options.variant('eyes') === 'common') {
          commonCount++;
        }
      }

      assert.ok(commonCount > 100, `Expected common to be picked most of the time, got ${commonCount}/200`);
    });

    it('should override weights via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const options = new Options(styleWithWeights, {
          seed: `override-${i}`,
          eyesVariant: { hidden: 1 },
        });

        assert.equal(options.variant('eyes'), 'hidden');
      }
    });

    it('should filter and weight via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const options = new Options(styleWithWeights, {
          seed: `filter-${i}`,
          eyesVariant: { common: 1, rare: 1 },
        });

        const result = options.variant('eyes');

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
      const options = new Options(style, { seed: 'all-zero' });

      assert.ok(['a', 'b'].includes(options.variant('eyes')));
    });

    it('should be deterministic with weights', () => {
      const a = new Options(styleWithWeights, { seed: 'deterministic-test' });
      const b = new Options(styleWithWeights, { seed: 'deterministic-test' });

      assert.equal(a.variant('eyes'), b.variant('eyes'));
    });
  });

  describe('colorAngle', () => {
    it('should return 0 by default', () => {
      const options = new Options(minimalStyle, {});

      assert.equal(options.colorAngle('skin'), 0);
    });

    it('should return single value as-is', () => {
      const options = new Options(minimalStyle, {
        skinColorAngle: 45,
      });

      assert.equal(options.colorAngle('skin'), 45);
    });

    it('should interpolate range', () => {
      const options = new Options(minimalStyle, {
        seed: 'angle-test',
        skinColorAngle: [-90, 90],
      });

      const value = options.colorAngle('skin');

      assert.ok(value >= -90 && value <= 90);
    });
  });
});
