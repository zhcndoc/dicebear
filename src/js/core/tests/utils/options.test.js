import { merge, defaults } from '../../lib/utils/options.js';
import { test } from 'node:test';
import { deepStrictEqual as equal } from 'node:assert/strict';

test('Defaults should be returned in options.', () => {
  const options = merge(
    {
      create: () => ({ attributes: { viewBox: '' }, body: '' }),
      meta: {},
      schema: {},
    },
    {}
  );

  equal(options.radius, 0);
});

test('All standards must be returned unless undefined.', () => {
  equal(
    defaults({
      properties: {
        foo: {
          default: 'FOO',
        },
        bar: {
          default: 123,
        },
        baz: {},
      },
    }),
    {
      foo: 'FOO',
      bar: 123,
    }
  );
});
