import { scanDir } from '@tailwindcss/oxide';
import { resolve } from 'pathe';
import { buildSafelist } from './buildSafelist';
import { parseCandidates } from './parseCandidates';
/**
 * Scans the given directory for candidates.
 * @param base The base directory to scan.
 * @returns The candidates found in the directory.
 */
export function findCandidates(base: string) {
  const { candidates } = scanDir({ base, globs: true });
  return candidates;
}

export default function main(command: string, path: string) {
  const base = resolve(path);
  const candidates = findCandidates(base);

  if (command === 'find') {
    console.log(JSON.stringify(candidates, null, 2));
    return;
  }
  if (command === 'parse') {
    const parsed = parseCandidates(candidates);
    console.log(JSON.stringify(parsed, null, 2));
    return;
  }
  if (command === 'safelist') {
    const parsed = parseCandidates(candidates);
    const safelist = buildSafelist(parsed);
    console.log(JSON.stringify(safelist, null, 2));
    return;
  }
  return;
}

const [, , command, path] = process.argv;

if (command && path) {
  main(command, path);
}
