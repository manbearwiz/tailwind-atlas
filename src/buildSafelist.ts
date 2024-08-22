import { type DesignSystemCandidate, isNotNull } from './utils';

function bundleCandidates(
  candidates: DesignSystemCandidate[],
): Record<string, { variants: string[]; values?: (string | undefined)[] }> {
  const bundled = candidates
    .map((parsed) =>
      parsed.kind === 'static' || parsed.kind === 'functional'
        ? ([
            parsed.root,
            parsed?.variants
              ?.map((v) => (v.kind === 'static' ? v.root : ''))
              .filter(Boolean),
            ...(parsed.kind === 'functional' && parsed.value?.kind === 'named'
              ? [parsed.value?.fraction ?? parsed.value.value]
              : []),
          ] as const)
        : null,
    )
    .filter(isNotNull)
    .reduce(
      (acc, [root, variants, value]) => {
        if (root && acc[root]) {
          acc[root] = {
            ...acc[root],
            variants: [...acc[root].variants, ...variants],
            values: [...(acc[root].values ?? []), value],
          };
        } else {
          acc[root] = {
            variants,
            ...(value && { values: [value] }),
          };
        }

        return acc;
      },
      {} as Record<
        string,
        { variants: string[]; values?: (string | undefined)[] }
      >,
    );

  return Object.fromEntries(
    Object.entries(bundled).map(([root, { variants, values }]) => [
      root,
      {
        variants: [...new Set(variants)].filter(Boolean).sort(),
        ...(values && { values: [...new Set(values)].filter(Boolean).sort() }),
      } as const,
    ]),
  );
}

/**
 * Builds a safelist from the given candidates.
 * @param candidates The candidates to build the safelist from.
 * @returns The built safelist.
 */
export function buildSafelist(candidates: DesignSystemCandidate[]) {
  const parsed = bundleCandidates(candidates);
  const safelist = Object.entries(parsed).map(([root, { variants, values }]) =>
    variants.length || (values?.length && values.length > 1)
      ? {
          pattern: new RegExp(
            `^${root}${values ? `-${values.length > 1 ? `(${values.join('|')})` : values[0]}` : ''}$`,
          ).toString(),
          ...(variants.length && { variants }),
        }
      : values?.length
        ? `${root}-${values[0]}`
        : root,
  );
  return safelist;
}
