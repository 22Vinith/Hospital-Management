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

    // Admin Registration
   this.router.post('/register', AdminValidator.validateSignup, this.adminController.registerAdmin);

    // Admin Login
   this.router.post('/login', AdminValidator.validateLogin, this.adminController.loginAdmin);

   // forget password route
   this.router.post('/forgot-password', AdminValidator.validateForgotPassword, this.adminController.forgotPassword);
       
   // Reset Password route
   this.router.post('/reset-password', adminResetAuth, AdminValidator.validateResetPassword, this.adminController.resetPassword);
         
   //refresh token
   this.router.get('/:id/refreshtoken',this.adminController.refreshToken );

   // get all doctors
   this.router.get('/doctors', adminAuth, roleAuth(['admin']), this.adminController.getAllDoctors);

   //get doctor by id
   this.router.get('/:id/doctor', adminAuth, roleAuth(['admin']), this.adminController.getDoctorById);

   //delete doctor by id
   this.router.delete('/:id/doctor', adminAuth, roleAuth(['admin']), this.adminController.deleteDoctor);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
