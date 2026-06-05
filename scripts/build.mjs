import * as esbuild from 'esbuild';
import { cpSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const isWatch = process.argv.includes('--watch');

const shared = {
  bundle: true,
  platform: 'browser',
  target: ['chrome109', 'firefox109'],
  sourcemap: isWatch ? 'inline' : false,
};

function copyPublic() {
  mkdirSync(join(root, 'dist'), { recursive: true });
  cpSync(join(root, 'public'), join(root, 'dist'), { recursive: true });
  console.log('Copied public/ → dist/');
}

if (isWatch) {
  const popup = await esbuild.context({
    ...shared,
    entryPoints: [join(root, 'src/popup.ts')],
    outfile: join(root, 'dist/popup.js'),
  });
  const options = await esbuild.context({
    ...shared,
    entryPoints: [join(root, 'src/options.ts')],
    outfile: join(root, 'dist/options.js'),
  });
  copyPublic();
  await popup.watch();
  await options.watch();
  console.log('Watching for changes…');
} else {
  await esbuild.build({
    ...shared,
    entryPoints: [join(root, 'src/popup.ts')],
    outfile: join(root, 'dist/popup.js'),
  });
  await esbuild.build({
    ...shared,
    entryPoints: [join(root, 'src/options.ts')],
    outfile: join(root, 'dist/options.js'),
  });
  copyPublic();
  console.log('Build complete → dist/');
}
