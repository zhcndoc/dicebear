import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Options, DiceBear, Avatar } from '../lib/index.js';

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

describe('DiceBear', () => {
  describe('createAvatar', () => {
    it('should return an Avatar instance', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should work without options', () => {
      const avatar = DiceBear.createAvatar(minimalStyle);

      assert.ok(avatar instanceof Avatar);
    });

    it('should accept an Options instance', () => {
      const options = new Options(minimalStyle, { seed: 'test' });
      const avatar = DiceBear.createAvatar(minimalStyle, options);

      assert.ok(avatar instanceof Avatar);
    });

    it('should accept an Options instance with validation disabled', () => {
      assert.doesNotThrow(() => {
        DiceBear.createAvatar(minimalStyle, new Options(minimalStyle, { size: -1 }, false));
      });
    });
  });
});

describe('Avatar', () => {
  describe('toString()', () => {
    it('should return a string', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });

      assert.equal(typeof avatar.toString(), 'string');
    });
  });

  describe('toJson()', () => {
    it('should return an object with svg and options', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });
      const json = avatar.toJson();

      assert.equal(typeof json.svg, 'string');
      assert.ok(json.options !== null && typeof json.options === 'object');
    });

    it('should have consistent svg with toString()', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });

      assert.equal(avatar.toJson().svg, avatar.toString());
    });
  });

  describe('toDataUri()', () => {
    it('should return a data URI string', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().startsWith('data:image/svg+xml;utf8,'));
    });

    it('should contain the encoded SVG', () => {
      const avatar = DiceBear.createAvatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().includes(encodeURIComponent(avatar.toString())));
    });
  });
});
