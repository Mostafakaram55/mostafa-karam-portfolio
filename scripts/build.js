const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 Building production distribution...');

// Recreate dist directory
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy index.html
fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
console.log('✓ Copied index.html');

// Copy assets
if (fs.existsSync(path.join(rootDir, 'assets'))) {
  copyRecursiveSync(path.join(rootDir, 'assets'), path.join(distDir, 'assets'));
  console.log('✓ Copied assets directory');
}

// Stamp a content hash on CSS/JS URLs so a changed file is never served from a stale cache
const crypto = require('crypto');
const distIndex = path.join(distDir, 'index.html');
let indexHtml = fs.readFileSync(distIndex, 'utf8');
indexHtml = indexHtml.replace(/(assets\/(?:css|js)\/[\w.-]+)\?v=[^"']*/g, (match, assetPath) => {
  const file = path.join(distDir, assetPath);
  if (!fs.existsSync(file)) return match;
  const hash = crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex').slice(0, 10);
  return `${assetPath}?v=${hash}`;
});
fs.writeFileSync(distIndex, indexHtml);
console.log('✓ Stamped asset versions');

// Copy vercel.json if exists
if (fs.existsSync(path.join(rootDir, 'vercel.json'))) {
  fs.copyFileSync(path.join(rootDir, 'vercel.json'), path.join(distDir, 'vercel.json'));
}

console.log('✨ Build completed successfully! Distribution folder: dist/');
