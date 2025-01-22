import { Request, Response, NextFunction } from 'express';
import DoctorService from '../services/doctor.service';
import HttpStatus from 'http-status-codes';

export class DoctorController {
  //register doctor
  public signUp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctor = await DoctorService.signUp(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Doctor registered successfully',
        doctor
      });
    } catch (error) {
      next(error);
    }
  };

  //login doctor
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, refreshToken } = await DoctorService.login(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctor logged in successfully',
        token,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all appointments by specialization with pagination
  public getAllAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const doctor = res.locals.user;
      console.log(doctor)
      if (!doctor) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          code: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access'
        });
      }
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const { appointments, total } = await DoctorService.getAllAppointments(
        doctor.specialization,
        page,
        limit
      );
      // Check if there are no patients
      if (total === 0) {
        return res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: 'No patients have booked an appointment',
          patients: [],
          pagination: { page, limit, total: 0 }
        });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Appointments retrieved successfully',
        appointments,
        pagination: {
          page,
          limit,
          total
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Get total earnings of a doctor
  public async getTotalEarnings(req: Request, res: Response): Promise<void> {
    try {
      const doctorId = req.params.id;
      const totalEarnings = await DoctorService.getTotalEarningsByDoctor(
        doctorId
      );

      res.status(200).json({
        code: 200,
        message: 'Total earnings fetched successfully',
        data: { totalEarnings: `${totalEarnings} rs` }
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        message: 'Failed to fetch total earnings',
        error: error.message
      });
    }
  }

  //get doctor info
  public async getDoctorInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const doctorId = req.params.id;

      if (!doctorId) {
        res.status(HttpStatus.BAD_REQUEST).json({
          code: HttpStatus.BAD_REQUEST,
          message: 'doctor ID is required'
        });
        return;
      }

      const doctorInfo = await DoctorService.getDoctorInfoById(doctorId);

      if (!doctorInfo) {
        res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'doctor not found'
        });
        return;
      }

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Successfully fetched doctor information',
        data: doctorInfo
      });
    } catch (error: any) {
      console.error('Error fetching doctor information:', error.message);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  }

  //update doctor Info
  public updateDoctorInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const doctorId = req.params.id;
      const updates = req.body;

      const updatedDoctor = await DoctorService.updateDoctorInfo(
        doctorId,
        updates
      );

      if (!updatedDoctor) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'doctor not found'
        });
      }

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'doctor information updated successfully',
        data: updatedDoctor
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message
      });
    }
  };

  //get patient by id
  public getPatientById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const patient = await DoctorService.getPatientById(req.params.id);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patient retrieved successfully',
        patient
      });
    } catch (error) {
      next(error);
    }
  };

  //update patient status by id
  public updateAilmentStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await DoctorService.updateAilmentStatus(
        req.params.id,
        req.body.ailment_status
      );
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Ailment status updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  //get all appointments by patient id
  public getAppointmentsByPatientId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const patient_id = req.params.id;
      const data = await DoctorService.AppointmentsByPatientId(patient_id);
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

  //create bill
  public bill = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await DoctorService.generateBill(req.params.id, req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Successfully generated bill',
        data
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message
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
      await DoctorService.forgotPassword(req.body.email);
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
      await DoctorService.resetPassword(req.body, customerId);

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

  //delete patient by id
  public async deletePatientById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await DoctorService.deletePatientById(id);

      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Patient deleted successfully'
      });
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        code: HttpStatus.NOT_FOUND,
        message: error.message || 'Error deleting patient'
      });
    }
  }

  //refresh token by id
  public refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctorId = req.params.id;
      const token = await DoctorService.refreshToken(doctorId);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Access token refreshed successfully',
        token: token
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: error.message
      });
    }
  };
  public getAppointmentsByDoctor = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const doctor_id = req.params.doctorId;
      const data = await DoctorService.getAllAppointmentById(doctor_id);
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
}
