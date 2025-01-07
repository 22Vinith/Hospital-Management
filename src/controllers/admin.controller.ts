import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import HttpStatus from 'http-status-codes';

export class AdminController {

  // Admin registration
  public registerAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { name, email, password } = req.body;
      const result = await AdminService.registerAdmin(name, email, password);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: 'Admin registered successfully',
        result
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error during registration',
        error: error.message,
      });
    }
  };

// Admin login
public loginAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, refreshToken } = await AdminService.login(req.body);
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Admin logged in successfully',
        token,
        refreshToken,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all doctors
  public getAllDoctors = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const doctors = await AdminService.getAllDoctors();
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctors retrieved successfully',
        doctors
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching doctors',
        error: error.message,
      });
    }
  };

  // Get doctor by ID
  public getDoctorById = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const doctor = await AdminService.getDoctorById(req.params.id);
      if (!doctor) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Doctor not found',
        });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctor retrieved successfully',
        doctor
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error fetching doctor',
        error: error.message,
      });
    }
  };

    // Add doctor
    public addDoctor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        await AdminService.addDoctor(req.body);
        res.status(HttpStatus.OK).json({
          code: HttpStatus.OK,
          message: 'Doctor added successfully',
        });
      } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Cannot create doctor',
          error: error.message,
        });
      }
    };


  // Delete doctor
  public deleteDoctor = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const result = await AdminService.deleteDoctor(req.params.id);
      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          code: HttpStatus.NOT_FOUND,
          message: 'Doctor not found',
        });
      }
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        message: 'Doctor deleted successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error deleting doctor',
        error: error.message,
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
              await AdminService.forgotPassword(req.body.email);
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
          await AdminService.resetPassword(req.body, customerId);
    
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
    
      //refresh token
      public refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
          const patientId = req.params.id; 
          const newAccessToken = await AdminService.refreshToken(patientId);
    
          res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Access token refreshed successfully',
            token: newAccessToken,
          });
        } catch (error) {
          res.status(HttpStatus.UNAUTHORIZED).json({
            code: HttpStatus.UNAUTHORIZED,
            message: error.message,
          });
        }
      };
}
