#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'src');

function shouldAddExt(p) {
  // ignore absolute or package imports
  if (!p.startsWith('./') && !p.startsWith('../')) return false;
  // has known extension already
  if (/\.(js|mjs|cjs|ts|tsx|json)$/.test(p)) return false;
  return true;
}

function transformFile(file) {
  let s = fs.readFileSync(file, 'utf8');
  const orig = s;

  // import ... from '...'
  s = s.replace(/(from\s+['"])(\.\.?\/[^'";]+)(['"])/g, (m, a, rel, b) => {
    if (shouldAddExt(rel)) return a + rel + '.js' + b;
    return m;
  });

  // export ... from '...'
  s = s.replace(/(export\s+[^\n]*?from\s+['"])(\.\.?\/[^'";]+)(['"])/g, (m, a, rel, b) => {
    if (shouldAddExt(rel)) return a + rel + '.js' + b;
    return m;
  });

  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('Patched', path.relative(process.cwd(), file));
  }
}

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (p.endsWith('.ts')) transformFile(p);
  }
}

walk(root);
console.log('Done.');
