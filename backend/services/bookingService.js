const { sql } = require('../db');

const {
    validateBookingTime,
    getBookingDurationMinutes,
    checkMaxBookingTime
} = require('../utils/bookingUtils');

const { bookingConfirmation } = require('./notificationService');

// GET bookings
async function getBookings(user) {
    const request = new sql.Request();

    if (user.role === 'admin') {
        const result = await request.query(`
            SELECT * FROM bookings
            ORDER BY start_time DESC
        `);
        return result.recordset;
    }

    request.input('userId', sql.Int, user.id);

    const result = await request.query(`
        SELECT * FROM bookings
        WHERE user_id = @userId
        ORDER BY start_time DESC
    `);

    return result.recordset;
}

// CREATE booking
async function createBooking(user, data) {
    const { room_id, start_time, end_time } = data;

    if (!room_id) {
        return { error: 'Brak room_id' };
    }

    const validation = validateBookingTime(start_time, end_time);

    if (!validation.valid) {
        return { error: validation.message };
    }

    if (new Date(start_time) <= new Date()) {
        return { error: 'Nie można rezerwować w przeszłości' };
    }

    const transaction = new sql.Transaction();

    try {
        await transaction.begin();

        const request = new sql.Request(transaction);

        request.input('roomId', sql.Int, room_id);

        const roomRes = await request.query(`
            SELECT id, max_booking_minutes, status
            FROM rooms
            WHERE id = @roomId
        `);

        const room = roomRes.recordset[0];

        if (!room) {
            await transaction.rollback();
            return { error: 'Sala nie istnieje' };
        }

        if (room.status === 'maintenance') {
            await transaction.rollback();
            return { error: 'Sala w konserwacji' };
        }

        const duration = getBookingDurationMinutes(start_time, end_time);

        const limit = checkMaxBookingTime(
            duration,
            room.max_booking_minutes
        );

        if (!limit.valid) {
            await transaction.rollback();
            return { error: limit.message };
        }

        const conflictReq = new sql.Request(transaction);

        conflictReq.input('roomId', sql.Int, room_id);
        conflictReq.input('startTime', sql.DateTime, start_time);
        conflictReq.input('endTime', sql.DateTime, end_time);

        const conflict = await conflictReq.query(`
            SELECT id
            FROM bookings
            WHERE room_id = @roomId
            AND status = 'active'
            AND start_time < @endTime
            AND end_time > @startTime
        `);

        if (conflict.recordset.length > 0) {
            await transaction.rollback();
            return { error: 'Sala zajęta w tym terminie' };
        }

        const insert = new sql.Request(transaction);

        insert.input('userId', sql.Int, user.id);
        insert.input('roomId', sql.Int, room_id);
        insert.input('startTime', sql.DateTime, start_time);
        insert.input('endTime', sql.DateTime, end_time);

        await insert.query(`
            INSERT INTO bookings (
                user_id,
                room_id,
                start_time,
                end_time,
                status
            )
            VALUES (
                @userId,
                @roomId,
                @startTime,
                @endTime,
                'active'
            )
        `);

        await transaction.commit();

        bookingConfirmation(user.email, {
            room_id,
            start_time,
            end_time
        });

        return { success: true };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

// CANCEL booking
async function cancelBooking(user, bookingId) {
    const request = new sql.Request();
    request.input('id', sql.Int, bookingId);

    const result = await request.query(`
        SELECT * FROM bookings WHERE id = @id
    `);

    const booking = result.recordset[0];
    if (!booking) return { error: 'Rezerwacja nie istnieje' };

    if (booking.user_id !== user.id && user.role !== 'admin') {
        return { error: 'Brak uprawnień' };
    }

    if (new Date() >= new Date(booking.start_time)) {
        return { error: 'Nie można anulować rozpoczętej rezerwacji' };
    }

    const cancel = new sql.Request();
    cancel.input('id', sql.Int, bookingId);

    await cancel.query(`
        UPDATE bookings
        SET status = 'cancelled'
        WHERE id = @id
    `);

    return { success: true };
}

module.exports = {
    getBookings,
    createBooking,
    cancelBooking
};