import {
  type DesignSystemCandidate,
  isNotNull,
  loadDesignSystem,
} from './utils';

/**
 * Parses the given candidates.
 * @param candidates The candidates to parse.
 * @returns The parsed candidates.
 */
export async function parseCandidates(
  candidates: string[],
): Promise<DesignSystemCandidate[]> {
  const designSystem = await loadDesignSystem();

  return candidates
    .map((candidate) => designSystem.parseCandidate(candidate))
    .filter(isNotNull);
}
