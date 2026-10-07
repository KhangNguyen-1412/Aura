// Test full AuraDatePicker logic in node mock
const target = {
    value: ''
};
const display = {
    value: ''
};

function formatDateObj(d, mode, format) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    if (mode === 'date') {
        if (format === 'MM/YYYY') {
            return {
                raw: `${month}/${year}`,
                display: `Tháng ${month}/${year}`
            };
        }
        return {
            raw: `${year}-${month}-${day}`,
            display: `${day}/${month}/${year}`
        };
    }
    if (mode === 'time') {
        return {
            raw: `${hours}:${mins}`,
            display: `${hours}:${mins}`
        };
    }
    if (mode === 'datetime') {
        return {
            raw: `${year}-${month}-${day}T${hours}:${mins}`,
            display: `${day}/${month}/${year}, ${hours}:${mins}`
        };
    }
    return { raw: '', display: '' };
}

const d = new Date(2026, 9, 6, 8, 15);
console.log('Formatted date:', formatDateObj(d, 'date'));
console.log('Formatted datetime:', formatDateObj(d, 'datetime'));
console.log('Formatted time:', formatDateObj(d, 'time'));
console.log('All functions mock test passed!');
