import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { Model } from 'mongoose'; // Import Model to fetch from any collection
import doctorModel from '../models/doctor.model';
import patientModel from '../models/patient.model';
import { AdminModel } from '../models/admin.model';

export const auth = (secretKey: string, model: Model<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      let bearerToken = req.header('Authorization');
      if (!bearerToken) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: 'Authorization token is required'
        });
      }
      bearerToken = bearerToken.split(' ')[1];
      const decoded: any = jwt.verify(bearerToken, secretKey);

      if (!decoded || !decoded.id) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Invalid or expired token'
        });
      }
      const user = await model.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: 'User not found'
        });
      }

      // Storing the full user object in res.locals.user
      res.locals.user = user;
      next();
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Authentication failed. Please log in again.'
      });
    }
  };
};

export const doctorAuth = auth(process.env.JWT_DOCTOR, doctorModel);

export const patientAuth = auth(process.env.JWT_PATIENT, patientModel);

export const doctorResetAuth = auth(process.env.JWT_RESET_DOCTOR, doctorModel);

export const patientResetAuth = auth(
  process.env.JWT_RESET_PATIENT,
  patientModel
);

export const adminAuth = auth(process.env.JWT_ADMIN, AdminModel);

export const adminResetAuth = auth(process.env.JWT_RESET_ADMIN, AdminModel);
