import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Prng } from '../lib/Prng.js';

describe('Prng', () => {
  describe('fnv1a', () => {
    it('should return offset basis for empty string', () => {
      const prng = new Prng('');

      assert.equal(prng.fnv1a(''), 0x811c9dc5);
    });

    it('should hash known values correctly', () => {
      const prng = new Prng('');

      assert.equal(prng.fnv1a('a'), 0xe40c292c);
      assert.equal(prng.fnv1a('b'), 0xe70c2de5);
      assert.equal(prng.fnv1a('c'), 0xe60c2c52);
      assert.equal(prng.fnv1a('hello'), 0x4f9f2cab);
      assert.equal(prng.fnv1a('test'), 0xafd071e5);
      assert.equal(prng.fnv1a('foobar'), 0xbf9cf968);
      assert.equal(prng.fnv1a('123'), 0x7238631b);
      assert.equal(prng.fnv1a('dicebear'), 0x54d2afd4);
    });

    it('should produce different hashes for different inputs', () => {
      const prng = new Prng('');

      assert.notEqual(prng.fnv1a('abc'), prng.fnv1a('abd'));
    });

    it('should always return unsigned 32-bit integers', () => {
      const prng = new Prng('');
      const inputs = ['', 'a', 'hello', 'test:flip', 'some-long-seed:optionName'];

      for (const input of inputs) {
        const hash = prng.fnv1a(input);

        assert.ok(hash >= 0);
        assert.ok(hash <= 0xffffffff);
        assert.equal(hash, hash >>> 0);
      }
    });
  });

  describe('mulberry32', () => {
    it('should return known values for various seeds', () => {
      const prng = new Prng('');

      assert.deepEqual(prng.mulberry32(0), [0.26642920868471265, 1831565813]);
      assert.deepEqual(prng.mulberry32(1), [0.6270739405881613, 1831565814]);
      assert.deepEqual(prng.mulberry32(2), [0.7342509443406016, 1831565815]);
      assert.deepEqual(prng.mulberry32(42), [0.6011037519201636, 1831565855]);
      assert.deepEqual(prng.mulberry32(100), [0.2043598669115454, 1831565913]);
    });

    it('should handle edge case seeds', () => {
      const prng = new Prng('');

      assert.deepEqual(prng.mulberry32(0x811c9dc5), [0.6112444521859288, -297265222]);
      assert.deepEqual(prng.mulberry32(0xffffffff), [0.8964226141106337, 1831565812]);
    });

    it('should return a float in [0, 1)', () => {
      const prng = new Prng('');
      const seeds = [0, 1, 42, 2166136261, 4294967295];

      for (const seed of seeds) {
        const [value] = prng.mulberry32(seed);

        assert.ok(value >= 0);
        assert.ok(value < 1);
      }
    });

    it('should produce known values when chained', () => {
      const prng = new Prng('');
      const [v0, s0] = prng.mulberry32(0);
      const [v1, s1] = prng.mulberry32(s0);
      const [v2, s2] = prng.mulberry32(s1);
      const [v3, s3] = prng.mulberry32(s2);

      assert.deepEqual([v0, s0], [0.26642920868471265, 1831565813]);
      assert.deepEqual([v1, s1], [0.0003297457005828619, -631835670]);
      assert.deepEqual([v2, s2], [0.2232720274478197, 1199730143]);
      assert.deepEqual([v3, s3], [0.1462021479383111, -1263671340]);
    });
  });

  describe('getValue', () => {
    it('should return known values for seed "test"', () => {
      const prng = new Prng('test');

      assert.equal(prng.getValue('flip'), 0.5045499159023166);
      assert.equal(prng.getValue('scale'), 0.7226385520771146);
      assert.equal(prng.getValue('rotate'), 0.22723248694092035);
      assert.equal(prng.getValue('borderRadius'), 0.6822192724794149);
      assert.equal(prng.getValue('fontWeight'), 0.49608885939233005);
    });

    it('should return known values for seed "hello"', () => {
      const prng = new Prng('hello');

      assert.equal(prng.getValue('flip'), 0.7123338067904115);
      assert.equal(prng.getValue('scale'), 0.9537951212842017);
      assert.equal(prng.getValue('rotate'), 0.1540700753685087);
      assert.equal(prng.getValue('borderRadius'), 0.6977770447265357);
      assert.equal(prng.getValue('fontWeight'), 0.9063334248494357);
    });

    it('should be deterministic', () => {
      const a = new Prng('seed');
      const b = new Prng('seed');

      assert.equal(a.getValue('key'), b.getValue('key'));
    });

    it('should differ for different seeds', () => {
      const a = new Prng('seed-a');
      const b = new Prng('seed-b');

      assert.notEqual(a.getValue('key'), b.getValue('key'));
    });

    it('should differ for different keys', () => {
      const prng = new Prng('test');

      assert.notEqual(prng.getValue('flip'), prng.getValue('scale'));
    });

    it('should return a float in [0, 1)', () => {
      const prng = new Prng('test');
      const keys = ['a', 'b', 'flip', 'scale', 'rotate', 'eyesVariant'];

      for (const key of keys) {
        const value = prng.getValue(key);

        assert.ok(value >= 0);
        assert.ok(value < 1);
      }
    });
  });

  describe('pick', () => {
    it('should return undefined for empty array', () => {
      const prng = new Prng('test');

      assert.equal(prng.pick('key', []), undefined);
    });

    it('should return the only item for single-element array', () => {
      const prng = new Prng('test');

      assert.equal(prng.pick('key', ['only']), 'only');
    });

    it('should pick from array deterministically', () => {
      const a = new Prng('test');
      const b = new Prng('test');
      const items = ['a', 'b', 'c', 'd'];

      assert.equal(a.pick('key', items), b.pick('key', items));
    });

    it('should always pick a valid item', () => {
      const items = ['x', 'y', 'z'];

      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.ok(items.includes(prng.pick('key', items)));
      }
    });
  });

  describe('float', () => {
    it('should return undefined for empty array', () => {
      const prng = new Prng('test');

      assert.equal(prng.float('key', []), undefined);
    });

    it('should return the value for single-element array', () => {
      const prng = new Prng('test');

      assert.equal(prng.float('key', [42]), 42);
    });

    it('should interpolate within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.float('key', [10, 20]);

        assert.ok(value >= 10);
        assert.ok(value <= 20);
      }
    });

    it('should handle reversed order', () => {
      const prng = new Prng('test');
      const value = prng.float('key', [20, 10]);

      assert.ok(value >= 10);
      assert.ok(value <= 20);
    });

    it('should use min/max across all values', () => {
      const prng = new Prng('test');
      const value = prng.float('key', [5, 20, 10]);

      assert.ok(value >= 5);
      assert.ok(value <= 20);
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(a.float('key', [0, 100]), b.float('key', [0, 100]));
    });
  });

  describe('bool', () => {
    it('should return boolean', () => {
      const prng = new Prng('test');

      assert.equal(typeof prng.bool('key'), 'boolean');
    });

    it('should always return true for likelihood 100', () => {
      for (let i = 0; i < 20; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(prng.bool('key', 100), true);
      }
    });

    it('should always return false for likelihood 0', () => {
      for (let i = 0; i < 20; i++) {
        const prng = new Prng(`seed-${i}`);

        assert.equal(prng.bool('key', 0), false);
      }
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(a.bool('key', 50), b.bool('key', 50));
    });
  });

  describe('integer', () => {
    it('should return undefined for empty array', () => {
      const prng = new Prng('test');

      assert.equal(prng.integer('key', []), undefined);
    });

    it('should return the value for single-element array', () => {
      const prng = new Prng('test');

      assert.equal(prng.integer('key', [5]), 5);
    });

    it('should return an integer within bounds', () => {
      for (let i = 0; i < 50; i++) {
        const prng = new Prng(`seed-${i}`);
        const value = prng.integer('key', [1, 10]);

        assert.ok(value >= 1);
        assert.ok(value <= 10);
        assert.equal(value, Math.floor(value));
      }
    });

    it('should handle reversed order', () => {
      const prng = new Prng('test');
      const value = prng.integer('key', [10, 1]);

      assert.ok(value >= 1);
      assert.ok(value <= 10);
    });

    it('should use min/max across all values', () => {
      const prng = new Prng('test');
      const value = prng.integer('key', [3, 10, 7]);

      assert.ok(value >= 3);
      assert.ok(value <= 10);
      assert.equal(value, Math.floor(value));
    });

    it('should return the value when min equals max', () => {
      const prng = new Prng('test');

      assert.equal(prng.integer('key', [5, 5]), 5);
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');

      assert.equal(a.integer('key', [1, 100]), b.integer('key', [1, 100]));
    });
  });

  describe('shuffle', () => {
    it('should return a new array', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const result = prng.shuffle('key', items);

      assert.notEqual(result, items);
    });

    it('should contain the same elements', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const result = prng.shuffle('key', items);

      assert.deepEqual(result.sort(), [...items].sort());
    });

    it('should not modify the original array', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5];
      const copy = [...items];

      prng.shuffle('key', items);

      assert.deepEqual(items, copy);
    });

    it('should be deterministic', () => {
      const a = new Prng('test');
      const b = new Prng('test');
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      assert.deepEqual(a.shuffle('key', items), b.shuffle('key', items));
    });

    it('should produce different orderings for different keys', () => {
      const prng = new Prng('test');
      const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      assert.notDeepEqual(prng.shuffle('key-a', items), prng.shuffle('key-b', items));
    });

    it('should handle empty array', () => {
      const prng = new Prng('test');

      assert.deepEqual(prng.shuffle('key', []), []);
    });

    it('should handle single-element array', () => {
      const prng = new Prng('test');

      assert.deepEqual(prng.shuffle('key', [42]), [42]);
    });
  });
});
