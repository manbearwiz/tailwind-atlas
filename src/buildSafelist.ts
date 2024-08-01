import { type DesignSystemCandidate, isNotNull } from './parseCandidates';

function bundleCandidates(
  candidates: DesignSystemCandidate[],
): Record<string, { variants: string[]; values?: (string | undefined)[] }> {
  return candidates
    .map((parsed) =>
      parsed.kind === 'static' || parsed.kind === 'functional'
        ? ([
            parsed.root,
            parsed?.variants
              ?.map((v) => (v.kind === 'static' ? v.root : ''))
              .filter(Boolean),
            ...(parsed.kind === 'functional' ? [parsed.value?.value] : []),
          ] as const)
        : null,
    )
    .filter(isNotNull)
    .reduce(
      (acc, [root, variants, value]) => {
        if (root && acc[root]) {
          acc[root] = {
            ...acc[root],
            variants: [...new Set([...acc[root].variants, ...variants])],
            values: [...new Set([...(acc[root]?.values ?? []), value])],
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
}

/**
 * Builds a safelist from the given candidates.
 * @param candidates The candidates to build the safelist from.
 * @returns The built safelist.
 */
export function buildSafelist(candidates: DesignSystemCandidate[]) {
  const parsed = bundleCandidates(candidates);
  const safelist = Object.entries(parsed).map(([root, { variants, values }]) =>
    variants.length || values?.length
      ? {
          pattern: new RegExp(
            `^${root}${values ? `-${values.length > 1 ? `(${values.join('|')})` : values[0]}` : ''}$`,
          ).toString(),
          ...(variants.length && { variants: [...new Set(variants)] }),
        }
      : root,
  );
  return safelist;
}
