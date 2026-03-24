import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style } from '../lib/index.js';
import { StyleValidationError } from '../lib/Error/StyleValidationError.js';
import { ValidationError } from '../lib/Error/ValidationError.js';

const minimal = {
  canvas: { width: 100, height: 100, elements: [] },
};

const full = {
  $schema: 'https://example.com/schema.json',
  $comment: 'Test style',
  meta: {
    license: { name: 'MIT', url: 'https://example.com/license', text: 'MIT License' },
    creator: { name: 'Test', url: 'https://example.com' },
    source: { name: 'Source', url: 'https://example.com/source' },
  },
  canvas: {
    width: 200,
    height: 200,
    elements: [
      {
        type: 'element',
        name: 'rect',
        attributes: { width: '100', height: '100', fill: '#ff0000' },
        children: [
          { type: 'text', value: 'hello' },
        ],
      },
      {
        type: 'component',
        value: 'eyes',
      },
    ],
  },
  components: {
    eyes: {
      width: 50,
      height: 50,
      probability: 100,
      rotate: [-10, 10],
      translate: { x: [0, 5], y: [-2, 2] },
      variants: {
        open: {
          elements: [
            { type: 'element', name: 'circle', attributes: { r: '10', cx: '25', cy: '25' } },
          ],
        },
        closed: {
          elements: [
            { type: 'element', name: 'line', attributes: { x1: '10', y1: '25', x2: '40', y2: '25' } },
          ],
        },
      },
    },
  },
  colors: {
    skin: {
      values: ['#f0c8a0', '#d4a574', '#8d5524'],
    },
    hair: {
      values: ['#2c1b18', '#b55239'],
      notEqualTo: ['skin'],
    },
    background: {
      values: ['#ffffff', '#000000'],
      contrastTo: 'skin',
    },
  },
};

