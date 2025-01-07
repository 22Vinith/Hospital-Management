import express, { IRouter } from 'express';
import { PatientValidator } from '../validators/patient.validator';
import { PatientController } from '../controllers/patient.controller';
import { patientAuth, patientResetAuth } from '../middlewares/auth.middleware';

class UserRoutes {
  private patientController = new PatientController();
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes = () => {
    /**
     * @openapi
     * /api/v1/patient/register:
     *   post:
     *     tags:
     *       - Patient
     *     summary: register patient
     *     description: Allows a patient to register.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: patient1
     *               age:
     *                 type: number
     *                 example: 23
     *               email:
     *                 type: string
     *                 example: patient1@gmail.com
     *               phno:
     *                 type: number
     *                 example: 9876543210
     *               password:
     *                 type: string
     *                 example: patient123
     *     responses:
     *       200:
     *         description: Signup successful.
     *       400:
     *         description: Email already registered.
     */
    this.router.post(
      '/register',
      PatientValidator.validateSignup,
      this.patientController.signup
    );

    // Login route
    this.router.post(
      '/login',
      PatientValidator.validateLogin,
      this.patientController.login
    );

    // Book appointment route
    this.router.post(
      '/appointment',
      patientAuth,
      PatientValidator.validateBookAppointment,
      this.patientController.bookAppointment
    );

    // forget password route
    this.router.post(
      '/forgot-password',
      PatientValidator.validateForgotPassword,
      this.patientController.forgotPassword
    );

    // Reset Password route
    this.router.post(
      '/reset-password',
      patientResetAuth,
      PatientValidator.validateResetPassword,
      this.patientController.resetPassword
    );

    //refresh token
    this.router.get('/:id/refreshtoken', this.patientController.refreshToken);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
