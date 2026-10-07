const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

console.log('=== MATCHES ===');
lines.forEach((line, i) => {
  if (
    line.includes('id="modal-') || 
    line.includes('<select') || 
    line.includes('type="date') || 
    line.includes('type="time') || 
    line.includes('type="datetime') ||
    line.includes('input-')
  ) {
    if (line.includes('input-') && (line.includes('<input') || line.includes('<select') || line.includes('<textarea'))) {
      console.log(`${i + 1}: ${line.trim()}`);
    } else if (line.includes('id="modal-')) {
      console.log(`\n--- MODAL AT LINE ${i + 1}: ${line.trim()} ---`);
    }
  }
});
