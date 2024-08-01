import { buildSafelist } from './buildSafelist';

import { describe, expect, it } from 'vitest';
import { parseCandidates } from './parseCandidates';

describe('buildSafelist', () => {
  it('should build the safelist from the given candidates', () => {
    const candidates = ['relative', 'block', 'w-full'];
    const parsed = parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
			[
			  "relative",
			  "block",
			  "w-full",
			]
		`);
  });

  it('should parse the given candidates with multiple values', () => {
    const candidates = [
      'text-blue-500',
      'text-blue-600',
      'text-yellow-500',
      'text-yellow-600',
      'rounded-lg',
    ];
    const parsed = parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        {
          "pattern": "/^text-(blue-500|blue-600|yellow-500|yellow-600)$/",
        },
        {
          "pattern": "/^rounded-lg$/",
        },
      ]
    `);
  });

  it('should parse the given candidates with multiple variants', () => {
    const candidates = ['hover:text-zinc-950', 'text-zinc-700'];

    const parsed = parseCandidates(candidates);

    const safelist = buildSafelist(parsed);

    expect(safelist).toMatchInlineSnapshot(`
      [
        {
          "pattern": "/^text-(zinc-950|zinc-700)$/",
          "variants": [
            "hover",
          ],
        },
      ]
    `);
  });
});
