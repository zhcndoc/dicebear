// Generates the cross-language parity fixtures consumed by both the JS and
// PHP test suites. Re-run via `npm run fixtures:parity` whenever the JS
// implementation legitimately changes; commit the diff and bring the PHP
// side back in sync.
//
// The generator deliberately uses the JS implementation as the reference.
// PHP is then expected to match these byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { Avatar } from '../../../src/js/core/lib/index.js';
import { Prng } from '../../../src/js/core/lib/Prng.js';
import { Fnv1a } from '../../../src/js/core/lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../../../src/js/core/lib/Prng/Mulberry32.js';

const definitionsDir = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'definitions',
  'dist',
);

const STYLE_NAMES = ['initials', 'thumbs', 'glass', 'notionists'];

function writeJson(relPath, data) {
  const filePath = join(import.meta.dirname, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log('  wrote', relPath);
}

// ---------------------------------------------------------------------------
// Vendor style definitions
// ---------------------------------------------------------------------------

console.log('Copying style definitions…');
const styles = {};
for (const name of STYLE_NAMES) {
  const raw = JSON.parse(
    readFileSync(join(definitionsDir, `${name}.min.json`), 'utf8'),
  );
  styles[name] = raw;
  writeJson(join('styles', `${name}.json`), raw);
}

// Synthetic alias style: locks down the `extends` plumbing across both
// runtimes. Two component slots in the canvas both reference the same alias
// pair so that source vs. alias variant rolling is observable in the SVG.
const aliasTest = {
  canvas: {
    width: 100,
    height: 100,
    elements: [
      { type: 'component', name: 'eyes' },
      { type: 'component', name: 'eyesRight' },
    ],
  },
  components: {
    eyes: {
      width: 20,
      height: 20,
      variants: {
        a: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'a' } }] },
        b: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'b' } }] },
        c: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'c' } }] },
        d: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'd' } }] },
        e: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'e' } }] },
      },
    },
    eyesRight: { extends: 'eyes' },
  },
};
styles.aliasTest = aliasTest;
writeJson(join('styles', 'aliasTest.json'), aliasTest);

// ---------------------------------------------------------------------------
// Fnv1a fixtures
// ---------------------------------------------------------------------------

console.log('Generating fnv1a.json…');
const fnv1aInputs = [
  '',
  'a',
  'b',
  'c',
  'hello',
  'test',
  'foobar',
  '123',
  'dicebear',
  'test:flip',
  'test:scale',
  'some-long-seed:optionName',
  'é',
  '日本語',
  '🎲',
  'a'.repeat(256),
];

writeJson(
  'fnv1a.json',
  fnv1aInputs.map((input) => ({
    input,
    hash: Fnv1a.hash(input),
    hex: Fnv1a.hex(input),
  })),
);

// ---------------------------------------------------------------------------
// Mulberry32 fixtures
// ---------------------------------------------------------------------------

console.log('Generating mulberry32.json…');
const mulberrySeeds = [0, 1, 2, 42, 100, 0x811c9dc5, 0xffffffff];

writeJson(
  'mulberry32.json',
  mulberrySeeds.map((seed) => {
    const m = new Mulberry32(seed);
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      const float = m.nextFloat();
      sequence.push({ float, state: m.state() });
    }

    return { seed, sequence };
  }),
);

// ---------------------------------------------------------------------------
// Prng fixtures (key-based methods)
// ---------------------------------------------------------------------------

console.log('Generating prng.json…');

const prngFixtures = {
  getValue: [],
  pick: [],
  weightedPick: [],
  bool: [],
  float: [],
  integer: [],
  shuffle: [],
};

const getValueCases = [
  { seed: 'test', key: 'flip' },
  { seed: 'test', key: 'scale' },
  { seed: 'test', key: 'rotate' },
  { seed: 'test', key: 'borderRadius' },
  { seed: 'test', key: 'fontWeight' },
  { seed: 'hello', key: 'flip' },
  { seed: 'hello', key: 'eyesVariant' },
  { seed: 'dicebear', key: 'colorFill' },
  { seed: '日本語', key: 'unicode-key' },
  { seed: '', key: 'empty-seed' },
];
for (const c of getValueCases) {
  prngFixtures.getValue.push({
    ...c,
    result: new Prng(c.seed).getValue(c.key),
  });
}

