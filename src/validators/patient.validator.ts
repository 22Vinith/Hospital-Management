import { Request, Response, NextFunction } from 'express';
import Joi from '@hapi/joi';

export class PatientValidator {
  public validatePatient = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
      }),
      age: Joi.number().min(0).max(120).required().messages({
        'number.base': 'Age must be a number',
        'number.min': 'Age must be at least 0',
        'number.max': 'Age must not exceed 120',
        'any.required': 'Age is required',
      }),
      email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email',
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
      }),
      phno: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
          'string.pattern.base': 'Phone number must be a 10-digit number',
          'string.empty': 'Phone number is required',
          'any.required': 'Phone number is required',
        }),
      ailment: Joi.string().required().messages({
        'string.empty': 'Ailment description is required',
        'any.required': 'Ailment description is required',
      }),
      required_specialist: Joi.string().required().messages({
        'string.empty': 'Required specialist is required',
        'any.required': 'Required specialist is required',
      }),
      ailment_status: Joi.boolean().messages({
        'boolean.base': 'Ailment status must be true or false',
      }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      res.status(400).json({
        code: 400,
        message: 'Validation error',
        errors,
      });
    } else {
      next();
    }
  };
}
