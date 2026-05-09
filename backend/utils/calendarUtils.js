function buildRoomCalendar(roomId, date, bookings = []) {

    const slots = [
        { start: '08:00', end: '09:30' },
        { start: '09:45', end: '11:15' },
        { start: '11:30', end: '13:00' },
        { start: '13:15', end: '14:45' },
        { start: '15:00', end: '16:30' },
        { start: '16:45', end: '18:15' }
    ];

    function safeParse(dateString) {
        if (!dateString) return null;
        const d = new Date(dateString);
        return isNaN(d.getTime()) ? null : d;
    }

    return slots.map(slot => {

        const start = new Date(`${date}T${slot.start}:00`);
        const end = new Date(`${date}T${slot.end}:00`);

        const available = !bookings.some(b => {

            if (b.room_id !== roomId) return false;

            const bStart = safeParse(b.start_time);
            const bEnd = safeParse(b.end_time);

            if (!bStart || !bEnd) return false;

            return (
                bStart < end &&
                bEnd > start
            );
        });

        return {
            start: slot.start,
            end: slot.end,
            available
        };
    });
}

module.exports = { buildRoomCalendar };