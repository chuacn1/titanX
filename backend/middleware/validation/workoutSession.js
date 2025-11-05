import Joi from 'joi';

const validatePostWorkoutSession = (req, res, next) => {
    const schema = Joi.object({
        notes: Joi.string().max(500).allow(null).optional().messages({
            'string.max': 'Note cannot exceed 500 characters'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const formattedErrors = error.details.map(({ message, type }) => ({
            message,
            type,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
};

const validatePutWorkoutSession = (req, res, next) => {
    const schema = Joi.object({
        notes: Joi.string().max(500).allow(null).optional().messages({
            'string.max': 'Note cannot exceed 500 characters'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const formattedErrors = error.details.map(({ message, type }) => ({
            message,
            type,
        }));
        return res.status(400).json({ errors: formattedErrors });
    }
    next();
}

export {
    validatePostWorkoutSession,
    validatePutWorkoutSession
};