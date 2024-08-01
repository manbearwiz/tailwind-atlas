import { resolve } from 'pathe';
import { buildSafelist } from './buildSafelist';
import { findCandidates } from './findCandidates';
import { parseCandidates } from './parseCandidates';

export function main(command: string, path: string) {
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
