/**
 * Removes node_modules with retries (Windows EPERM when Node/AV locks native .node files).
 * Stop `npm start` / `ng serve` before running.
 */
import { rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const nodeModules = join(process.cwd(), 'node_modules');

if (!existsSync(nodeModules)) {
  console.log('node_modules not found — nothing to clean.');
  process.exit(0);
}

try {
  rmSync(nodeModules, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 800,
  });
  console.log('node_modules removed successfully.');
} catch (error) {
  console.error('\nCould not remove node_modules.');
  console.error('On Windows this usually means a file is locked by:');
  console.error('  - ng serve / npm start (stop the dev server first)');
  console.error('  - ESLint / TypeScript language service (reload the IDE window)');
  console.error('  - Antivirus (temporarily exclude the project folder)\n');
  console.error('Then run:  taskkill //F //IM node.exe');
  console.error('Or close terminals and retry:  npm run clean:modules\n');
  console.error(error);
  process.exit(1);
}
