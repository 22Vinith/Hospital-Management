// controllers/doctor.controller.ts
import { Request, Response, NextFunction } from 'express';
import DoctorService from '../services/doctor.service';
import HttpStatus from 'http-status-codes';

export class DoctorController {

    //register doctor
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctor = await DoctorService.signUp(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Doctor registered successfully',
        doctor,
      });
    } catch (error) {
      next(error);
    }
  };

  //login doctor
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, refreshToken } = await DoctorService.login(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctor logged in successfully',
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  //get all patients by specialization
  public getPatientsBySpecialization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const doctor = res.locals.user;
      if (!doctor) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
        });
      }
      const patients = await DoctorService.getPatientsBySpecialization(doctor.specialization);
      // Check if there are no patients
      if (patients.length === 0) {
        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: 'No patients have booked an appointment',
          patients: [],
        });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patients retrieved successfully',
        patients,
      });
    } catch (error) {
      next(error);
    }
  };
  
  //get patient by id
  public getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const patient = await DoctorService.getPatientById(req.params.id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patient retrieved successfully',
        patient,
      });
    } catch (error) {
      next(error);
    }
  };

  //update patient status by id
  public updateAilmentStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await DoctorService.updateAilmentStatus(req.params.id, req.body.ailment_status);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Ailment status updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

    // forget password 
    public forgotPassword = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<any> => {
        try {
          await DoctorService.forgotPassword(req.body.email);
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: "Reset password token sent to registered email id"
          });
        } catch (error) {
          res.status(HttpStatus.NOT_FOUND).json({
            code: HttpStatus.NOT_FOUND,
            message: 'User not found'
          });
        }
      };

        //Reset Password
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const customerId = res.locals.user._id;
      await DoctorService.resetPassword(req.body, customerId);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Password reset successfully',
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message : error.message
      });
    }
  };

//delete patient by id
public async deletePatientById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await DoctorService.deletePatientById(id);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patient deleted successfully',
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: error.message || 'Error deleting patient',
      });
    }
}

//refresh token by id
  public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doctorId = req.params.id;  // Extract doctor id from URL params
      const token = await DoctorService.refreshToken(doctorId); // Call service to refresh token
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Access token refreshed successfully',
        token: token,
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message,
      });
    }
  };
}
