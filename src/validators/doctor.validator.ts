import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

class DoctorValidator {
    
  // Handle validation errors
  public handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: 400,
        message: 'Validation error',
        errors: errors.array(),
      });
    }
    next();
  };

  // Validate signup 
  public validateSignUp = [
    body('doctor_name').isString().withMessage('Doctor name is required'),
    body('specialization').isString().withMessage('Specialization is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    this.handleValidationErrors, // Call handleValidationErrors at the end of validation chain
  ];

  // Validate login 
  public validateLogin = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    this.handleValidationErrors, // Call handleValidationErrors here too
  ];

  // Validate update status 
  public validateUpdateStatus = [
    body('ailment_status').isBoolean().withMessage('Ailment status must be a boolean'),
    this.handleValidationErrors,
  ];

  // Validate forgot password  
  public validateForgotPassword = [
    body('email').isEmail().withMessage('Valid email is required'),
    this.handleValidationErrors, // Call handleValidationErrors here too
  ];

  // Validate reset password 
  public validateResetPassword = [
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    this.handleValidationErrors, // Call handleValidationErrors here too
  ];
}

export default new DoctorValidator();
