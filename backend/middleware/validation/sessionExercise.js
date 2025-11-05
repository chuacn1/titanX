import Joi from 'joi';

const validatePostsessionExercise = (req, res, next) => {
    const schema = Joi.object({
        sets: Joi.number().min(1).required().messages({
            'number.base': 'Sets must be a number',
            'number.min': 'Sets must be at least 1',
            'any.required': 'Sets is required'
        }),
        reps: Joi.number().min(1).required().messages({
            'number.base': 'Reps must be a number',
            'number.min': 'Reps must be at least 1',
            'any.required': 'Reps is required'
        }),
        weight: Joi.number().min(0).required().messages({
            'number.base': 'Weight must be a number',
            'number.min': 'Weight cannot be negative',
            'any.required': 'Weight is required'
        }),
        sessionID: Joi.number().integer().positive().required().messages({
            'number.base': 'Session ID must be a number',
            'number.integer': 'Session ID must be an integer',
            'number.positive': 'Session ID must be a positive number',
            'any.required': 'Session ID is required'
        }),
        exerciseID: Joi.number().integer().positive().required().messages({
            'number.base': 'Exercise ID must be a number',
            'number.integer': 'Exercise ID must be an integer',
            'number.positive': 'Exercise ID must be a positive number',
            'any.required': 'Exercise ID is required'
        })
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const formattedErrors = error.details.map(({ message, type }) => ({
            message,
            type,
        }));
        return res.status(400).json({ errors: formattedErrors }); // Use 400 for validation errors
    }
    next();
}

const validatePutsessionExercise = (req, res, next) => {
    const schema = Joi.object({
        sets: Joi.number().min(1).optional().messages({
            'number.base': 'Sets must be a number',
            'number.min': 'Sets must be at least 1'
        }),
        reps: Joi.number().min(1).optional().messages({
            'number.base': 'Reps must be a number',
            'number.min': 'Reps must be at least 1'
        }),
        weight: Joi.number().min(0).optional().messages({
            'number.base': 'Weight must be a number',
            'number.min': 'Weight cannot be negative'
        }),
        sessionID: Joi.number().integer().positive().optional().messages({
            'number.base': 'Session ID must be a number',
            'number.integer': 'Session ID must be an integer',
            'number.positive': 'Session ID must be a positive number'
        }),
        exerciseID: Joi.number().integer().positive().optional().messages({
            'number.base': 'Exercise ID must be a number',
            'number.integer': 'Exercise ID must be an integer',
            'number.positive': 'Exercise ID must be a positive number'
        }),
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    });

    const { error } = schema.validate(req.body);

    if (error) {
        const formattedErrors = error.details.map(({ message, type }) => ({
            message,
            type,
        }));
        return res.status(400).json({ errors: formattedErrors }); // Use 400 for validation errors
    }
    next();
}

export { validatePostsessionExercise, validatePutsessionExercise };