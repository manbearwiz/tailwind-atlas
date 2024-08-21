import { describe, expect, it, vi } from 'vitest';

import { findCandidates } from './findCandidates';

const { scanDir } = vi.hoisted(() => {
  return { scanDir: vi.fn() };
});

vi.mock('@tailwindcss/oxide', () => ({
  scanDir,
}));

vi.mock('tailwindcss/theme.css?raw', () => {
  return {
    default: `
    @theme {
      /* Breakpoints */
      --breakpoint-sm: 40rem;
      --breakpoint-md: 48rem;
      --breakpoint-lg: 64rem;
      --breakpoint-xl: 80rem;
      --breakpoint-2xl: 96rem;

      /* Spacing */
      --spacing-px: 1px;
      --spacing-0: 0px;
      --spacing-0_5: 0.125rem;
      --spacing-1: 0.25rem;
      --spacing-1_5: 0.375rem;
      --spacing-2: 0.5rem;
      --spacing-2_5: 0.625rem;
      --spacing-3: 0.75rem;
      --spacing-3_5: 0.875rem;
      --spacing-4: 1rem;

      /* Colors */
      --color-zinc-50: #fafafa;
      --color-zinc-100: #f4f4f5;
      --color-zinc-200: #e4e4e7;
      --color-zinc-300: #d4d4d8;
      --color-zinc-400: #a1a1aa;
      --color-zinc-500: #71717a;
      --color-zinc-600: #52525b;
      --color-zinc-700: #3f3f46;
      --color-zinc-800: #27272a;
      --color-zinc-900: #18181b;
      --color-zinc-950: #09090b;
    }
  `,
  };
});

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

  it('should handle candidates with values and variants', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['ring-zinc-950/5', 'hover:text-zinc-400'],
    });

    const candidates = await findCandidates('.');

    expect(candidates).toMatchInlineSnapshot(`
      [
        "ring-zinc-950/5",
        "hover:text-zinc-400",
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

  it('should handle breakpoints', async () => {
    scanDir.mockReturnValueOnce({
      candidates: ['grid', 'gap-4', 'md:grid-cols-4', 'sm:grid-cols-3', 'py-4'],
    });

    const candidates = findCandidates('.');

    expect(candidates).resolves.toMatchInlineSnapshot(`
      [
        "grid",
        "gap-4",
        "md:grid-cols-4",
        "sm:grid-cols-3",
        "py-4",
      ]
    `);
  });
});
