function validate(schema) {
    return (req, res, next) => {

        const { error } = schema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true
            }
        );

        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                errors: error.details.map(
                    e => e.message
                )
            });
        }

        next();
    };
}

module.exports = validate;