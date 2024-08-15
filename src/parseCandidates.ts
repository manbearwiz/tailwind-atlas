import { __unstable__loadDesignSystem as loadDesignSystem } from 'tailwindcss';

export type DesignSystem = Awaited<ReturnType<typeof loadDesignSystem>>;
export type DesignSystemCandidate = NonNullable<
  ReturnType<DesignSystem['parseCandidate']>
>;

/**
 * Checks if the given value is not null.
 * @param value The value to check.
 * @returns `true` if the value is not null, `false` otherwise.
 */
export function isNotNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

/**
 * Parses the given candidates.
 * @param candidates The candidates to parse.
 * @returns The parsed candidates.
 */
export async function parseCandidates(
  candidates: string[],
): Promise<DesignSystemCandidate[]> {
  const designSystem = await loadDesignSystem('');

  return candidates
    .map((candidate) => designSystem.parseCandidate(candidate))
    .filter(isNotNull);
}
