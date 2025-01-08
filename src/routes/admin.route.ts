import express, { IRouter } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AdminValidator } from '../validators/admin.validator';
import { adminAuth, adminResetAuth} from '../middlewares/auth.middleware';
import { roleAuth } from '../middlewares/role.middleware';


class UserRoutes {
  
  private router = express.Router();
  private adminController = new AdminController();

  constructor() {
    this.routes();
  }

  private routes = () => {

    /**
     * @openapi
     * /api/v1/admin/register:
     *   post:
     *     tags:
     *       - Admin
     *     summary: register admin
     *     description: Allows a admin to register.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 example: admin1
     *               email:
     *                 type: string
     *                 example: admin1@gmail.com
     *               password:
     *                 type: string
     *                 example: admin123
     *     responses:
     *       200:
     *         description: Signup successful.
     *       400:
     *         description: Email already registered.
     */

    // Admin Registration
   this.router.post('/register', AdminValidator.validateSignup, this.adminController.registerAdmin);

       /**
     * @openapi
     * /api/v1/admin/login:
     *   post:
     *     tags:
     *       - Admin
     *     summary: Login admin
     *     description: Allows a admin to login.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: admin1@gmail.com
     *               password:
     *                 type: string
     *                 example: admin123
     *     responses:
     *       200:
     *         description: login successful.
     *       400:
     *         description: Email or password invallid.
     */

    // Admin Login
   this.router.post('/login', AdminValidator.validateLogin, this.adminController.loginAdmin);

    /**
     * @openapi
     * /api/v1/admin/forgot-password:
     *   post:
     *     tags:
     *       - Admin
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
     *                 example: admin1@gmail.com
     *     responses:
     *       200:
     *         description: Successfully sent reset token to your registered email .
     *       400:
     *         description: Unable to send Reset token 
     */

   // forget password route
   this.router.post('/forgot-password', AdminValidator.validateForgotPassword, this.adminController.forgotPassword);

           /**
     * @openapi
     * /api/v1/admin/reset-password:
     *   post:
     *     tags:
     *       - Admin
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
   this.router.post('/reset-password', adminResetAuth, AdminValidator.validateResetPassword, this.adminController.resetPassword);

       /**
     * @openapi
     * /api/v1/admin/{id}/refreshtoken:
     *   get:
     *     tags:
     *       - Admin
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
   this.router.get('/:id/refreshtoken',this.adminController.refreshToken );

    /**
     * @openapi
     * /api/v1/admin/add:
     *   post:
     *     tags:
     *       - Admin
     *     summary: Add doctor by admin
     *     description: Add doctor by admin.
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
     *         description: Successfully added doctor.
     *       400:
     *         description: Unable to add doctor
     */

   //add doctor 
   this.router.post('/add', adminAuth, roleAuth(['admin']), this.adminController.addDoctor);

    /**
     * @openapi
     * /api/v1/admin:
     *   get:
     *     tags:
     *       - Admin
     *     summary: get all doctors
     *     description: get all doctors list.
     *     responses:
     *       200:
     *         description: successfully got doctors list.
     *       400:
     *         description: unable to get doctors list.
     */

   // get all doctors
   this.router.get('', adminAuth, roleAuth(['admin']), this.adminController.getAllDoctors);

       /**
     * @openapi
     * /api/v1/admin/{id}/doctor:
     *   get:
     *     tags:
     *       - Admin
     *     summary: get doctor by id
     *     description: doctor by id.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: The ID of doctor.
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: successfully got doctor by id.
     *       400:
     *         description: unable to get doctor.
     */

   //get doctor by id
   this.router.get('/:id/doctor', adminAuth, roleAuth(['admin']), this.adminController.getDoctorById);

       /**
     * @openapi
     * /api/v1/admin/{id}/delete:
     *   delete:
     *     tags:
     *       - Admin
     *     summary: delete doctor
     *     description: delete doctor
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: Delete doctor by id
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: successfully deleted doctor
     *       400:
     *         description: unable to delete doctor
     */

   //delete doctor by id
   this.router.delete('/:id/delete', adminAuth, roleAuth(['admin']), this.adminController.deleteDoctor);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
