const Joi = require('joi');

const createRoomSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required(),

    building_id: Joi.number()
        .integer()
        .positive()
        .required(),

    capacity: Joi.number()
        .integer()
        .min(1)
        .required(),

    type: Joi.string()
    .valid(
        'lecture',
        'seminar',
        'lab',
        'conference',
        'computer'
    )
        .required(),

    description: Joi.string()
        .allow('')
        .max(500),

    max_booking_minutes: Joi.number()
        .integer()
        .min(30)
        .max(1440)
        .required()
});


const updateRoomSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100),

    building_id: Joi.number()
        .integer()
        .positive(),

    capacity: Joi.number()
        .integer()
        .min(1),

     type: Joi.string()
         .valid(
            'lecture',
            'seminar',
            'lab',
            'conference',
            'computer'
    ),

    description: Joi.string()
        .allow('')
        .max(500),

    max_booking_minutes: Joi.number()
        .integer()
        .min(30)
        .max(1440),

    status: Joi.string()
        .valid(
            'free',
            'maintenance'
        )
}).min(1);


module.exports = {
    createRoomSchema,
    updateRoomSchema
};