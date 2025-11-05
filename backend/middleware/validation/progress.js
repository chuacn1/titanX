import Joi from 'joi';

const validatePostProgress = (req, res, next) => {
    const schema = Joi.object({
        totalVolume: Joi.number().min(0).optional().messages({
            'number.base': 'Total volume must be a number',
            'number.min': 'Total volume cannot be negative'
        })
        // Remove .required() since it's calculated automatically
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

const validatePutProgress = (req, res, next) => {
    const schema = Joi.object({
        totalVolume: Joi.number().min(0).optional().messages({
            'number.base': 'Total volume must be a number',
            'number.min': 'Total volume cannot be negative'
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

export { validatePostProgress, validatePutProgress };