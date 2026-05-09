const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sql } = require('../db');

const validate =
require('../middleware/validateMiddleware');

const asyncHandler =
require('../utils/asyncHandler');

const {
    registerSchema,
    loginSchema
} = require('../validators/authValidator');



// REGISTER
router.post(
    '/register',
    validate(registerSchema),

    asyncHandler(async (req,res)=>{

        const {
            email,
            password
        } = req.body;


        const checkRequest =
            new sql.Request();

        checkRequest.input(
            'email',
            sql.VarChar,
            email
        );

        const existing =
            await checkRequest.query(`
                SELECT id
                FROM users
                WHERE email=@email
            `);


        if(
            existing.recordset.length > 0
        ){
            return res.status(400).json({
                message:
                'Użytkownik już istnieje'
            });
        }


        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );


        const insertRequest =
            new sql.Request();

        insertRequest.input(
            'email',
            sql.VarChar,
            email
        );

        insertRequest.input(
            'password',
            sql.VarChar,
            hashedPassword
        );


        await insertRequest.query(`
            INSERT INTO users (
                email,
                password,
                role
            )
            VALUES (
                @email,
                @password,
                'user'
            )
        `);


        res.status(201).json({
            message:
            'Konto utworzone'
        });

    })
);



// LOGIN
router.post(
    '/login',
    validate(loginSchema),

    asyncHandler(async(req,res)=>{

        const {
            email,
            password
        } = req.body;


        const request =
            new sql.Request();

        request.input(
            'email',
            sql.VarChar,
            email
        );


        const result =
            await request.query(`
                SELECT
                    id,
                    email,
                    password,
                    role
                FROM users
                WHERE email=@email
            `);


        const user =
            result.recordset[0];


        if(!user){
            return res.status(400).json({
                message:
                'Nieprawidłowy login lub hasło'
            });
        }


        const valid =
            await bcrypt.compare(
                password,
                user.password
            );


        if(!valid){
            return res.status(400).json({
                message:
                'Nieprawidłowy login lub hasło'
            });
        }


        const token = jwt.sign(
            {
                id:user.id,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn:'7d'
            }
        );


        res.json({
            message:'Zalogowano',
            token
        });

    })
);


module.exports = router;