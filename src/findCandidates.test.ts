import { describe, expect, it, vi } from 'vitest';

import { findCandidates } from './findCandidates';

const { scanDir } = vi.hoisted(() => {
  return { scanDir: vi.fn() };
});

vi.mock('@tailwindcss/oxide', () => ({
  scanDir,
}));

describe('findCandidates', () => {
  it('should find the candidates in the given directory', () => {
    scanDir.mockReturnValueOnce({
      candidates: ['a', 'relative', 'com', 'block', 'w-full', 'div', 'event'],
    });

    const candidates = findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
			[
			  "relative",
			  "block",
			  "w-full",
			]
		`);
  });

  it('should return an empty array if no candidates are found', () => {
    scanDir.mockReturnValueOnce({
      candidates: [],
    });

    const candidates = findCandidates('.');

    expect(candidates).toMatchInlineSnapshot('[]');
  });

  it('should handle malformed candidates', () => {
    scanDir.mockReturnValueOnce({
      candidates: [1, null, undefined, '', 'relative', 'block', 'w-full'],
    });

    const candidates = findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "relative",
        "block",
        "w-full",
      ]
    `);
  });

  it('should handle candidates with values and variants', () => {
    scanDir.mockReturnValueOnce({
      candidates: ['ring-zinc-950/5', 'hover:text-zinc-400'],
    });

    const candidates = findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "ring-zinc-950/5",
        "hover:text-zinc-400",
      ]
    `);
  });

  it('should handle duplicate candidates', () => {
    scanDir.mockReturnValueOnce({
      candidates: ['relative', 'relative', 'block', 'w-full'],
    });

    const candidates = findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "relative",
        "block",
        "w-full",
      ]
    `);
  });
});