const pickCases = [
  { seed: 'test', key: 'a', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'test', key: 'b', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'test', key: 'c', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'hello', key: 'eyes', items: ['blue', 'green', 'brown', 'hazel'] },
  { seed: 'dicebear', key: 'variant', items: ['variant1', 'variant2', 'variant3'] },
  { seed: 'test', key: 'single', items: ['only'] },
  // pre-shuffled order to verify that sorting normalizes input
  { seed: 'test', key: 'a', items: ['e', 'd', 'c', 'b', 'a'] },
];
for (const c of pickCases) {
  prngFixtures.pick.push({
    ...c,
    result: new Prng(c.seed).pick(c.key, c.items),
  });
}

const weightedPickCases = [
  { seed: 'test', key: 'k', entries: [['a', 1], ['b', 4], ['c', 2]] },
  { seed: 'test', key: 'l', entries: [['a', 1], ['b', 4], ['c', 2]] },
  { seed: 'hello', key: 'k', entries: [['a', 1], ['b', 4], ['c', 2]] },
  { seed: 'test', key: 'k', entries: [['heavy', 100], ['light', 1]] },
  { seed: 'test', key: 'k', entries: [['rare', 0], ['common', 1]] },
  // order-independence: same expected result as the first entry above
  { seed: 'test', key: 'k', entries: [['c', 2], ['a', 1], ['b', 4]] },
  { seed: 'test', key: 'k', entries: [['only', 1]] },
];
for (const c of weightedPickCases) {
  prngFixtures.weightedPick.push({
    ...c,
    result: new Prng(c.seed).weightedPick(c.key, c.entries),
  });
}

const boolCases = [
  { seed: 'test', key: 'k', likelihood: 0 },
  { seed: 'test', key: 'k', likelihood: 25 },
  { seed: 'test', key: 'k', likelihood: 50 },
  { seed: 'test', key: 'k', likelihood: 75 },
  { seed: 'test', key: 'k', likelihood: 100 },
  { seed: 'hello', key: 'flip', likelihood: 50 },
  { seed: 'dicebear', key: 'flip', likelihood: 50 },
];
for (const c of boolCases) {
  prngFixtures.bool.push({
    ...c,
    result: new Prng(c.seed).bool(c.key, c.likelihood),
  });
}

const floatCases = [
  { seed: 'test', key: 'k', values: [0, 1] },
  { seed: 'test', key: 'k', values: [-10, 10] },
  { seed: 'test', key: 'k', values: [10, 20] },
  { seed: 'test', key: 'k', values: [20, 10] }, // reversed
  { seed: 'test', key: 'k', values: [5, 20, 10] }, // multi-value
  { seed: 'hello', key: 'scale', values: [0.5, 1.5] },
  { seed: 'test', key: 'k', values: [42] }, // single
];
for (const c of floatCases) {
  prngFixtures.float.push({
    ...c,
    result: new Prng(c.seed).float(c.key, c.values),
  });
}

const integerCases = [
  { seed: 'test', key: 'k', values: [1, 6] },
  { seed: 'test', key: 'k', values: [0, 100] },
  { seed: 'test', key: 'k', values: [-50, 50] },
  { seed: 'test', key: 'k', values: [10, 1] }, // reversed
  { seed: 'test', key: 'k', values: [3, 10, 7] }, // multi-value
  { seed: 'test', key: 'k', values: [5, 5] }, // min == max
  { seed: 'hello', key: 'fontWeight', values: [100, 900] },
];
for (const c of integerCases) {
  prngFixtures.integer.push({
    ...c,
    result: new Prng(c.seed).integer(c.key, c.values),
  });
}

