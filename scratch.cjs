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

let total = 0;
for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(emojiRegex);
  if (matches) {
    console.log(`Found ${matches.length} emojis in ${file}`);
    const unique = [...new Set(matches)];
    console.log(`  Unique emojis: ${unique.join(', ')}`);
    total += matches.length;
  }
}
console.log(`Total emojis found: ${total}`);
