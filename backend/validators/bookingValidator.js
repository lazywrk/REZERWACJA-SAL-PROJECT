const Joi = require('joi');

const createBookingSchema = Joi.object({
    room_id: Joi.number()
        .integer()
        .positive()
        .required(),

    start_time: Joi.date()
        .iso()
        .required(),

    end_time: Joi.date()
        .iso()
        .required()
});

module.exports = {
    createBookingSchema
};