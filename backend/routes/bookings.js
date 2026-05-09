const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const {
    createBookingSchema
} = require('../validators/bookingValidator');

const {
    getBookings,
    createBooking,
    cancelBooking
} = require('../services/bookingService');


// GET bookings
router.get(
    '/',
    authMiddleware,
    asyncHandler(async (req, res) => {

        const data = await getBookings(req.user);

        res.json(data);
    })
);


// CREATE booking
router.post(
    '/',
    authMiddleware,
    validate(createBookingSchema),
    asyncHandler(async (req, res) => {

        const result = await createBooking(
            req.user,
            req.body
        );

        if (result?.error) {
            return res.status(400).json({
                error: result.error
            });
        }

        res.status(201).json({
            message: 'Rezerwacja utworzona',
            success: true
        });
    })
);


// CANCEL booking
router.patch(
    '/:id/cancel',
    authMiddleware,
    asyncHandler(async (req, res) => {

        const result = await cancelBooking(
            req.user,
            req.params.id
        );

        if (result?.error) {
            return res.status(400).json({
                error: result.error
            });
        }

        res.json({
            message: 'Rezerwacja anulowana',
            success: true
        });
    })
);

module.exports = router;