const shuffleCases = [
  { seed: 'test', key: 'k', items: [] },
  { seed: 'test', key: 'k', items: ['only'] },
  { seed: 'test', key: 'k', items: ['a', 'b', 'c'] },
  { seed: 'test', key: 'k', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
  { seed: 'hello', key: 'k', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
  // pre-shuffled order to verify that sorting normalizes input
  { seed: 'test', key: 'k', items: ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] },
];
for (const c of shuffleCases) {
  prngFixtures.shuffle.push({
    ...c,
    result: new Prng(c.seed).shuffle(c.key, c.items),
  });
}

writeJson('prng.json', prngFixtures);

// ---------------------------------------------------------------------------
// Avatar fixtures
// ---------------------------------------------------------------------------

console.log('Generating avatar fixtures…');

function avatarCases(extra) {
  return [
    {
      id: 'plain-seed',
      options: { seed: 'parity-1' },
    },
    {
      id: 'different-seed',
      options: { seed: 'parity-2' },
    },
    {
      id: 'size-scale-rotate',
      options: { seed: 'parity-1', size: 256, scale: 2, rotate: 45 },
    },
    {
      id: 'translate-border-flip',
      options: {
        seed: 'parity-1',
        translateX: 10,
        translateY: -5,
        borderRadius: 50,
        flip: 'horizontal',
      },
    },
    {
      id: 'background-solid',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000'],
        backgroundColorFill: ['solid'],
      },
    },
    {
      id: 'background-linear',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000', '00ff00'],
        backgroundColorFill: ['linear'],
        backgroundColorAngle: [45, 45],
      },
    },
    {
      id: 'background-radial',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000', '00ff00'],
        backgroundColorFill: ['radial'],
      },
    },
    ...extra,
  ];
}

const avatarFixtures = {
  initials: avatarCases([
    {
      id: 'font-family-weight',
      options: {
        seed: 'Florian Körner',
        fontFamily: ['Helvetica', 'Arial'],
        fontWeight: 700,
      },
    },
    {
      id: 'variant-double',
      options: { seed: 'AB CD', initialsVariant: ['double'] },
    },
    {
      id: 'variant-single',
      options: { seed: 'AB CD', initialsVariant: ['single'] },
    },
  ]),
  thumbs: avatarCases([
    {
      id: 'eyes-mouth-variant',
      options: {
        seed: 'parity-1',
        eyesVariant: ['variant1W10'],
        mouthVariant: ['variant1'],
      },
    },
    {
      id: 'shape-color-override',
      options: {
        seed: 'parity-1',
        shapeColor: ['ffaa00'],
        eyesColor: ['000000'],
        mouthColor: ['ff0000'],
      },
    },
  ]),
  glass: avatarCases([
    {
      id: 'shape-variants',
      options: {
        seed: 'parity-1',
        shape1Variant: ['a'],
        shape2Variant: ['g'],
      },
    },
    {
      id: 'shape1-probability-zero',
      options: { seed: 'parity-1', shape1Probability: 0 },
    },
  ]),
  notionists: avatarCases([
    {
      id: 'hair-eyes-variant',
      options: {
        seed: 'parity-1',
        hairVariant: ['variant01'],
        eyesVariant: ['variant01'],
      },
    },
    {
      id: 'gesture-variant',
      options: {
        seed: 'parity-1',
        gestureVariant: ['waveLongArms'],
      },
    },
  ]),
  aliasTest: [
    { id: 'plain-seed', options: { seed: 'parity-1' } },
    { id: 'different-seed', options: { seed: 'parity-2' } },
    {
      id: 'source-variant',
      options: { seed: 'parity-1', eyesVariant: 'b' },
    },
    {
      id: 'source-probability-zero',
      options: { seed: 'parity-1', eyesProbability: 0 },
    },
  ],
};

for (const [styleName, cases] of Object.entries(avatarFixtures)) {
  const styleData = styles[styleName];
  const out = cases.map((c) => {
    const json = new Avatar(styleData, c.options).toJSON();
    // JSON-round-trip the resolved options so the fixture matches what
    // any consumer would see after JSON.stringify — this drops undefined
    // values like `size` and `title` when they were not provided.
    const resolvedOptions = JSON.parse(JSON.stringify(json.options));

    return { id: c.id, options: c.options, svg: json.svg, resolvedOptions };
  });
  writeJson(join('avatars', `${styleName}.json`), out);
}

console.log('Done.');
