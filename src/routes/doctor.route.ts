import express, { IRouter } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import DoctorValidator from '../validators/doctor.validator'; // Corrected import
import { adminAuth, doctorAuth, doctorResetAuth } from '../middlewares/auth.middleware';

class DoctorRoutes {
  private doctorController = new DoctorController();
  private doctorValidator = DoctorValidator; // Removed "new" since it's default export
  private router = express.Router();

  constructor() {
    this.routes();
  }

  private routes() {
    /**
     * @openapi
     * /api/v1/doctor/register:
     *   put:
     *     tags:
     *       - Doctor
     *     summary: register doctor
     *     description: Allows a doctor to register.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               doctor_name:
     *                 type: string
     *                 example: doctor1
     *               specialization:
     *                 type: string
     *                 example: physician
     *               email:
     *                 type: string
     *                 example: doctor1@gmail.com
     *               password:
     *                 type: string
     *                 example: doctor123
     *     responses:
     *       200:
     *         description: Signup successful.
     *       400:
     *         description: Email already registered.
     */

    //Register for doctor
    this.router.put(
      '/register',
      this.doctorValidator.validateSignUp,
      this.doctorController.signUp
    );

    /**
     * @openapi
     * /api/v1/doctor/login:
     *   post:
     *     tags:
     *       - Doctor
     *     summary: login doctor
     *     description: Allows a doctor to login.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: doctor1@gmail.com
     *               password:
     *                 type: string
     *                 example: doctor123
     *     responses:
     *       200:
     *         description: login successful.
     *       400:
     *         description: Email or password invallid.
     */

    //Login for doctor
    this.router.post(
      '/login',
      this.doctorValidator.validateLogin,
      this.doctorController.login
    );

    /**
     * @openapi
     * /api/v1/doctor:
     *   get:
     *     tags:
     *       - Doctor
     *     summary: get all appointments based on specialization
     *     description: get all appointments list.
     *     responses:
     *       200:
     *         description: successfully got appointments list.
     *       400:
     *         description: unable to get appointments list.
     */

    //Get all Appointments
    this.router.get(
      '',
      doctorAuth,
      this.doctorController.getAllAppointments
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/patient:
     *   get:
     *     tags:
     *       - Doctor
     *     summary: get patient by id
     *     description: patient by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of patient.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: successfully got patient by id.
     *       400:
     *         description: unable to get patient.
     */

    //Get patient by id
    this.router.get(
      '/:id/patient',
      doctorAuth,
      this.doctorController.getPatientById
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/appointments:
     *   get:
     *     tags:
     *       - Doctor
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
      doctorAuth,
      this.doctorController.getAppointmentsByPatientId
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/delete:
     *   delete:
     *     tags:
     *       - Doctor
     *     summary: delete patient
     *     description: delete patient
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: Delete patient by id
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: successfully deleted patient
     *       400:
     *         description: unable to delete patient
     */

    //delete the patient by id
    this.router.delete(
      '/:id/delete',
      doctorAuth,
      this.doctorController.deletePatientById
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/update:
     *   put:
     *     tags:
     *       - Doctor
     *     summary: Update the ailment status of patient
     *     description: Update the ailment status of patient
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: Update the ailment status of patient
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               ailment_status:
     *                 type: boolean
     *                 example: true or false
     *     responses:
     *       200:
     *         description: successfully updated patient
     *       400:
     *         description: unable to update patient
     */

    //Update the ailment status of patient
    this.router.put(
      '/:id/update',
      doctorAuth,
      this.doctorValidator.validateUpdateStatus,
      this.doctorController.updateAilmentStatus
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/bill:
     *   post:
     *     tags:
     *       - Doctor
     *     summary: create bill using appointment id
     *     description: bill
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of appointment.
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               prescription:
     *                 type: string
     *                 example: take ibrhel powder
     *               invoice:
     *                 type: string
     *                 example: 200rs
     *     responses:
     *       200:
     *         description: successfully created bill.
     *       400:
     *         description: unable to create bill.
     */

    //create bill using appointment id
    this.router.post('/:id/bill', doctorAuth, this.doctorController.bill);

    /**
     * @openapi
     * /api/v1/doctor/forgot-password:
     *   post:
     *     tags:
     *       - Doctor
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
     *                 example: doctor1@gmail.com
     *     responses:
     *       200:
     *         description: Successfully sent reset token to your registered email .
     *       400:
     *         description: Unable to send Reset token
     */

    // forget password route
    this.router.post(
      '/forgot-password',
      this.doctorValidator.validateForgotPassword,
      this.doctorController.forgotPassword
    );

    /**
     * @openapi
     * /api/v1/doctor/reset-password:
     *   post:
     *     tags:
     *       - Doctor
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
      doctorResetAuth,
      this.doctorValidator.validateResetPassword,
      this.doctorController.resetPassword
    );

    /**
     * @openapi
     * /api/v1/doctor/{id}/refreshtoken:
     *   get:
     *     tags:
     *       - Doctor
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
    this.router.get('/:id/refreshtoken', this.doctorController.refreshToken);

        /**
         * @openapi
         * /api/v1/doctor/{id}/doctorInfo:
         *   get:
         *     tags:
         *       - Doctor
         *     summary: doctor info.
         *     description: doctor info.
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: doctor info.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Successfully fetched doctor info. .
         *       400:
         *         description: Unable to fetch doctor info.
         */
    
        //doctorInfo by id
        this.router.get('/:id/doctorInfo',doctorAuth, this.doctorController.getDoctorInfo);

        /**
             * @openapi
             * /api/v1/doctor/{id}/updateDoctorInfo:
             *   put:
             *     tags:
             *       - Doctor
             *     summary: update doctor information
             *     description: Allows a doctor to update his information by id.
             *     parameters:
             *       - name: id
             *         in: path
             *         required: true
             *         description: The ID of the doctor to update.
             *         schema:
             *           type: string
             *     requestBody:
             *       required: true
             *       content:
             *         application/json:
             *           schema:
             *             type: object
             *             properties:
             *               doctor_name:
             *                 type: string
             *                 example: my new name

   
             *     responses:
             *       200:
             *         description: doctor updated.
             *       400:
             *         description: doctor Not updated
             */
        
            //update doctorinfo by id
            this.router.put('/:id/updateDoctorInfo',doctorAuth, this.doctorController.updateDoctorInfo);

                    /**
         * @openapi
         * /api/v1/doctor/{id}/total-earnings:
         *   get:
         *     tags:
         *       - Doctor
         *     summary: doctor earning.
         *     description: doctor earning.
         *     parameters:
         *       - name: id
         *         in: path
         *         required: true
         *         description: doctor id.
         *         schema:
         *           type: string
         *     responses:
         *       200:
         *         description: Successfully fetched total earned money.
         *       400:
         *         description: Unable to fetch totalAmount.
         */

            this.router.get('/:id/total-earnings', doctorAuth, this.doctorController.getTotalEarnings);
        
            this.router.get('/get-appointment/:doctorId/admin',adminAuth,this.doctorController.getAppointmentsByDoctor)
  }

  public getRoutes(): IRouter {
    return this.router;
  }
}

export default DoctorRoutes;
