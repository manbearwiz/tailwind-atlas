import { parseCandidates } from './parseCandidates';

import { describe, expect, it } from 'vitest';

describe('parseCandidates', () => {
  it('should parse the given candidates', () => {
    const candidates = ['relative', 'block', 'w-full'];
    const parsed = parseCandidates(candidates);

    expect(parsed).toMatchInlineSnapshot(
      `
      [
        {
          "important": false,
          "kind": "static",
          "negative": false,
          "root": "relative",
          "variants": [],
        },
        {
          "important": false,
          "kind": "static",
          "negative": false,
          "root": "block",
          "variants": [],
        },
        {
          "important": false,
          "kind": "static",
          "negative": false,
          "root": "w-full",
          "variants": [],
        },
      ]
    `,
    );
  });

  it('should parse the given candidates with multiple values', () => {
    const candidates = [
      'text-blue-500',
      'text-blue-600',
      'text-yellow-500',
      'text-yellow-600',
    ];
    const parsed = parseCandidates(candidates);

    expect(parsed).toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "blue-500",
          },
          "variants": [],
        },
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "blue-600",
          },
          "variants": [],
        },
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "yellow-500",
          },
          "variants": [],
        },
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "yellow-600",
          },
          "variants": [],
        },
      ]
    `);
  });

  it('should parse the given candidates with multiple variants', () => {
    const candidates = ['hover:text-zinc-950', 'text-zinc-700'];

    const parsed = parseCandidates(candidates);

    expect(parsed).toMatchInlineSnapshot(`
      [
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "zinc-950",
          },
          "variants": [
            {
              "compounds": true,
              "kind": "static",
              "root": "hover",
            },
          ],
        },
        {
          "important": false,
          "kind": "functional",
          "modifier": null,
          "negative": false,
          "root": "text",
          "value": {
            "fraction": null,
            "kind": "named",
            "value": "zinc-700",
          },
          "variants": [],
        },
      ]
    `);
  });
});
