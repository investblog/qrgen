import { generateMatrix } from '@qr/generate';
import { renderSvg, renderSvgPreview } from '@qr/render';
import { describe, expect, it } from 'vitest';

const preset250 = { id: 'sq250' as const, width: 250, height: 250, label: '250 px' };

describe('renderSvg', () => {
  const matrix = generateMatrix('https://example.com', 'M');
  const svg = renderSvg(matrix, 4, preset250);

  it('is single-line', () => {
    expect(svg).not.toContain('\n');
    expect(svg).not.toContain('\r');
  });

  it('has crispEdges', () => {
    expect(svg).toContain('shape-rendering="crispEdges"');
  });

  it('has exactly one <rect>', () => {
    expect(svg.match(/<rect /g)).toHaveLength(1);
  });

  it('has exactly one <path>', () => {
    expect(svg.match(/<path /g)).toHaveLength(1);
  });

  it('has no mask, clipPath, or <g>', () => {
    expect(svg).not.toContain('mask');
    expect(svg).not.toContain('clipPath');
    expect(svg).not.toContain('<g');
  });

  it('has no float coordinates in path', () => {
    const d = svg.match(/d="([^"]+)"/)?.[1] ?? '';
    const nums = d
      .replace(/[MhvzZ]/g, ' ')
      .trim()
      .split(/\s+/);
    for (const n of nums) {
      if (n === '') continue;
      expect(n).not.toContain('.');
    }
  });

  it('has correct viewBox', () => {
    const dim = matrix.size + 8; // 2 * quiet(4)
    expect(svg).toContain(`viewBox="0 0 ${dim} ${dim}"`);
  });

  it('has preset width and height', () => {
    expect(svg).toContain('width="250"');
    expect(svg).toContain('height="250"');
  });

  it('starts with <svg and ends with </svg>', () => {
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
  });
});

describe('renderSvg quiet=0', () => {
  it('viewBox equals matrix size', () => {
    const matrix = generateMatrix('test', 'L');
    const svg = renderSvg(matrix, 0, preset250);
    expect(svg).toContain(`viewBox="0 0 ${matrix.size} ${matrix.size}"`);
  });
});

describe('renderSvgPreview', () => {
  it('has no width/height on <svg> element', () => {
    const matrix = generateMatrix('test', 'M');
    const svg = renderSvgPreview(matrix, 4);
    // Extract just the <svg ...> opening tag
    const svgTag = svg.match(/<svg[^>]*>/)?.[0] ?? '';
    expect(svgTag).not.toMatch(/width="\d+"/);
    expect(svgTag).not.toMatch(/height="\d+"/);
  });

  it('has viewBox', () => {
    const matrix = generateMatrix('test', 'M');
    const svg = renderSvgPreview(matrix, 2);
    const dim = matrix.size + 4;
    expect(svg).toContain(`viewBox="0 0 ${dim} ${dim}"`);
  });
});
