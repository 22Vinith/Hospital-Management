import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';

// Joi schema for admin signup
const signupSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Joi schema for admin login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Valid email is required',
    'string.empty': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Joi schema for forgot password (email)
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address to reset password',
    'any.required': 'Email is required'
  }),
});

// Joi schema for reset password (new password)
const resetPasswordSchema = Joi.object({
  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'New password must be at least 6 characters long',
    'any.required': 'New password is required'
  }),
});

// Middleware for validation
const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        message: error.details[0].message,
      });
    }
    next();
  };
};

// Export validation middlewares for admin
export const AdminValidator = {
  validateSignup: validateRequest(signupSchema),
  validateLogin: validateRequest(loginSchema),
  validateForgotPassword: validateRequest(forgotPasswordSchema),
  validateResetPassword: validateRequest(resetPasswordSchema)
};
