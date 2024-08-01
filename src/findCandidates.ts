import { scanDir } from '@tailwindcss/oxide';
import { __unstable__loadDesignSystem as loadDesignSystem } from 'tailwindcss';

/**
 * Finds the candidates in the given directory.
 * @param base The base directory to scan.
 * @returns The candidates found in the directory.
 */
export function findCandidates(base: string) {
  const { candidates } = scanDir({ base, globs: true });

  const designSystem = loadDesignSystem('');

  return [
    ...new Set(
      candidates.filter(
        (candidate) =>
          candidate &&
          typeof candidate === 'string' &&
          designSystem.parseCandidate(candidate),
      ),
    ),
  ];
}
