function hasConflict(bookings, startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    return bookings.some(b => {
        const bStart = new Date(b.start_time).getTime();
        const bEnd = new Date(b.end_time).getTime();

        return bStart < end && bEnd > start;
    });
}

// Walidacja czasu
function validateBookingTime(startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (isNaN(start) || isNaN(end)) {
        return { valid: false, message: 'Niepoprawna data' };
    }

    if (end <= start) {
        return { valid: false, message: 'Niepoprawny zakres czasu' };
    }

    return { valid: true };
}

// Czas trwania
function getBookingDurationMinutes(startTime, endTime) {
    return (new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000;
}

// Limit czasu
function checkMaxBookingTime(duration, maxAllowed) {
    if (duration > maxAllowed) {
        return {
            valid: false,
            message: `Maksymalny czas rezerwacji to ${maxAllowed} minut`
        };
    }

    return { valid: true };
}
function getRoomStatus(room, bookings = [], now = new Date()) {
    if (room.status === 'maintenance') return 'maintenance';

    
    const nowUTC = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

    const occupied = bookings.some(b => {
        const start = new Date(b.start_time);
        const end = new Date(b.end_time);

        return start <= nowUTC && end >= nowUTC;
    });

    return occupied ? 'occupied' : 'free';
}
module.exports = {
    hasConflict,
    validateBookingTime,
    getBookingDurationMinutes,
    checkMaxBookingTime,
    getRoomStatus
};