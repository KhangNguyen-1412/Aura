// Verification of syncDatePickerDisplay logic
function parseInputVal(val, mode, format) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();
    let hour = 8;
    let minute = 0;

    if (!val || typeof val !== 'string') return { year, month, day, hour, minute };
    val = val.trim();

    if (mode === 'time') {
        const parts = val.split(':');
        if (parts.length >= 2) {
            hour = parseInt(parts[0], 10) || 0;
            minute = parseInt(parts[1], 10) || 0;
        }
        return { year, month, day, hour, minute };
    }

    if (mode === 'datetime') {
        const [dPart, tPart] = val.split(/[T ]/);
        if (dPart) {
            const dPieces = dPart.split('-');
            if (dPieces.length === 3) {
                year = parseInt(dPieces[0], 10);
                month = parseInt(dPieces[1], 10) - 1;
                day = parseInt(dPieces[2], 10);
            }
        }
        if (tPart) {
            const tPieces = tPart.split(':');
            if (tPieces.length >= 2) {
                hour = parseInt(tPieces[0], 10) || 0;
                minute = parseInt(tPieces[1], 10) || 0;
            }
        }
        return { year, month, day, hour, minute };
    }

    if (val.includes('-')) {
        const pieces = val.split('-');
        if (pieces.length === 3) {
            year = parseInt(pieces[0], 10);
            month = parseInt(pieces[1], 10) - 1;
            day = parseInt(pieces[2], 10);
        }
    } else if (val.includes('/')) {
        const pieces = val.split('/');
        if (pieces.length === 3) {
            day = parseInt(pieces[0], 10);
            month = parseInt(pieces[1], 10) - 1;
            year = parseInt(pieces[2], 10);
        } else if (pieces.length === 2) {
            month = parseInt(pieces[0], 10) - 1;
            year = parseInt(pieces[1], 10);
            day = 1;
        }
    }
    return { year, month, day, hour, minute };
}

function formatDisplayString(val, mode, format) {
    if (!val) return '';
    const parsed = parseInputVal(val, mode, format);
    const dStr = String(parsed.day).padStart(2, '0');
    const moStr = String(parsed.month + 1).padStart(2, '0');
    const yStr = parsed.year;
    const hStr = String(parsed.hour).padStart(2, '0');
    const miStr = String(parsed.minute).padStart(2, '0');

    if (mode === 'date') {
        if (format === 'MM/YYYY') return `Tháng ${moStr}/${yStr}`;
        return `${dStr}/${moStr}/${yStr}`;
    }
    if (mode === 'time') return `${hStr}:${miStr}`;
    if (mode === 'datetime') return `${dStr}/${moStr}/${yStr}, ${hStr}:${miStr}`;
    return val;
}

console.log('ISO Date:', formatDisplayString('2026-10-06', 'date'));
console.log('Time:', formatDisplayString('08:15', 'time'));
console.log('DateTime:', formatDisplayString('2026-10-06T08:15', 'datetime'));
console.log('Semen Date MM/YYYY:', formatDisplayString('10/2026', 'date', 'MM/YYYY'));
console.log('Semen Date YYYY-MM:', formatDisplayString('2026-10', 'date', 'MM/YYYY'));
