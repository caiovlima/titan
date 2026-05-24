const fs = require('node:fs');
const path = require('node:path');

/**
 * Copia recursivamente um diretório
 */
function copyDir(src, dest, ignore = []) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (ignore.includes(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, ignore);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * Lê arquivo como template e substitui placeholders
 */
function renderTemplate(filePath, vars = {}) {
  let content = fs.readFileSync(filePath, 'utf-8');

  for (const [key, value] of Object.entries(vars)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  }

  return content;
}

module.exports = { copyDir, renderTemplate };
