const express = require('express');
const router = express.Router();
const { sql } = require('../db');

const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const asyncHandler = require('../utils/asyncHandler');

const {
    createEquipmentSchema,
    assignEquipmentSchema
} = require('../validators/equipmentValidator');


// GET all equipment
router.get(
    '/',
    asyncHandler(async (req,res)=>{

        const result = await sql.query(`
            SELECT id,name
            FROM equipment
        `);

        res.json(
            result.recordset
        );
    })
);


// CREATE equipment
router.post(
    '/',
    authMiddleware,
    roleMiddleware(
        'admin',
        'manager'
    ),
    validate(
        createEquipmentSchema
    ),

    asyncHandler(async (req,res)=>{

        const { name } = req.body;

        const request =
            new sql.Request();

        request.input(
            'name',
            sql.VarChar,
            name
        );

        await request.query(`
            INSERT INTO equipment (name)
            VALUES (@name)
        `);

        res.status(201).json({
            message:
            'Sprzęt dodany'
        });
    })
);


// DELETE equipment
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(
        'admin',
        'manager'
    ),

    asyncHandler(async (req,res)=>{

        const request =
            new sql.Request();

        request.input(
            'id',
            sql.Int,
            req.params.id
        );

        await request.query(`
            DELETE FROM equipment
            WHERE id=@id
        `);

        res.json({
            message:
            'Sprzęt usunięty'
        });
    })
);


// ASSIGN equipment
router.post(
    '/assign',
    authMiddleware,
    roleMiddleware(
        'admin',
        'manager'
    ),
    validate(
        assignEquipmentSchema
    ),

    asyncHandler(async (req,res)=>{

        const {
            room_id,
            equipment_id
        } = req.body;

        const request =
            new sql.Request();

        request.input(
            'room_id',
            sql.Int,
            room_id
        );

        request.input(
            'equipment_id',
            sql.Int,
            equipment_id
        );

        // FIXED
        const exists =
            await request.query(`
                SELECT TOP 1 room_id
                FROM room_equipment
                WHERE room_id=@room_id
                AND equipment_id=@equipment_id
            `);

        if (
            exists.recordset.length > 0
        ){
            return res.status(400).json({
                message:
                'Sprzęt już przypisany do sali'
            });
        }

        await request.query(`
            INSERT INTO room_equipment (
                room_id,
                equipment_id
            )
            VALUES (
                @room_id,
                @equipment_id
            )
        `);

        res.status(201).json({
            message:
            'Sprzęt przypisany do sali'
        });
    })
);


// UNASSIGN equipment
router.post(
    '/unassign',
    authMiddleware,
    roleMiddleware(
        'admin',
        'manager'
    ),

    asyncHandler(async (req,res)=>{

        const {
            room_id,
            equipment_id
        } = req.body;

        const request =
            new sql.Request();

        request.input(
            'room_id',
            sql.Int,
            room_id
        );

        request.input(
            'equipment_id',
            sql.Int,
            equipment_id
        );

        await request.query(`
            DELETE FROM room_equipment
            WHERE room_id=@room_id
            AND equipment_id=@equipment_id
        `);

        res.json({
            message:
            'Sprzęt został usunięty z sali'
        });
    })
);

module.exports = router;