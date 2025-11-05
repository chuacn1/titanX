import Joi from 'joi';

const validatePostExercise = (req, res, next) => {
    const schema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters',
        'any.required': 'Name is required'
    }),
    muscleGroup:  Joi.string().valid('PUSH', 'PULL', 'LEGS', 'ABS').required().messages({
        'any.only': 'Muscle group must be one of PUSH, PULL, LEGS, ABS',
        'any.required': 'Muscle group is required'
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

const validatePutExercise = (req, res, next) => {
    const schema = Joi.object({
    name: Joi.string().min(3).max(50).optional().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name cannot exceed 50 characters'
    }),
    muscleGroup:  Joi.string().valid('PUSH', 'PULL', 'LEGS', 'ABS').optional().messages({
        'any.only': 'Muscle group must be one of PUSH, PULL, LEGS, ABS'
    })
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
export { validatePostExercise, validatePutExercise };
