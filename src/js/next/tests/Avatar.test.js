import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Avatar } from '../lib/index.js';

const minimalStyleData = {
  canvas: { width: 100, height: 100, elements: [] },
};

const minimalStyle = new Style(minimalStyleData);

describe('Avatar', () => {
  describe('constructor', () => {
    it('should accept Style instance and raw options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should accept raw style data', () => {
      const avatar = new Avatar(minimalStyleData);

      assert.ok(avatar instanceof Avatar);
    });

    it('should accept raw style data and raw options', () => {
      const avatar = new Avatar(minimalStyleData, { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should work without options', () => {
      const avatar = new Avatar(minimalStyle);

      assert.ok(avatar instanceof Avatar);
    });
  });

  describe('toString()', () => {
    it('should return a string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(typeof avatar.toString(), 'string');
    });
  });

  describe('toJson()', () => {
    it('should return an object with svg and options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });
      const json = avatar.toJson();

      assert.equal(typeof json.svg, 'string');
      assert.ok(json.options !== null && typeof json.options === 'object');
    });

    it('should have consistent svg with toString()', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(avatar.toJson().svg, avatar.toString());
    });
  });

  describe('toDataUri()', () => {
    it('should return a data URI string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().startsWith('data:image/svg+xml;utf8,'));
    });

    it('should contain the encoded SVG', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar.toDataUri().includes(encodeURIComponent(avatar.toString())));
    });
  });
});
