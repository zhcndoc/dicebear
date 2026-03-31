import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, OptionsSchema } from '../lib/index.js';

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

const fullStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 100,
      height: 100,
      variants: {
        open: { elements: [] },
        closed: { elements: [] },
        wink: { elements: [] },
      },
    },
    mouth: {
      width: 100,
      height: 100,
      variants: {
        happy: { elements: [] },
        sad: { elements: [] },
      },
    },
  },
  colors: {
    skin: { values: ['#ff0000', '#00ff00'] },
    hair: { values: ['#000000'] },
  },
});

describe('OptionsSchema', () => {
  describe('base properties', () => {
    it('should include all base options', () => {
      const schema = new OptionsSchema(minimalStyle).toJSON();
      const keys = Object.keys(schema.properties);

      for (const key of ['seed', 'size', 'idRandomization', 'flip', 'fontFamily',
        'fontWeight', 'scale', 'borderRadius', 'rotate', 'translateX', 'translateY']) {
        assert.ok(keys.includes(key), `missing base property: ${key}`);
      }
    });

    it('should always include background color options', () => {
      const schema = new OptionsSchema(minimalStyle).toJSON();
      const keys = Object.keys(schema.properties);

      for (const key of ['backgroundColor', 'backgroundColorFill',
        'backgroundColorFillStops', 'backgroundColorAngle']) {
        assert.ok(keys.includes(key), `missing background property: ${key}`);
      }
    });

    it('should set additionalProperties to false', () => {
      const schema = new OptionsSchema(minimalStyle).toJSON();

      assert.equal(schema.additionalProperties, false);
    });

    it('should set type to object', () => {
      const schema = new OptionsSchema(minimalStyle).toJSON();

      assert.equal(schema.type, 'object');
    });
  });

  describe('component properties', () => {
    it('should generate properties for each component', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const keys = Object.keys(schema.properties);

      for (const prefix of ['eyes', 'mouth']) {
        for (const suffix of ['Variant', 'Probability', 'Rotate', 'TranslateX', 'TranslateY']) {
          assert.ok(keys.includes(`${prefix}${suffix}`), `missing: ${prefix}${suffix}`);
        }
      }
    });

    it('should include sorted variant names as enum', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const eyesVariant = schema.properties.eyesVariant;

      assert.deepEqual(eyesVariant.oneOf[0].enum, ['closed', 'open', 'wink']);
    });

    it('should support variant as string, array, or weighted object', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const oneOf = schema.properties.eyesVariant.oneOf;

      assert.equal(oneOf.length, 3);
      assert.equal(oneOf[0].type, 'string');
      assert.equal(oneOf[1].type, 'array');
      assert.equal(oneOf[2].type, 'object');
    });

    it('should constrain probability to 0-100', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const prob = schema.properties.eyesProbability;

      assert.equal(prob.type, 'number');
      assert.equal(prob.minimum, 0);
      assert.equal(prob.maximum, 100);
    });
  });

  describe('color properties', () => {
    it('should generate properties for each color', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const keys = Object.keys(schema.properties);

      for (const prefix of ['skin', 'hair', 'background']) {
        for (const suffix of ['Color', 'ColorFill', 'ColorFillStops', 'ColorAngle']) {
          assert.ok(keys.includes(`${prefix}${suffix}`), `missing: ${prefix}${suffix}`);
        }
      }
    });

    it('should use hex pattern for color values', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const skinColor = schema.properties.skinColor;

      assert.ok(skinColor.oneOf[0].pattern);
    });

    it('should constrain colorFill to solid, linear, radial', () => {
      const schema = new OptionsSchema(fullStyle).toJSON();
      const fill = schema.properties.skinColorFill;

      assert.deepEqual(fill.oneOf[0].enum, ['solid', 'linear', 'radial']);
    });
  });

  describe('caching', () => {
    it('should return structurally equal results on repeated calls', () => {
      const optionsSchema = new OptionsSchema(fullStyle);

      assert.deepEqual(optionsSchema.toJSON(), optionsSchema.toJSON());
    });

    it('should return independent copies', () => {
      const optionsSchema = new OptionsSchema(fullStyle);
      const a = optionsSchema.toJSON();
      const b = optionsSchema.toJSON();

      a.properties.seed = 'mutated';

      assert.notEqual(b.properties.seed, 'mutated');
    });
  });
});
