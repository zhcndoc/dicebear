import { getInitials } from '../../lib/utils/initials.js';
import { test } from 'node:test';
import { deepStrictEqual as equal } from 'node:assert/strict';

const data = [
  ['John Doe', 'JD'],
  ['Florian', 'FL'],
  ['Störfried Würgekloß', 'SW'],
  ['Frank Walter Östernbach', 'FÖ'],
  ['陳方 陈方', '陳陈'],
  ['contact@dicebear.com', 'CO'],
  ['<"', ''],
  ['florian.koerner', 'FK'],
  ['Київ', 'КИ'],
  ['@florian.koerner', 'FK'],
  ['🥳', ''],
  // U+00E0
  ['àaa', 'ÀA'],
  ['àaa àaa', 'ÀÀ'],
  // U+0061 U+0300
  ['àaa', 'ÀA'],
  ['àaa àaa', 'ÀÀ'],
  // Apostrophes
  ["O'Connor", 'OC'],
  ["OʼConnor", 'OC'],
  ["John O'Connor", 'JO'],
  ["John OʼConnor", 'JO'],
  ["John O`Connor", 'JO'],
  ["John O´Connor", 'JO'],
];

for (const [input, expected] of data) {
  test(`Get initials for ${input}`, () => {
    equal(getInitials(input), expected);
  });
}
