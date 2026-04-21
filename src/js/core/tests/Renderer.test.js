import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Avatar } from '../lib/index.js';

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

describe('Renderer', () => {
  describe('SVG wrapper', () => {
    it('should render svg with viewBox', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(svg.startsWith('<svg '));
      assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
      assert.ok(svg.includes('viewBox="0 0 100 100"'));
      assert.ok(svg.endsWith('</svg>'));
    });

    it('should include role="img" and aria-label when title is set', () => {
      const svg = new Avatar(minimalStyle, { title: 'Test Avatar' }).toString();

      assert.ok(svg.includes('role="img"'));
      assert.ok(svg.includes('aria-label="Test Avatar"'));
      assert.ok(svg.includes('<title>Test Avatar</title>'));
    });

    it('should escape title in aria-label and title element', () => {
      const svg = new Avatar(minimalStyle, { title: 'A & B <C>' }).toString();

      assert.ok(svg.includes('aria-label="A &amp; B &lt;C&gt;"'));
      assert.ok(svg.includes('<title>A &amp; B &lt;C&gt;</title>'));
    });

    it('should be aria-hidden when title is not set', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(svg.includes('aria-hidden="true"'));
      assert.ok(!svg.includes('role="img"'));
      assert.ok(!svg.includes('<title>'));
      assert.ok(!svg.includes('aria-label'));
    });

    it('should include size when set', () => {
      const svg = new Avatar(minimalStyle, { size: 64 }).toString();

      assert.ok(svg.includes('width="64"'));
      assert.ok(svg.includes('height="64"'));
    });

    it('should not include size when not set', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(!svg.includes('width='));
      assert.ok(!svg.includes('height='));
    });
  });

  describe('element rendering', () => {
    it('should render self-closing elements', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'element', name: 'rect', attributes: { x: '0', y: '0', width: '100', height: '100' } },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<rect x="0" y="0" width="100" height="100"/>'));
    });

    it('should render elements with children', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              children: [
                { type: 'element', name: 'circle', attributes: { cx: '50', cy: '50', r: '10' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<g><circle cx="50" cy="50" r="10"/></g>'));
    });

    it('should render nested elements', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              attributes: { id: 'outer' },
              children: [
                {
                  type: 'element',
                  name: 'g',
                  attributes: { id: 'inner' },
                  children: [
                    { type: 'element', name: 'rect' },
                  ],
                },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<g id="outer"><g id="inner"><rect/></g></g>'));
    });
  });

  describe('text rendering', () => {
    it('should render text content', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<text>Hello</text>'));
    });

    it('should resolve variable reference: initial', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initial' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice' }).toString();

      assert.ok(svg.includes('<text>A</text>'));
    });

    it('should resolve initials from multi-word seed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice Bob' }).toString();

      assert.ok(svg.includes('<text>AB</text>'));
    });

    it('should resolve initials from single-word seed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice' }).toString();

      assert.ok(svg.includes('<text>AL</text>'));
    });

    it('should discard @-symbol in initials', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'alice@example.com' }).toString();

      assert.ok(svg.includes('<text>AL</text>'));
    });
  });

  describe('component rendering', () => {
    const styleWithComponents = new Style({
      canvas: {
        width: 100,
        height: 100,
        elements: [
          { type: 'component', name: 'eyes' },
        ],
      },
      components: {
        eyes: {
          width: 50,
          height: 50,
          variants: {
            open: {
              elements: [
                { type: 'element', name: 'circle', attributes: { r: '5' } },
              ],
            },
            closed: {
              elements: [
                { type: 'element', name: 'line', attributes: { x1: '0', x2: '10' } },
              ],
            },
          },
        },
      },
    });

    it('should render selected variant', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      assert.ok(svg.includes('<circle r="5"/>'));
      assert.ok(!svg.includes('<line'));
    });

    it('should skip component with probability 0', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesProbability: 0,
      }).toString();

      assert.ok(!svg.includes('<circle'));
      assert.ok(!svg.includes('<line'));
    });

    it('should apply transforms', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
        eyesTranslateX: 5,
        eyesTranslateY: 10,
      }).toString();

      assert.ok(svg.includes('transform="translate(2.5, 5)"'));
    });

    it('should apply rotation with center point', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
        eyesRotate: 45,
      }).toString();

      assert.ok(svg.includes('rotate(45, 25, 25)'));
    });

    it('should not wrap in g when no transforms', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
        eyesRotate: 0,
        eyesTranslateX: 0,
        eyesTranslateY: 0,
      }).toString();

      assert.ok(!svg.includes('<g'));
    });
  });

  describe('color rendering', () => {
    it('should resolve color reference to solid color', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000'],
      }).toString();

      assert.ok(svg.includes('fill="#ff0000"'));
    });

    it('should render linear gradient for multi-color fill', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000', '#0000ff'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000', '#0000ff'],
        bgColorFill: 'linear',
      }).toString();

      assert.ok(svg.includes('<defs>'));
      assert.ok(svg.includes('<linearGradient id="bg-color-'));
      assert.ok(svg.includes('stop-color="#ff0000"'));
      assert.ok(svg.includes('stop-color="#0000ff"'));
      assert.ok(svg.includes('fill="url(#bg-color-'));
    });

    it('should render radial gradient', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000', '#0000ff'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000', '#0000ff'],
        bgColorFill: 'radial',
      }).toString();

      assert.ok(svg.includes('<radialGradient id="bg-color-'));
      assert.ok(svg.includes('fill="url(#bg-color-'));
    });
  });

  describe('flip', () => {
    it('should apply horizontal flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'horizontal' }).toString();

      assert.ok(svg.includes('scale(-1, 1)'));
      assert.ok(svg.includes('translate(100, 0)'));
    });

    it('should apply vertical flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'vertical' }).toString();

      assert.ok(svg.includes('scale(1, -1)'));
      assert.ok(svg.includes('translate(0, 100)'));
    });

    it('should apply both flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'both' }).toString();

      assert.ok(svg.includes('scale(-1, -1)'));
      assert.ok(svg.includes('translate(100, 100)'));
    });

    it('should not apply flip when none', () => {
      const svg = new Avatar(minimalStyle, { flip: 'none' }).toString();

      assert.ok(!svg.includes('scale(-1'));
    });
  });

  describe('scale', () => {
    it('should apply scale transform', () => {
      const svg = new Avatar(minimalStyle, { scale: 0.5 }).toString();

      assert.ok(svg.includes('scale(0.5)'));
      assert.ok(svg.includes('translate(50, 50)'));
      assert.ok(svg.includes('translate(-50, -50)'));
    });

    it('should not apply scale when 1', () => {
      const svg = new Avatar(minimalStyle, { scale: 1 }).toString();

      assert.ok(!svg.includes('scale('));
    });
  });

  describe('component scale', () => {
    const styleWithComponent = new Style({
      canvas: {
        width: 100,
        height: 100,
        elements: [{ type: 'component', name: 'eyes' }],
      },
      components: {
        eyes: {
          width: 50,
          height: 50,
          variants: { open: { elements: [{ type: 'element', name: 'rect' }] } },
        },
      },
    });

    it('should apply component-specific scale around component center', () => {
      const svg = new Avatar(styleWithComponent, { eyesScale: 2 }).toString();

      assert.ok(svg.includes('translate(25, 25) scale(2) translate(-25, -25)'));
    });

    it('should not apply component scale when 1', () => {
      const svg = new Avatar(styleWithComponent, { eyesScale: 1 }).toString();

      assert.ok(!svg.includes('scale('));
    });

    it('should place component scale after rotate in the transform attribute', () => {
      const svg = new Avatar(styleWithComponent, {
        eyesRotate: 45,
        eyesScale: 2,
      }).toString();

      const rotateIndex = svg.indexOf('rotate(45');
      const scaleIndex = svg.indexOf('scale(2)');

      assert.ok(rotateIndex !== -1 && scaleIndex !== -1);
      assert.ok(rotateIndex < scaleIndex);
    });
  });

  describe('borderRadius', () => {
    it('should apply border radius via clipPath', () => {
      const svg = new Avatar(minimalStyle, { borderRadius: 10 }).toString();

      assert.ok(svg.includes('<clipPath id="clip-'));
      assert.ok(svg.includes('rx="10"'));
      assert.ok(svg.includes('ry="10"'));
      assert.ok(svg.includes('clip-path="url(#clip-'));
    });

    it('should not apply border radius when 0', () => {
      const svg = new Avatar(minimalStyle, { borderRadius: 0 }).toString();

      assert.ok(!svg.includes('clipPath'));
    });
  });

  describe('idRandomization', () => {
    const styleWithIds = new Style({
      canvas: {
        width: 100,
        height: 100,
        elements: [
          {
            type: 'element',
            name: 'defs',
            children: [
              {
                type: 'element',
                name: 'linearGradient',
                attributes: { id: 'grad1' },
                children: [
                  { type: 'element', name: 'stop', attributes: { offset: '0%', 'stop-color': 'red' } },
                ],
              },
            ],
          },
          {
            type: 'element',
            name: 'rect',
            attributes: { fill: 'url(#grad1)' },
          },
        ],
      },
    });

    it('should randomize ids when enabled', () => {
      const svg = new Avatar(styleWithIds, {
        seed: 'test',
        idRandomization: true,
      }).toString();

      assert.ok(!svg.includes('id="grad1"'));
      assert.ok(!svg.includes('url(#grad1)'));
      assert.ok(svg.includes('id="grad1-'));
      assert.ok(svg.includes('url(#grad1-'));
    });

    it('should not randomize ids when disabled', () => {
      const svg = new Avatar(styleWithIds, {
        seed: 'test',
        idRandomization: false,
      }).toString();

      assert.ok(svg.includes('id="grad1"'));
      assert.ok(svg.includes('url(#grad1)'));
    });

    it('should produce different ids on each call', () => {
      const svg1 = new Avatar(styleWithIds, { seed: 'test', idRandomization: true }).toString();
      const svg2 = new Avatar(styleWithIds, { seed: 'test', idRandomization: true }).toString();

      assert.notEqual(svg1, svg2);
    });
  });

  describe('background', () => {
    it('should render solid background', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000'],
      }).toString();

      assert.ok(svg.includes('<rect width="100" height="100" fill="#ff0000"/>'));
    });

    it('should render gradient background', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000', '#0000ff'],
        backgroundColorFill: 'linear',
      }).toString();

      assert.ok(svg.includes('<linearGradient id="background-color-'));
      assert.ok(svg.includes('fill="url(#background-color-'));
    });

    it('should apply gradient rotation', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000', '#0000ff'],
        backgroundColorFill: 'linear',
        backgroundColorAngle: 45,
      }).toString();

      assert.ok(svg.includes('gradientTransform="rotate(45, 0.5, 0.5)"'));
    });

    it('should not render background without colors', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(!svg.includes('<rect'));
    });
  });

  describe('global transforms', () => {
    it('should apply global rotation', () => {
      const svg = new Avatar(minimalStyle, { rotate: 45 }).toString();

      assert.ok(svg.includes('rotate(45, 50, 50)'));
    });

    it('should not apply global rotation when 0', () => {
      const svg = new Avatar(minimalStyle, { rotate: 0 }).toString();

      assert.ok(!svg.includes('rotate('));
    });

    it('should apply global translate as percentage', () => {
      const svg = new Avatar(minimalStyle, {
        translateX: 10,
        translateY: -20,
      }).toString();

      assert.ok(svg.includes('translate(10, -20)'));
    });
  });

  describe('metadata', () => {
    it('should render metadata with Dublin Core fields', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'John Doe' },
          source: { name: 'My Style', url: 'https://example.com' },
          license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<metadata'));
      assert.ok(svg.includes('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'));
      assert.ok(svg.includes('<dc:title>My Style</dc:title>'));
      assert.ok(svg.includes('<dc:creator>John Doe</dc:creator>'));
      assert.ok(svg.includes('<dc:source xsi:type="dcterms:URI">https://example.com</dc:source>'));
      assert.ok(svg.includes('<dcterms:license xsi:type="dcterms:URI">https://opensource.org/licenses/MIT</dcterms:license>'));
    });

    it('should not render metadata when no meta', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(!svg.includes('<metadata'));
    });

    it('should include dc:rights with license text', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'Pablo Stanley' },
          source: { name: 'Avataaars', url: 'https://avataaars.com' },
          license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('Remix of'));
      assert.ok(svg.includes('Avataaars'));
      assert.ok(svg.includes('Pablo Stanley'));
      assert.ok(svg.includes('CC BY 4.0'));
    });

    it('should not prefix "Remix of" for MIT licensed DiceBear styles', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'DiceBear' },
          source: { name: 'Initials' },
          license: { name: 'MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(!svg.includes('Remix of'));
      assert.ok(svg.includes('Initials'));
    });

    it('should escape XML in metadata', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'A & B' },
          source: { name: '<Script>' },
          license: { name: 'MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('A &amp; B'));
      assert.ok(svg.includes('&lt;Script&gt;'));
    });
  });

  describe('variable attributes', () => {
    it('should resolve font-family variable reference in attributes', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-family': { type: 'variable', name: 'fontFamily' } },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { fontFamily: 'Arial' }).toString();

      assert.ok(svg.includes('font-family="Arial"'));
    });

    it('should resolve font-weight variable reference in attributes', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-weight': { type: 'variable', name: 'fontWeight' } },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { fontWeight: 700 }).toString();

      assert.ok(svg.includes('font-weight="700"'));
    });

    it('should still accept plain string for font-family', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-family': 'monospace' },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('font-family="monospace"'));
    });
  });

  describe('xml escaping', () => {
    it('should escape attribute values', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'element', name: 'rect', attributes: { d: 'a & b "c"' } },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('d="a &amp; b &quot;c&quot;"'));
    });

    it('should escape text content', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: '<script>alert("xss")</script>' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(!svg.includes('<script>'));
      assert.ok(svg.includes('&lt;script&gt;'));
    });
  });
});
