import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Color } from '../../lib/Utils/Color.js';

describe('Color', () => {
  describe('toRgbHex', () => {
    it('should normalize 6-digit hex', () => {
      assert.equal(Color.toRgbHex('#ff0000'), '#ff0000');
    });

    it('should normalize 3-digit hex', () => {
      assert.equal(Color.toRgbHex('#f00'), '#ff0000');
    });

    it('should normalize 4-digit hex (strip alpha)', () => {
      assert.equal(Color.toRgbHex('#f008'), '#ff0000');
    });

    it('should normalize 8-digit hex (strip alpha)', () => {
      assert.equal(Color.toRgbHex('#ff000080'), '#ff0000');
    });

    it('should lowercase', () => {
      assert.equal(Color.toRgbHex('#FF0000'), '#ff0000');
      assert.equal(Color.toRgbHex('#F00'), '#ff0000');
    });

    it('should handle missing # prefix', () => {
      assert.equal(Color.toRgbHex('ff0000'), '#ff0000');
      assert.equal(Color.toRgbHex('f00'), '#ff0000');
    });
  });

  describe('parseHex', () => {
    it('should parse 6-digit hex', () => {
      assert.deepEqual(Color.parseHex('#ff0000'), [255, 0, 0]);
      assert.deepEqual(Color.parseHex('#00ff00'), [0, 255, 0]);
      assert.deepEqual(Color.parseHex('#0000ff'), [0, 0, 255]);
    });

    it('should parse 3-digit hex', () => {
      assert.deepEqual(Color.parseHex('#f00'), [255, 0, 0]);
      assert.deepEqual(Color.parseHex('#fff'), [255, 255, 255]);
    });

    it('should parse 4-digit hex', () => {
      assert.deepEqual(Color.parseHex('#f008'), [255, 0, 0]);
    });

    it('should parse 8-digit hex', () => {
      assert.deepEqual(Color.parseHex('#ff000080'), [255, 0, 0]);
    });

    it('should be case-insensitive', () => {
      assert.deepEqual(Color.parseHex('#FF0000'), [255, 0, 0]);
    });
  });

  describe('luminance', () => {
    it('should return 0 for black', () => {
      assert.equal(Color.luminance('#000000'), 0);
    });

    it('should return 1 for white', () => {
      assert.equal(Color.luminance('#ffffff'), 1);
    });

    it('should return correct value for mid-gray', () => {
      const lum = Color.luminance('#808080');

      assert.ok(lum > 0.2 && lum < 0.25);
    });

    it('should handle 3-digit hex', () => {
      assert.equal(Color.luminance('#000'), 0);
      assert.equal(Color.luminance('#fff'), 1);
    });
  });

  describe('contrastRatio', () => {
    it('should return 21 for black vs white', () => {
      assert.ok(Math.abs(Color.contrastRatio('#000000', '#ffffff') - 21) < 0.01);
    });

    it('should return 1 for identical colors', () => {
      assert.equal(Color.contrastRatio('#ff0000', '#ff0000'), 1);
    });

    it('should be symmetric', () => {
      assert.equal(
        Color.contrastRatio('#ff0000', '#0000ff'),
        Color.contrastRatio('#0000ff', '#ff0000'),
      );
    });

    it('should be case-insensitive', () => {
      assert.equal(
        Color.contrastRatio('#FF0000', '#000000'),
        Color.contrastRatio('#ff0000', '#000000'),
      );
    });
  });

  describe('sortByContrast', () => {
    it('should sort by descending contrast to reference', () => {
      const candidates = ['#ffffff', '#808080', '#000000'];

      Color.sortByContrast(candidates, '#ffffff');

      assert.equal(candidates[0], '#000000');
      assert.equal(candidates[2], '#ffffff');
    });

    it('should sort relative to a colored reference', () => {
      const candidates = ['#000000', '#ffffff'];

      Color.sortByContrast(candidates, '#f0c8a0');

      assert.equal(candidates[0], '#000000');
    });

    it('should not change array length', () => {
      const candidates = ['#ff0000', '#00ff00', '#0000ff'];

      Color.sortByContrast(candidates, '#ffffff');

      assert.equal(candidates.length, 3);
    });
  });

  describe('filterNotEqualTo', () => {
    it('should filter exact matches', () => {
      const candidates = ['#ff0000', '#00ff00', '#0000ff'];

      Color.filterNotEqualTo(candidates, ['#ff0000']);

      assert.deepEqual(candidates, ['#00ff00', '#0000ff']);
    });

    it('should filter case-insensitively', () => {
      const candidates = ['#ff0000', '#00ff00'];

      Color.filterNotEqualTo(candidates, ['#FF0000']);

      assert.deepEqual(candidates, ['#00ff00']);
    });

    it('should match short and long hex forms', () => {
      const candidates = ['#ff0000', '#00ff00'];

      Color.filterNotEqualTo(candidates, ['#f00']);

      assert.deepEqual(candidates, ['#00ff00']);
    });

    it('should keep all when filtering would empty the list', () => {
      const candidates = ['#ff0000'];

      Color.filterNotEqualTo(candidates, ['#ff0000']);

      assert.deepEqual(candidates, ['#ff0000']);
    });

    it('should handle multiple exclusions', () => {
      const candidates = ['#ff0000', '#00ff00', '#0000ff'];

      Color.filterNotEqualTo(candidates, ['#ff0000', '#0000ff']);

      assert.deepEqual(candidates, ['#00ff00']);
    });
  });
});
