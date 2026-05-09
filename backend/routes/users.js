const express = require('express');
const router = express.Router();
const { sql } = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const asyncHandler = require('../utils/asyncHandler');


// Pobieranie listy użytkowników (ADMIN)
router.get(
    '/',
    authMiddleware,
    roleMiddleware('admin'),

    asyncHandler(async (req, res) => {

        const result = await sql.query(`
            SELECT
                id,
                email,
                role
            FROM users
            ORDER BY id DESC
        `);

        res.json(
            result.recordset
        );
    })
);


// Usuwanie użytkownika (ADMIN)
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin'),

    asyncHandler(async (req, res) => {

        const transaction =
            new sql.Transaction();

        await transaction.begin();

        try {

            const request =
                new sql.Request(
                    transaction
                );

            request.input(
                'id',
                sql.Int,
                req.params.id
            );

            // delete bookings
            await request.query(`
                DELETE FROM bookings
                WHERE user_id=@id
            `);

            // delete user
            await request.query(`
                DELETE FROM users
                WHERE id=@id
            `);

            await transaction.commit();

            res.json({
                message:
                    'Użytkownik usunięty'
            });

        } catch (err) {

            await transaction.rollback();

            throw err;
        }
    })
);

module.exports = router;