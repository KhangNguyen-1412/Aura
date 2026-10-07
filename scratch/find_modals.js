const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((line, i) => {
  if (line.includes('id="modal-')) {
    console.log(`MODAL [${i+1}]: ${line.trim()}`);
  }
  if (line.includes('endocrine') && (line.includes('<input') || line.includes('<button') || line.includes('open') || line.includes('modal'))) {
    console.log(`ENDOCRINE [${i+1}]: ${line.trim()}`);
  }
});
