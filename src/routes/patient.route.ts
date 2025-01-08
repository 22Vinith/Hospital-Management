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

    /**
     * @openapi
     * /api/v1/patient/login:
     *   post:
     *     tags:
     *       - Patient
     *     summary: Login patient
     *     description: Allows a patient to login.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: patient1@gmail.com
     *               password:
     *                 type: string
     *                 example: patient123
     *     responses:
     *       200:
     *         description: login successful.
     *       400:
     *         description: Invalid email or password
     */

    // Login route
    this.router.post(
      '/login',
      PatientValidator.validateLogin,
      this.patientController.login
    );

    /**
     * @openapi
     * /api/v1/patient/appointment:
     *   post:
     *     tags:
     *       - Patient
     *     summary: Book appointment for patient
     *     description: Allows a patient to Book appointment.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ailment:
     *                 type: string
     *                 example: I have disease abc
     *               required_specialist:
     *                 type: string
     *                 example: physician
     *     responses:
     *       200:
     *         description: Booked appointment successful.
     *       400:
     *         description: Unable to book appointment
     */

    // Book appointment route
    this.router.post(
      '/appointment',
      patientAuth,
      PatientValidator.validateBookAppointment,
      this.patientController.bookAppointment
    );

    /**
     * @openapi
     * /api/v1/patient/forgot-password:
     *   post:
     *     tags:
     *       - Patient
     *     summary: Forgot password
     *     description: Forgot password.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: patient1@gmail.com
     *     responses:
     *       200:
     *         description: Successfully sent reset token to your registered email .
     *       400:
     *         description: Unable to send Reset token 
     */

    // forget password route
    this.router.post(
      '/forgot-password',
      PatientValidator.validateForgotPassword,
      this.patientController.forgotPassword
    );

    /**
     * @openapi
     * /api/v1/patient/reset-password:
     *   post:
     *     tags:
     *       - Patient
     *     summary: Reset password
     *     description: Reset password.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               newPassword:
     *                 type: string
     *                 example: newpassword
     *     responses:
     *       200:
     *         description: Successfully reset new password .
     *       400:
     *         description: Unable to Reset password 
     */

    // Reset Password route
    this.router.post(
      '/reset-password',
      patientResetAuth,
      PatientValidator.validateResetPassword,
      this.patientController.resetPassword
    );

    /**
     * @openapi
     * /api/v1/patient/{id}/refreshtoken:
     *   get:
     *     tags:
     *       - Patient
     *     summary: Refreshtoken
     *     description: Refreshtoken.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: Refreshtoken.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully created Refreshtoken .
     *       400:
     *         description: Unable to create Refreshtoken
     */

    //refresh token
    this.router.get('/:id/refreshtoken', this.patientController.refreshToken);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
