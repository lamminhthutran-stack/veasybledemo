const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const emojiRegex = /\p{Extended_Pictographic}/gu;
const srcDir = path.join(__dirname, 'src');
const allFiles = getFiles(srcDir);

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  if (emojiRegex.test(content)) {
    content = content.replace(emojiRegex, '');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`Updated ${file}`);
  }
}
