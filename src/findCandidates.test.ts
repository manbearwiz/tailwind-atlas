import { describe, expect, it, vi } from 'vitest';

import { findCandidates } from './findCandidates';

const { scanDir } = vi.hoisted(() => {
  return { scanDir: vi.fn() };
});

vi.mock('@tailwindcss/oxide', () => ({
  scanDir,
}));

describe('findCandidates', () => {
  it('should find the candidates in the given directory', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['a', 'relative', 'com', 'block', 'w-full', 'div', 'event'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
			[
			  "relative",
			  "block",
			  "w-full",
			]
		`);
  });

  it('should return an empty array if no candidates are found', async () => {
    scanDir.mockReturnValueOnce({
      candidates: [],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot('[]');
  });

  it('should handle malformed candidates', async () => {
    scanDir.mockReturnValueOnce({
      candidates: [1, null, undefined, '', 'relative', 'block', 'w-full'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "relative",
        "block",
        "w-full",
      ]
    `);
  });

  it('should handle conditional modifiers', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['focus:outline-none', 'focus-visible:ring', 'hover:block'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "focus:outline-none",
        "focus-visible:ring",
        "hover:block",
      ]
    `);
  });

  it('should handle duplicate candidates', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['relative', 'relative', 'block', 'w-full'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "relative",
        "block",
        "w-full",
      ]
    `);
  });

  it('should exclude fractional values', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['w-1/2', 'w-full'],
    });

    const candidates = await findCandidates('.', false);

    expect(candidates).toMatchInlineSnapshot(`
      [
        "w-full",
      ]
    `);
  });

  it('should handle fractional values', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['w-1/2', 'w-full'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "w-1/2",
        "w-full",
      ]
    `);
  });

  it('should filter out candidates that cannot be parsed', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['order-foo/order-bar', 'order-first'],
    });

    const candidates = await findCandidates('.', false);

    expect(candidates).toMatchInlineSnapshot(`
      [
        "order-first",
      ]
    `);
  });
});
