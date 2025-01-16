import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/admin.model';
import DoctorModel from '../models/doctor.model';
import redisClient from '../config/redis';
import { sendEmail } from '../utils/user.util';
import specializationModel from '../models/specialization.model';

export class AdminService {
  // Register admin
  public static registerAdmin = async (
    name: string,
    email: string,
    password: string
  ) => {
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
  public static async login(body: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string }> {
    const admin = await AdminModel.findOne({ email: body.email });
    if (!admin || !(await bcrypt.compare(body.password, admin.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_ADMIN as string, {
      expiresIn: '1h'
    });
    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_ADMIN as string,
      { expiresIn: '7d' }
    );
    admin.refreshToken = refreshToken;
    await admin.save();
    return { token, refreshToken };
  }

  // Get all doctors with Redis caching
  public static getAllDoctors = async (
    page: number,
    limit: number
  ): Promise<{ doctors: any[]; total: number }> => {
    const cacheKey = `doctors:${page}:${limit}`;
    const cachedDoctors = await redisClient.get(cacheKey);

    if (cachedDoctors) {
      return JSON.parse(cachedDoctors);
    }

    const skip = (page - 1) * limit;
    const doctors = await DoctorModel.find().skip(skip).limit(limit);
    const total = await DoctorModel.countDocuments();
    const result = { doctors, total };

    await redisClient.set(cacheKey, JSON.stringify(result), { EX: 600 }); // Cache for 10 minutes
    return result;
  };

  // Get doctor by ID with Redis caching
  public static getDoctorById = async (id: string): Promise<any> => {
    const cacheKey = `doctor:${id}`;
    // Check Redis for cached data
    const cachedDoctor = await redisClient.get(cacheKey);
    if (cachedDoctor) {
      return JSON.parse(cachedDoctor);
    }
    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    await redisClient.set(cacheKey, JSON.stringify(doctor), {
      EX: 600
    });
    return doctor;
  };

  // Add doctor and flush cache
  public static addDoctor = async (data: { email: string }): Promise<any> => {
    const newDoctor = await DoctorModel.create(data);
    if (!newDoctor) {
      throw new Error('Failed to add doctor');
    }
    await redisClient.flushAll(); // Clear cache
    return newDoctor;
  };

  // Delete doctor and flush cache
  public static deleteDoctor = async (id: string): Promise<boolean> => {
    const doctor = await DoctorModel.findByIdAndDelete(id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    const count = (
      await DoctorModel.find({ specialization: doctor.specialization })
    ).length;
    const spArray = await specializationModel.findOne({
      $where: 'this.specializations.length>0'
    });
    if (count === 0) {
      spArray.specializations.splice(
        spArray.specializations.indexOf(doctor.specialization),
        1
      );
      spArray.save();
    }
    await redisClient.flushAll();
    return true;
  };

  // Forgot password
  public static forgotPassword = async (email: string): Promise<void> => {
    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      throw new Error('Email not registered');
    }
    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_RESET_ADMIN as string,
      { expiresIn: '1h' }
    );
    await sendEmail(email, token);
  };

  // Reset password
  public static resetPassword = async (
    id: string,
    newPassword: string
  ): Promise<void> => {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
  };

  // Refresh token
  public static refreshToken = async (adminId: string): Promise<string> => {
    const admin = await AdminModel.findById(adminId);
    if (!admin || !admin.refreshToken) {
      throw new Error('Invalid refresh token');
    }
    const payload = jwt.verify(
      admin.refreshToken,
      process.env.JWT_ADMIN as string
    ) as { id: string };
    const newToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_ADMIN as string,
      { expiresIn: '1h' }
    );
    return newToken;
  };
}
