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
     *               doctor_id:
     *                 type: string
     *                 example: string value
     *               specialization:
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
     * /api/v1/patient/specializations:
     *   get:
     *     tags:
     *       - Patient
     *     summary: get all specialization
     *     description: specializations
     *     responses:
     *       200:
     *         description: successfully fetched all specialization.
     *       400:
     *         description: unable to get specialization.
     */

    //Get all specialization
    this.router.get('/specializations',this.patientController.getSpArray);

    /**
     * @openapi
     * /api/v1/patient/doctors:
     *   post:
     *     tags:
     *       - Patient
     *     summary: get doctors by specialization
     *     description: doctors by specialization
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               specialization:
     *                 type: string
     *                 example: physician
     *     responses:
     *       200:
     *         description: successfully fetched all doctors.
     *       400:
     *         description: unable to get doctors.
     */

    //Get doctors by specialization
    this.router.post(
      '/doctors',
      this.patientController.getDoctorBySpecialization
    );

    /**
     * @openapi
     * /api/v1/patient/{id}/bill:
     *   get:
     *     tags:
     *       - Patient
     *     summary: get bill
     *     description: get bill.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: appointment id.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully fetched bill .
     *       400:
     *         description: Unable to fetch bill
     */

    //get bill
    this.router.get('/:id/bill', this.patientController.getBill);

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

    /**
     * @openapi
     * /api/v1/patient/{id}/patientInfo:
     *   get:
     *     tags:
     *       - Patient
     *     summary: Patient info.
     *     description: patient info.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: patient info.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Successfully fetched patient info. .
     *       400:
     *         description: Unable to fetch patient info.
     */

    //patientInfo by id
    this.router.get('/:id/patientInfo',patientAuth, this.patientController.getPatientInfo);


/**
     * @openapi
     * /api/v1/patient/{id}/updatePatientInfo:
     *   put:
     *     tags:
     *       - Patient
     *     summary: update patient information
     *     description: Allows a patient to update his information by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of the patient to update.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: my new name
     *               age:
     *                 type: integer
     *                 example: my updated age
     *               email:
     *                 type: string
     *                 example: my updated email
     *               phno:
     *                 type: integer
     *                 example: my updated phone number
     *     responses:
     *       200:
     *         description: patient updated.
     *       400:
     *         description: patient Not updated
     */

    //update patientInfo by id
    this.router.put('/:id/updatePatientInfo',patientAuth, this.patientController.updatePatientInfo);

    /**
     * @openapi
     * /api/v1/patient/{id}/appointments:
     *   get:
     *     tags:
     *       - Patient
     *     summary: get appointments by patient id
     *     description: appointments
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of patient.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: successfully fetched all appointments.
     *       400:
     *         description: unable to get appointments.
     */

    //Get appointments by patient id
        this.router.get(
          '/:id/appointments',
          patientAuth,
          this.patientController.getAppointmentsByPatientId
        );
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
