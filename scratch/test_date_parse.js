function parseInputVal(val, mode, format) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    let day = new Date().getDate();
    let hour = 8;
    let minute = 0;

    if (!val || typeof val !== 'string') {
        return { year, month, day, hour, minute };
    }

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
        // e.g. "2026-10-06T08:15" or "2026-10-06 08:15"
        const [dPart, tPart] = val.split(/[T ]/);
        if (dPart) {
            const dPieces = dPart.split('-');
            if (dPieces.length === 3) {
                year = parseInt(dPieces[0], 10);
                month = (parseInt(dPieces[1], 10) - 1);
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

    // mode === 'date'
    if (val.includes('-')) {
        // YYYY-MM-DD
        const pieces = val.split('-');
        if (pieces.length === 3) {
            year = parseInt(pieces[0], 10);
            month = parseInt(pieces[1], 10) - 1;
            day = parseInt(pieces[2], 10);
        }
    } else if (val.includes('/')) {
        // DD/MM/YYYY or MM/YYYY
        const pieces = val.split('/');
        if (pieces.length === 3) {
            day = parseInt(pieces[0], 10);
            month = parseInt(pieces[1], 10) - 1;
            year = parseInt(pieces[2], 10);
        } else if (pieces.length === 2) {
            // MM/YYYY
            month = parseInt(pieces[0], 10) - 1;
            year = parseInt(pieces[1], 10);
            day = 1;
        }
    }

    return { year, month, day, hour, minute };
}

console.log('ISO date:', parseInputVal('2026-10-06', 'date'));
console.log('Time:', parseInputVal('08:30', 'time'));
console.log('ISO datetime:', parseInputVal('2026-10-06T14:45', 'datetime'));
console.log('MonthYear:', parseInputVal('03/2026', 'date', 'MM/YYYY'));
console.log('Vietnamese date:', parseInputVal('15/03/2026', 'date'));
