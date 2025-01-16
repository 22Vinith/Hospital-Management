import { Request, Response, NextFunction } from 'express';
import PatientService from '../services/patient.service';
import HttpStatus from 'http-status-codes';
import { log } from 'winston';

export class PatientController {
  //Signup for patient controller
  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PatientService.signup(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Patient signed up successfully',
        data: result
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message || 'Signup failed'
      });
      next(error);
    }
  }

  // Login for patient
  public async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, refreshToken } = await PatientService.login(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Login successful',
        token,
        refreshToken
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message || 'Invalid email or password'
      });
      next(error);
    }
  }

  //get all appointments by patient id
  public getAppointmentsByPatientId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const patient_id = req.params.id;
      const data = await PatientService.AppointmentsByPatientId(patient_id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Successfully fetched all appointments',
        data
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  };

  // Book appointment for patient controller
  public async bookAppointment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const patient_id = res.locals.user.id;
      const appointmentData = { ...req.body, patient_id };
      const result = await PatientService.bookAppointment(appointmentData);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Appointment booked successfully',
        data: result
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message || 'Failed to book appointment'
      });
      next(error);
    }
  }

  // Get specialization array
  public getSpArray = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const spArray = await PatientService.getSpArray();
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'specializations retrieved successfully',
        spArray
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching specializations',
        error: error.message
      });
    }
  };

  // Get doctor by specialization
  public getDoctorBySpecialization = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const doctors = await PatientService.DoctorBySpecialization(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctors retrieved successfully',
        doctors
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching doctor',
        error: error.message
      });
    }
  };

  // Get doctor by specialization
  public getBill = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const bill = await PatientService.getBill(req.params.id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'bill retrieved successfully',
        bill
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching bill',
        error: error.message
      });
    }
  };

  // forget password
  public forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      await PatientService.forgotPassword(req.body.email);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Reset password token sent to registered email id'
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: 'User not found'
      });
    }
  };

  //Reset Password
  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const customerId = res.locals.user._id;
      await PatientService.resetPassword(req.body, customerId);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Password reset successfully'
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).send({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message
      });
    }
  };

  //update patient Info
  public updatePatientInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const patientId = req.params.id;
      const updates = req.body;

      const updatedPatient = await PatientService.updatePatientInfo(
        patientId,
        updates
      );

      if (!updatedPatient) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Patient not found'
        });
      }

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patient information updated successfully',
        data: updatedPatient
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  };

  //get patient info
  public async getPatientInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const patientId = req.params.id;

      if (!patientId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: 'Patient ID is required'
        });
        return;
      }

      const patientInfo = await PatientService.getPatientInfoById(patientId);

      if (!patientInfo) {
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Patient not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Successfully fetched patient information',
        data: patientInfo
      });
    } catch (error: any) {
      console.error('Error fetching patient information:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  }

  //refresh token
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const patientId = req.params.id;
      const newAccessToken = await PatientService.refreshToken(patientId);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Access token refreshed successfully',
        token: newAccessToken
      });
    } catch (error) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        code: HttpStatus.UNAUTHORIZED,
        message: error.message
      });
    }
  };
}

export default new PatientController();
