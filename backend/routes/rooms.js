const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const {
    createRoomSchema,
    updateRoomSchema
} = require('../validators/roomValidator');

const roomService = require('../services/roomService');


// Dostępność sal
router.get(
    '/availability',
    asyncHandler(async (req, res) => {

        const { room_id, date } = req.query;

        if (!room_id || !date) {
            return res.status(400).json({
                message: 'Brak room_id lub date'
            });
        }

        const result = await roomService.getRoomCalendar(
            room_id,
            date
        );

        res.json(result);
    })
);


// Kalendarz sali
router.get(
    '/calendar',
    asyncHandler(async (req, res) => {

        const { room_id, date } = req.query;

        if (!room_id || !date) {
            return res.status(400).json({
                message: 'Brak room_id lub date'
            });
        }

        const calendar = await roomService.getRoomCalendar(
            room_id,
            date
        );

        res.json({
            room_id,
            date,
            slots: calendar
        });
    })
);


// Lista sal
router.get(
    '/',
    asyncHandler(async (req, res) => {

        const rooms = await roomService.getRooms(
            req.query
        );

        res.json(rooms);
    })
);


// Sprzęt sali
router.get(
    '/:id/equipment',
    asyncHandler(async (req, res) => {

        const equipment =
            await roomService.getRoomEquipment(
                req.params.id
            );

        res.json(equipment);
    })
);


// Sala po ID
router.get(
    '/:id',
    asyncHandler(async (req, res) => {

        const room =
            await roomService.getRoomById(
                req.params.id
            );

        if (!room) {
            return res.status(404).json({
                message: 'Sala nie istnieje'
            });
        }

        res.json(room);
    })
);


// CREATE
router.post(
    '/',
    authMiddleware,
    roleMiddleware('admin', 'manager'),
    validate(createRoomSchema),

    asyncHandler(async (req, res) => {

        await roomService.createRoom(
            req.body
        );

        res.status(201).json({
            message: 'Sala zostala dodana'
        });
    })
);


// UPDATE
router.patch(
    '/:id',
    authMiddleware,
    roleMiddleware('admin','manager'),
    validate(updateRoomSchema),

    asyncHandler(async (req,res)=>{

        await roomService.updateRoom(
            req.params.id,
            req.body
        );

        res.json({
            message:'Sala zostala zaktualizowana'
        });
    })
);


// DELETE
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware('admin','manager'),

    asyncHandler(async (req,res)=>{

        await roomService.deleteRoom(
            req.params.id
        );

        res.json({
            message:'Sala zostala usunieta'
        });
    })
);

module.exports = router;