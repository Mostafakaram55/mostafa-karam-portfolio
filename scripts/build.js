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

// Copy vercel.json if exists
if (fs.existsSync(path.join(rootDir, 'vercel.json'))) {
  fs.copyFileSync(path.join(rootDir, 'vercel.json'), path.join(distDir, 'vercel.json'));
}

console.log('✨ Build completed successfully! Distribution folder: dist/');
