// Test datepicker helper logic
function formatDate(d, mode, format) {
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

// Test cases
const d = new Date(2026, 9, 6, 8, 15);
console.log('Date:', formatDate(d, 'date'));
console.log('Time:', formatDate(d, 'time'));
console.log('DateTime:', formatDate(d, 'datetime'));
console.log('MonthYear:', formatDate(d, 'date', 'MM/YYYY'));
