const express = require('express');
const router = express.Router();
const axios = require('axios');

const { sql } = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// PDF export
router.get(
    '/bookings/pdf',
    authMiddleware,
    roleMiddleware('admin'),

    async (req, res) => {

        try {

      

            const result = await sql.query(`
                SELECT
                    b.id,
                    u.email AS user_email,
                    r.name AS room_name,
                    b.start_time,
                    b.end_time,
                    b.status
                FROM bookings b
                JOIN users u ON b.user_id = u.id
                JOIN rooms r ON b.room_id = r.id
                ORDER BY b.start_time DESC
            `);

         

            const response = await axios.post(
                'http://localhost:5001/export/pdf',

                {
                    bookings: result.recordset
                },

                {
                    responseType: 'arraybuffer'
                }
            );

       

            res.setHeader(
                'Content-Type',
                'application/pdf'
            );

            res.setHeader(
                'Content-Disposition',
                'attachment; filename=bookings.pdf'
            );

            res.send(response.data);

        } catch (err) {

            console.log(err);

            res.status(500).json({
                error: 'Błąd eksportu PDF'
            });
        }
    }
);

module.exports = router;