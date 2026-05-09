const express = require('express');
const router = express.Router();
const { sql } = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Statystyki dla administratora
router.get(
    '/',
    authMiddleware,
    roleMiddleware('admin'),

    async (req, res) => {

        try {

            // 1. Wszystkie rezerwacje
            const bookingsCountResult =
                await sql.query(`
                    SELECT COUNT(*) AS total_bookings
                    FROM bookings
                `);

            // 2. Aktywne rezerwacje
            const activeBookingsResult =
                await sql.query(`
                    SELECT COUNT(*) AS active_bookings
                    FROM bookings
                    WHERE status='active'
                    AND start_time <= GETDATE()
                    AND end_time >= GETDATE()
                `);

            // 3. Najbardziej używane sale
            const topRoomsResult =
                await sql.query(`
                    SELECT 
                        r.id,
                        r.name,
                        COUNT(b.id) AS bookings_count
                    FROM rooms r
                    LEFT JOIN bookings b
                        ON r.id = b.room_id
                    GROUP BY r.id, r.name
                    ORDER BY bookings_count DESC
                `);

            // 4. Liczba użytkowników
            const usersResult =
                await sql.query(`
                    SELECT COUNT(*) AS total_users
                    FROM users
                `);

            // 5. Liczba sal
            const roomsResult =
                await sql.query(`
                    SELECT COUNT(*) AS total_rooms
                    FROM rooms
                `);

            res.json({
                total_bookings:
                    bookingsCountResult.recordset[0]
                        .total_bookings,

                active_bookings:
                    activeBookingsResult.recordset[0]
                        .active_bookings,

                total_users:
                    usersResult.recordset[0]
                        .total_users,

                total_rooms:
                    roomsResult.recordset[0]
                        .total_rooms,

                top_rooms:
                    topRoomsResult.recordset
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                error: 'Błąd serwera'
            });
        }
    }
);

module.exports = router;