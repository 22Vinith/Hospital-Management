import express, { IRouter } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import DoctorValidator from '../validators/doctor.validator';  // Corrected import
import { doctorAuth, doctorResetAuth } from '../middlewares/auth.middleware';

class DoctorRoutes {
  private doctorController = new DoctorController();
  private doctorValidator = DoctorValidator;  // Removed "new" since it's default export
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes() {

    //Register for doctor
    this.router.put('/register', this.doctorValidator.validateSignUp, this.doctorController.signUp);

    //Login for doctor
    this.router.post('/login', this.doctorValidator.validateLogin, this.doctorController.login);

    //Get all patients 
    this.router.get('', doctorAuth, this.doctorController.getPatientsBySpecialization);

    //Get patient by id 
    this.router.get('/:id/patient', doctorAuth,this.doctorController.getPatientById);

    //delete the patient by id
    this.router.delete('/:id/delete', doctorAuth, this.doctorController.deletePatientById);

    //Update the ailment status of patient
    this.router.put('/:id/update', doctorAuth, this.doctorValidator.validateUpdateStatus, this.doctorController.updateAilmentStatus);

    // forget password route
    this.router.post('/forgot-password', this.doctorValidator.validateForgotPassword, this.doctorController.forgotPassword);
    
    // Reset Password route
    this.router.post('/reset-password', doctorResetAuth, this.doctorValidator.validateResetPassword, this.doctorController.resetPassword);
        
    //refresh token 
    this.router.get('/:id/refreshtoken', this.doctorController.refreshToken);

  }

  public getRoutes(): IRouter {
    return this.router;
  }
}

export default DoctorRoutes;
