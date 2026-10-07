const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('id="module4"') || l.includes('Bạn Đồng Hành') || l.includes('renderPartners') || l.includes('partners-container') || l.includes('DEFAULT_PARTNER')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
