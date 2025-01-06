import express, { IRouter } from 'express';
import { PatientValidator } from '../validators/patient.validator';
import {PatientController} from '../controllers/patient.controller';
import { patientAuth, patientResetAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private patientController = new PatientController();
  private router = express.Router();
 

  constructor() {
    this.routes();
  }

  private routes = () => {

  // Signup route
  this.router.post('/register', PatientValidator.validateSignup, this.patientController.signup);

  // Login route
  this.router.post('/login', PatientValidator.validateLogin, this.patientController.login);

    // Book appointment route
   this.router.post('/appointment', patientAuth, PatientValidator.validateBookAppointment, this.patientController.bookAppointment);

   // forget password route
   this.router.post('/forgot-password', PatientValidator.validateForgotPassword, this.patientController.forgotPassword);
       
   // Reset Password route
   this.router.post('/reset-password', patientResetAuth, PatientValidator.validateResetPassword, this.patientController.resetPassword);
         
   //refresh token
   this.router.get('/:id/refreshtoken',this.patientController.refreshToken );

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
