#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Usage: npm create titan@latest <project-name>');
  process.exit(1);
}

const result = spawnSync(
  'npx',
  ['@angular/cli@latest', 'new', projectName, '--routing', '--style=scss', '--ssr', '--standalone', '--strict', '--package-manager=npm'],
  { stdio: 'inherit', shell: true, cwd: path.resolve(__dirname, '../../..') },
);

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log('\nTitan template: copy architecture from https://github.com/your-org/titan');