describe('Style', () => {
  describe('constructor', () => {
    it('should accept a minimal definition', () => {
      const style = new Style(minimal);

      assert.ok(style);
    });

    it('should accept a full definition', () => {
      const style = new Style(full);

      assert.ok(style);
    });

    it('should skip validation when validate is false', () => {
      assert.doesNotThrow(() => new Style(minimal, false));
    });

    it('should throw StyleValidationError for invalid data', () => {
      assert.throws(() => new Style({}), StyleValidationError);
    });

    it('should throw an instance of ValidationError', () => {
      assert.throws(() => new Style({}), ValidationError);
    });

    it('should throw an instance of Error', () => {
      assert.throws(() => new Style({}), Error);
    });

    it('should include details on the error', () => {
      try {
        new Style({});
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof StyleValidationError);
        assert.ok(Array.isArray(e.details));
        assert.ok(e.details.length > 0);
      }
    });
  });

  describe('primitive getters', () => {
    it('should return schema', () => {
      assert.equal(new Style(full).schema, full.$schema);
    });

    it('should return comment', () => {
      assert.equal(new Style(full).comment, full.$comment);
    });

    it('should return undefined for missing optional primitives', () => {
      const style = new Style(minimal);

      assert.equal(style.schema, undefined);
      assert.equal(style.comment, undefined);
    });

    it('should return defaults for missing optional objects', () => {
      const style = new Style(minimal);

      assert.ok(style.meta);
      assert.equal(style.meta.license.name, undefined);
      assert.equal(style.meta.creator.name, undefined);
      assert.equal(style.meta.source.name, undefined);
      assert.deepEqual(style.attributes, {});
    });
  });

  describe('canvas', () => {
    it('should return width and height', () => {
      const style = new Style(full);

      assert.equal(style.canvas.width, 200);
      assert.equal(style.canvas.height, 200);
    });

    it('should return elements', () => {
      const style = new Style(full);

      assert.equal(style.canvas.elements.length, 2);
      assert.equal(style.canvas.elements[0].type, 'element');
      assert.equal(style.canvas.elements[0].name, 'rect');
      assert.equal(style.canvas.elements[1].type, 'component');
      assert.equal(style.canvas.elements[1].value, 'eyes');
    });

    it('should return element children', () => {
      const style = new Style(full);
      const children = style.canvas.elements[0].children;

      assert.ok(children);
      assert.equal(children.length, 1);
      assert.equal(children[0].type, 'text');
      assert.equal(children[0].value, 'hello');
    });

    it('should return element attributes', () => {
      const style = new Style(full);
      const attrs = style.canvas.elements[0].attributes;

      assert.ok(attrs);
      assert.equal(attrs['width'], '100');
      assert.equal(attrs['fill'], '#ff0000');
    });

    it('should cache elements', () => {
      const style = new Style(full);

      assert.equal(style.canvas.elements, style.canvas.elements);
    });
  });

  describe('meta', () => {
    it('should return license', () => {
      const style = new Style(full);

      assert.ok(style.meta);
      assert.ok(style.meta.license);
      assert.equal(style.meta.license.name, 'MIT');
      assert.equal(style.meta.license.url, 'https://example.com/license');
      assert.equal(style.meta.license.text, 'MIT License');
    });

    it('should return creator', () => {
      const style = new Style(full);

      assert.ok(style.meta);
      assert.ok(style.meta.creator);
      assert.equal(style.meta.creator.name, 'Test');
      assert.equal(style.meta.creator.url, 'https://example.com');
    });

    it('should return source', () => {
      const style = new Style(full);

      assert.ok(style.meta);
      assert.ok(style.meta.source);
      assert.equal(style.meta.source.name, 'Source');
    });

    it('should cache meta', () => {
      const style = new Style(full);

      assert.equal(style.meta, style.meta);
    });
  });

  describe('components', () => {
    it('should return components as a Map', () => {
      const style = new Style(full);

      assert.ok(style.components instanceof Map);
      assert.equal(style.components.size, 1);
      assert.ok(style.components.has('eyes'));
    });

    it('should return component properties', () => {
      const style = new Style(full);
      const eyes = style.components.get('eyes');

      assert.ok(eyes);
      assert.equal(eyes.width, 50);
      assert.equal(eyes.height, 50);
      assert.equal(eyes.probability, 100);
      assert.deepEqual(eyes.rotate, [-10, 10]);
    });

    it('should return component translate', () => {
      const style = new Style(full);
      const translate = style.components.get('eyes')?.translate;

      assert.ok(translate);
      assert.deepEqual(translate.x, [0, 5]);
      assert.deepEqual(translate.y, [-2, 2]);
    });

    it('should return component variants as a Map', () => {
      const style = new Style(full);
      const eyes = style.components.get('eyes');

      assert.ok(eyes);
      assert.ok(eyes.variants instanceof Map);
      assert.equal(eyes.variants.size, 2);
      assert.ok(eyes.variants.has('open'));
      assert.ok(eyes.variants.has('closed'));
    });

    it('should return variant elements', () => {
      const style = new Style(full);
      const open = style.components.get('eyes')?.variants.get('open');

      assert.ok(open);
      assert.equal(open.elements.length, 1);
      assert.equal(open.elements[0].name, 'circle');
    });

    it('should return empty Map when no components', () => {
      const style = new Style(minimal);

      assert.equal(style.components.size, 0);
    });

    it('should cache components', () => {
      const style = new Style(full);

      assert.equal(style.components, style.components);
    });
  });

  describe('colors', () => {
    it('should return colors as a Map', () => {
      const style = new Style(full);

      assert.ok(style.colors instanceof Map);
      assert.equal(style.colors.size, 3);
    });

    it('should return color values', () => {
      const style = new Style(full);
      const skin = style.colors.get('skin');

      assert.ok(skin);
      assert.deepEqual(skin.values, ['#f0c8a0', '#d4a574', '#8d5524']);
    });

    it('should return notEqualTo', () => {
      const style = new Style(full);
      const hair = style.colors.get('hair');

      assert.ok(hair);
      assert.deepEqual(hair.notEqualTo, ['skin']);
    });

    it('should return contrastTo', () => {
      const style = new Style(full);
      const bg = style.colors.get('background');

      assert.ok(bg);
      assert.equal(bg.contrastTo, 'skin');
    });

    it('should return empty Map when no colors', () => {
      const style = new Style(minimal);

      assert.equal(style.colors.size, 0);
    });

    it('should cache colors', () => {
      const style = new Style(full);

      assert.equal(style.colors, style.colors);
    });
  });
});
