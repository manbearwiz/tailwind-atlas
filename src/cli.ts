import { Command, Option } from 'commander';
import { resolve } from 'pathe';
import { buildSafelist } from './buildSafelist';
import { findCandidates } from './findCandidates';
import { parseCandidates } from './parseCandidates';

export async function main() {
  const program = new Command('tailwind-atlas');
  program
    .command('find <path>')
    .description('Find all Tailwind CSS candidates in the given path.')
    .addOption(
      new Option('-f, --format <format>', 'The output format.')
        .choices(['json', 'csv'])
        .default('json'),
    )
    .addOption(new Option('--no-fractions', 'Exclude fractional values.'))
    .action(async (path, { format, fractions }) => {
      const base = resolve(path);
      const candidates = await findCandidates(base, fractions);

      if (format === 'csv') {
        console.log(candidates.join('\n'));
      } else {
        console.log(JSON.stringify(candidates, null, 2));
      }
    });

  program
    .command('parse <path>')
    .description('Parse all Tailwind CSS candidates in the given path.')
    .addOption(new Option('--no-fractions', 'Exclude fractional values.'))
    .action(async (path, { fractions }) => {
      const base = resolve(path);
      const candidates = await findCandidates(base, fractions);
      const parsed = await parseCandidates(candidates);

      console.log(JSON.stringify(parsed, null, 2));
    });

  program
    .command('safelist [path]')
    .description('Build a Tailwind CSS safelist from the given path or stdin.')
    .action(async (path) => {
      let candidates: string[] = [];
      if (path) {
        const base = resolve(path);
        candidates = await findCandidates(base);
      } else {
        let data = '';

        for await (const chunk of process.stdin) data += chunk;

        candidates = data.split('\n');
      }

      const parsed = await parseCandidates(candidates);
      const safelist = buildSafelist(parsed);

      console.log(JSON.stringify(safelist, null, 2));
    });

  await program.parseAsync(process.argv);
}
