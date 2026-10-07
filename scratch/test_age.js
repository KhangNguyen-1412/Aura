// Test calculate age logic
function calculateAge(dobStr) {
    if (!dobStr) return '';
    const birthDate = new Date(dobStr);
    if (isNaN(birthDate.getTime())) return '';
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age > 0 ? `${age} tuổi` : '';
}

console.log('Age for 1998-05-14:', calculateAge('1998-05-14'));
console.log('Age for 2002-10-01:', calculateAge('2002-10-01'));
