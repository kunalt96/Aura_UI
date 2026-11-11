import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssImport from 'postcss-import';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, '..');
const entryCssPath = path.join(pkgRoot, 'src/styles/styles.css');
const outCssPath = path.join(pkgRoot, 'dist/styles.css');
const require = createRequire(import.meta.url);

async function main() {
  const source = readFileSync(entryCssPath, 'utf8');
  const result = await postcss([
    postcssImport({
      root: path.dirname(entryCssPath),
      resolve(id, basedir) {
        if (id.startsWith('.')) {
          return path.resolve(basedir, id);
        }
        return require.resolve(id);
      },
    }),
    cssnano({ preset: 'default' }),
  ]).process(source, {
    from: entryCssPath,
    to: outCssPath,
    map: false,
  });

  mkdirSync(path.dirname(outCssPath), { recursive: true });
  writeFileSync(outCssPath, result.css, 'utf8');
  console.log(`Built ${path.relative(pkgRoot, outCssPath)} (${Buffer.byteLength(result.css)} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
