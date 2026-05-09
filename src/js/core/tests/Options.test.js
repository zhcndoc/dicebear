import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Options } from '../lib/Options.js';
import { OptionsValidationError } from '../lib/Error/OptionsValidationError.js';
import { ValidationError } from '../lib/Error/ValidationError.js';

describe('Options', () => {
  describe('constructor', () => {
    it('should accept an empty data object', () => {
      assert.ok(new Options({}));
    });

    it('should accept full input data', () => {
      assert.ok(
        new Options({
          seed: 'test-seed',
          size: 128,
          flip: 'horizontal',
          scale: 1.2,
        }),
      );
    });

    it('should throw OptionsValidationError for invalid data', () => {
      assert.throws(() => new Options({ size: -1 }), OptionsValidationError);
    });

    it('should throw an instance of ValidationError', () => {
      assert.throws(() => new Options({ size: -1 }), ValidationError);
    });

    it('should include details on the validation error', () => {
      try {
        new Options({ size: -1 });
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof OptionsValidationError);
        assert.ok(Array.isArray(e.details));
        assert.ok(e.details.length > 0);
      }
    });

    it('should isolate internal state from caller mutations', () => {
      const input = { seed: 'orig' };
      const options = new Options(input);

      input.seed = 'mutated';

      assert.equal(options.seed(), 'orig');
    });
  });

  describe('scalar passthroughs', () => {
    it('should return undefined when not set', () => {
      const options = new Options({});

      assert.equal(options.seed(), undefined);
      assert.equal(options.size(), undefined);
      assert.equal(options.idRandomization(), undefined);
      assert.equal(options.title(), undefined);
    });

    it('should return user-set scalar values', () => {
      const options = new Options({
        seed: 'abc',
        size: 256,
        idRandomization: true,
        title: 'My Avatar',
      });

      assert.equal(options.seed(), 'abc');
      assert.equal(options.size(), 256);
      assert.equal(options.idRandomization(), true);
      assert.equal(options.title(), 'My Avatar');
    });
  });

  describe('top-level array normalization', () => {
    it('should normalize a scalar value to a one-element array', () => {
      const options = new Options({ flip: 'horizontal', scale: 1.5 });

      assert.deepEqual(options.flip(), ['horizontal']);
      assert.deepEqual(options.scale(), [1.5]);
    });

    it('should pass an array through unchanged', () => {
      const options = new Options({ flip: ['horizontal', 'vertical'], scale: [0.8, 1.2] });

      assert.deepEqual(options.flip(), ['horizontal', 'vertical']);
      assert.deepEqual(options.scale(), [0.8, 1.2]);
    });

    it('should return an empty array when unset', () => {
      const options = new Options({});

      assert.deepEqual(options.flip(), []);
      assert.deepEqual(options.fontFamily(), []);
      assert.deepEqual(options.fontWeight(), []);
      assert.deepEqual(options.scale(), []);
      assert.deepEqual(options.borderRadius(), []);
      assert.deepEqual(options.rotate(), []);
      assert.deepEqual(options.translateX(), []);
      assert.deepEqual(options.translateY(), []);
    });
  });

  describe('componentVariant()', () => {
    it('should return undefined when unset', () => {
      assert.equal(new Options({}).componentVariant('eyes'), undefined);
    });

    it('should normalize a string to a one-element array', () => {
      const options = new Options({ eyesVariant: 'open' });

      assert.deepEqual(options.componentVariant('eyes'), ['open']);
    });

    it('should pass a string array through', () => {
      const options = new Options({ eyesVariant: ['open', 'closed'] });

      assert.deepEqual(options.componentVariant('eyes'), ['open', 'closed']);
    });

    it('should pass a weighted record through', () => {
      const options = new Options({ eyesVariant: { open: 5, closed: 1 } });

      assert.deepEqual(options.componentVariant('eyes'), { open: 5, closed: 1 });
    });
  });

  describe('componentProbability()', () => {
    it('should return undefined when unset', () => {
      assert.equal(new Options({}).componentProbability('eyes'), undefined);
    });

    it('should return the user-set numeric value', () => {
      const options = new Options({ eyesProbability: 80 });

      assert.equal(options.componentProbability('eyes'), 80);
    });
  });

  describe('color()', () => {
    it('should return undefined when unset', () => {
      assert.equal(new Options({}).color('skin'), undefined);
    });

    it('should normalize a single hex color to a one-element array', () => {
      const options = new Options({ skinColor: '#f0c8a0' });

      assert.deepEqual(options.color('skin'), ['#f0c8a0']);
    });

    it('should pass a color array through', () => {
      const options = new Options({ skinColor: ['#f0c8a0', '#d4a574'] });

      assert.deepEqual(options.color('skin'), ['#f0c8a0', '#d4a574']);
    });
  });

  describe('colorFill / colorAngle / colorFillStops', () => {
    it('should normalize all three to arrays', () => {
      const options = new Options({
        skinColorFill: 'linear',
        skinColorAngle: 45,
        skinColorFillStops: [2, 4],
      });

      assert.deepEqual(options.colorFill('skin'), ['linear']);
      assert.deepEqual(options.colorAngle('skin'), [45]);
      assert.deepEqual(options.colorFillStops('skin'), [2, 4]);
    });

    it('should return empty arrays when unset', () => {
      const options = new Options({});

      assert.deepEqual(options.colorFill('skin'), []);
      assert.deepEqual(options.colorAngle('skin'), []);
      assert.deepEqual(options.colorFillStops('skin'), []);
    });
  });
});
