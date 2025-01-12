import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PatientModel from '../models/patient.model';
import doctorModel from '../models/doctor.model';
import appointmentsModel from '../models/appointments.model';
import redisClient from '../config/redis';
import { sendEmail } from '../utils/user.util';
import specializationModel from '../models/specialization.model';
import billModel from '../models/bill.model';
import { error } from 'winston';
import { Ibill } from '../interfaces/bill.interface';

export class PatientService {
  // Patient SignUp
  public async signup(data: {
    name: string;
    age: number;
    email: string;
    phno: number;
    password: string;
  }) {
    const existingPatient = await PatientModel.findOne({ email: data.email });
    if (existingPatient) {
      throw new Error('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const patient = new PatientModel({ ...data, password: hashedPassword });
    await patient.save();
    return { message: 'Signup successful', patientId: patient._id };
  }

  // Patient Login
  public async login(body: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string }> {
    const patient = await PatientModel.findOne({ email: body.email });
    if (!patient || !(await bcrypt.compare(body.password, patient.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_PATIENT as string,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: patient._id },
      process.env.JWT_PATIENT as string,
      { expiresIn: '7d' }
    );

    patient.refreshToken = refreshToken;
    await patient.save();

    return { token, refreshToken };
  }

  // Book Appointment with Cache Clearing
  public async bookAppointment({
    patient_id,
    ailment,
    doctor_id,
    specialization
  }): Promise<Object> {
    const appointment = await appointmentsModel.create({
      patient_id,
      ailment,
      doctor_id,
      specialization
    });
    return { message: 'Appointment booked successfully', appointment };
  }

  // Specialization array
  public async getSpArray() {
    const spArray = await specializationModel.findOne({
      $where: 'this.specializations.length>=0'
    });
    return spArray;
  }

  //doctor by specialization
  public async DoctorBySpecialization({ specialization }) {
    const doctors = await doctorModel.find({ specialization });
    return doctors;
  }

  //get bill
  public async getBill(appointment_id): Promise<Ibill> {
    const bill = await billModel.findOne({appointment_id:appointment_id});
    if (!bill) {
      throw error('bill not found');
    }
    return bill;
  }

  // Forget Password
  public async forgotPassword(email: string): Promise<void> {
    const patient = await PatientModel.findOne({ email });
    if (!patient) {
      throw new Error('Email not found');
    }

    const token = jwt.sign(
      { id: patient._id },
      process.env.JWT_RESET_PATIENT as string,
      { expiresIn: '1h' }
    );
    await sendEmail(email, token);
  }

  // Reset Password
  public async resetPassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    const patient = await PatientModel.findById(userId);
    if (!patient) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedPassword;
    await patient.save();

    // Clear cache for the updated patient
    const cacheKey = `patient:${userId}`;
    await redisClient.del(cacheKey);
  }

  // Refresh Token
  public async refreshToken(patientId: string): Promise<string> {
    const patient = await PatientModel.findById(patientId);
    if (!patient || !patient.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    const payload = jwt.verify(
      patient.refreshToken,
      process.env.JWT_PATIENT as string
    ) as { id: string };
    const newToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_PATIENT as string,
      { expiresIn: '1h' }
    );

    return newToken;
  }
}

export default new PatientService();
