import { buildSafelist } from './buildSafelist';

import { describe, expect, it, vi } from 'vitest';
import { parseCandidates } from './parseCandidates';

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

describe('buildSafelist', () => {
  it('should build the safelist from the given candidates', async () => {
    const candidates = ['relative', 'block', 'w-full'];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
			[
			  "relative",
			  "block",
			  "w-full",
			]
		`);
  });

  it('should parse the given candidates with multiple values', async () => {
    const candidates = [
      'text-blue-500',
      'text-blue-600',
      'text-yellow-500',
      'text-yellow-600',
      'rounded-lg',
    ];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        {
          "pattern": "/^text-(blue-500|blue-600|yellow-500|yellow-600)$/",
        },
        "rounded-lg",
      ]
    `);
  });

  it('should parse the given candidates with multiple variants', async () => {
    const candidates = ['hover:text-zinc-950', 'text-zinc-700'];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        {
          "pattern": "/^text-(zinc-700|zinc-950)$/",
          "variants": [
            "hover",
          ],
        },
      ]
    `);
  });

  it('should support breakpoints', async () => {
    const candidates = [
      'grid',
      'grid-cols-1',
      'md:grid-cols-3',
      'sm:grid-cols-2',
      'lg:grid-cols-4',
      'sm:flex-nowrap',
      'gap-x-4',
      'gap-y-0',
      'justify-between',
    ];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        "grid",
        {
          "pattern": "/^grid-cols-(1|2|3|4)$/",
          "variants": [
            "lg",
            "md",
            "sm",
          ],
        },
        {
          "pattern": "/^flex-nowrap$/",
          "variants": [
            "sm",
          ],
        },
        "gap-x-4",
        "gap-y-0",
        "justify-between",
      ]
    `);
  });

  it('should support fractional values', async () => {
    const candidates = ['basis-full', 'lg:basis-1/2', 'basis-1/6'];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        "basis-full",
        {
          "pattern": "/^basis-(1\\/2|1\\/6)$/",
          "variants": [
            "lg",
          ],
        },
      ]
    `);
  });

  it('should support a mix of candidates with variants and values', async () => {
    const candidates = ['grow', 'grow-0', 'md:grow'];
    const parsed = await parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        {
          "pattern": "/^grow-0$/",
          "variants": [
            "md",
          ],
        },
      ]
    `);
  });
});
