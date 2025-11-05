import Joi from 'joi';

const validatePostUser = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).required().messages({
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username cannot exceed 30 characters',
            'any.required': 'Username is required'
        }),
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(8).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).required().messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'any.required': 'Password is required'
        }),
        age:  Joi.string().required().pattern(/^[1-9][0-9]?$|^100$/).messages({
          'any.required': 'Age is required'
        }),
        role: Joi.string().valid('ADMIN', 'NORMAL').required().messages({
            'any.only': 'Role must be either ADMIN or NORMAL',
            'any.required': 'Role is required'
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
};

const validatePutUser = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(30).optional(),
        email: Joi.string().email().optional(),
        password: Joi.string().min(8).max(100).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).optional(),
        age:  Joi.string().required().pattern(/^[1-9][0-9]?$|^100$/).optional(),
        role: Joi.string().valid('ADMIN', 'NORMAL').optional()
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
};

export { validatePostUser, validatePutUser };