const Joi = require('joi');

const createEquipmentSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
});

const assignEquipmentSchema = Joi.object({
    room_id: Joi.number()
        .integer()
        .positive()
        .required(),

    equipment_id: Joi.number()
        .integer()
        .positive()
        .required()
});

module.exports = {
    createEquipmentSchema,
    assignEquipmentSchema
};