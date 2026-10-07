const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('<select') || l.includes('type="date"') || l.includes('type="time"') || l.includes('type="datetime-local"')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
