#!/usr/bin/env node

import { main } from './dist/tailwind-atlas.js';

const [, , command, path] = process.argv;

if (command && path) {
  main(command, path);
}
