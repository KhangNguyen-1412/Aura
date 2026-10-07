const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

const keywords = ['openProfileModal', 'openSemenModal', 'openReleaseLogModal', 'saveEndocrineTest', 'saveSemenAnalysis', 'saveReleaseLog', 'savePartner', 'saveCustomSupplement', 'saveWorkout', 'openWorkoutModal', 'openSupplementModal', 'openPartnerModal'];
lines.forEach((l, i) => {
  keywords.forEach(kw => {
    if (l.includes(kw) && (l.includes('function') || l.includes('window.') || l.includes('const ') || l.includes('let '))) {
      console.log(`${i+1}: ${l.trim()}`);
    }
  });
});
