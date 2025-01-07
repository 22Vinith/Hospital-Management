import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model';
import doctorModel from '../models/doctor.model';
import { sendEmail } from '../utils/user.util';
import DoctorModel from '../models/doctor.model';
import { IDoctor } from '../interfaces/doctor.interface';
import { body } from 'express-validator';


export class AdminService {

  // Register admin
  public static registerAdmin = async (name: string, email:string, password: string) => {
    const existingAdmin = await AdminModel.findOne({ email });
    if (existingAdmin) {
      throw new Error('Admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new AdminModel({ name, email, password: hashedPassword });
    await newAdmin.save();
    return newAdmin;
  };

  // Admin login
  public static async login(body: { email: string; password: string }): Promise<{ token: string; refreshToken: string }> {
    const admin = await AdminModel.findOne({ email: body.email });

    if (!admin || !(await bcrypt.compare(body.password, admin.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN as string, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN as string, { expiresIn: '7d' });
    admin.refreshToken = refreshToken;
    await admin.save();
    return { token, refreshToken };
  }

// Get all doctors with pagination
public static getAllDoctors = async (
  page: number,
  limit: number
): Promise<{ doctors: any[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const doctors = await doctorModel.find().skip(skip).limit(limit);
    const total = await doctorModel.countDocuments();
    return { doctors, total };
  } catch (error) {
    throw new Error(`Error fetching doctors: ${error.message}`);
  }
};


  // Get doctor by ID
  public static getDoctorById = async (id: string) => {
    return await doctorModel.findById(id);
  };

  // Add doctor
  public static addDoctor = async({email}) => {
    const data = await DoctorModel.create({email});
    if(!data){
      throw Error('Not able to create doctor');
    }
  }

  // Delete doctor
  public static deleteDoctor = async (id: string) => {
    return await doctorModel.findByIdAndDelete(id);
  };

  // forget password
public static forgotPassword = async (email: string): Promise<void> => {
    try{
      const adminData = await AdminModel.findOne({ email });
      if (!adminData) {
        throw new Error('Email not found');
      }
      const token = jwt.sign({ id: adminData._id }, process.env.JWT_RESET_ADMIN, { expiresIn: '1h' });
      await sendEmail(email, token);
    } catch(error){
      throw new Error("Error occured cannot send email: "+error)
    }
  };
  
    //reset password
    public static resetPassword = async (body: any, userId: string): Promise<void> => {
        try{
           
          const adminData = await AdminModel.findById(userId);
          if (!adminData) {
            throw new Error('User not found');
          }
          const hashedPassword = await bcrypt.hash(body.newPassword, 10);
          adminData.password = hashedPassword;
          await adminData.save();
        } catch (error) {
          throw new Error(`Error resetting password: ${error.message}`);
        }
    };
  
    //refresh token
    public static async refreshToken(adminId: string): Promise<string> {
      try {
        const admin = await AdminModel.findById(adminId);
        if (!admin) {
          throw new Error('Patient not found');
        }
        const refreshToken = admin.refreshToken; 
        if (!refreshToken) {
          throw new Error('Refresh token is missing');
        }
        const payload: any = jwt.verify(refreshToken, process.env.JWT_ADMIN);
        const newAccessToken = jwt.sign(
          { id: payload.id }, 
          process.env.JWT_ADMIN,
          { expiresIn: '1h' }
        );
  
        return newAccessToken;
      } catch (error) {
        throw new Error(`Error refreshing token: ${error.message}`);
      }
    }
}
