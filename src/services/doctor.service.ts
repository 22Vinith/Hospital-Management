import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DoctorModel from '../models/doctor.model';
import PatientModel from '../models/patient.model';
import appointmentsModel from '../models/appointments.model';
import specializationModel from '../models/specialization.model';
import billModel from '../models/bill.model';
import redisClient from '../config/redis';
import { sendEmail } from '../utils/user.util';
import patientModel from '../models/patient.model';
import { Ibill } from '../interfaces/bill.interface';

class DoctorService {
  // Doctor registration
  public async signUp(body: {
    email: string;
    password: string;
    doctor_name: string;
    specialization: string;
  }): Promise<any> {
    const doctor = await DoctorModel.findOne({ email: body.email });
    if (!doctor) {
      throw new Error('Doctor not registered by admin');
    }
    body.password = await bcrypt.hash(body.password, 10);
    const updatedDoctor = await DoctorModel.updateOne(
      { email: body.email },
      body,
      { new: true }
    );
    const spArray = await specializationModel.findOne({
      $where: 'this.specializations.length>0'
    });
    if (!spArray) {
      await specializationModel.create({ specializations: [] });
      const spArray = await specializationModel.findOne({
        $where: 'this.specializations.length===0'
      });
      spArray.specializations.push(body.specialization);
      spArray.save();
      return updatedDoctor;
    }
    if (
      spArray.specializations.find(
        (specialization) => specialization === body.specialization
      ) === undefined
    ) {
      spArray.specializations.push(body.specialization);
      spArray.save();
    }
    return updatedDoctor;
  }

  // Login doctor
  public async login(body: {
    email: string;
    password: string;
  }): Promise<{ token: string; refreshToken: string }> {
    const doctor = await DoctorModel.findOne({ email: body.email });
    if (!doctor || !(await bcrypt.compare(body.password, doctor.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_DOCTOR as string,
      { expiresIn: '1h' }
    );
    const refreshToken = jwt.sign(
      { id: doctor._id },
      process.env.JWT_DOCTOR as string,
      { expiresIn: '7d' }
    );

    doctor.refreshToken = refreshToken;
    await doctor.save();
    return { token, refreshToken };
  }

  // Get appointments by specialization with Redis caching
  public async getAllAppointments(
    specialization: string,
    page: number,
    limit: number
  ): Promise<any> {
    // const cacheKey = `appointments:${specialization}:${page}:${limit}`;
    // const cachedAppointments = await redisClient.get(cacheKey);

    // if (cachedAppointments) {
    //   return JSON.parse(cachedAppointments);
    // }

    const skip = (page - 1) * limit;
    const appointments = await appointmentsModel
      .find({ specialization })
      .skip(skip)
      .limit(limit);
    const total = await appointmentsModel.countDocuments({ specialization });
    const result = { appointments, total };

    // await redisClient.set(cacheKey, JSON.stringify(result), { EX: 600 }); // Cache for 10 minutes
    return result;
  }

  //doctorInfo by Id
  public async getDoctorInfoById(doctorId: string): Promise<any> {
    try {
      const doctorInfo = await DoctorModel.findById(doctorId);

      if (!doctorInfo) {
        return null;
      }
      return doctorInfo;
    } catch (error) {
      console.error('Error fetching doctor info in service:', error.message);
      throw new Error('Unable to fetch doctor information');
    }
  }

  //update the doctor info
  public async updateDoctorInfo(doctorId: string, updates: any): Promise<any> {
    try {
      const updatedDoctor = await DoctorModel.findByIdAndUpdate(
        doctorId,
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedDoctor) {
        return null;
      }

      return updatedDoctor;
    } catch (error) {
      console.error('Error updating doctor info in service:', error.message);
      throw new Error('Unable to update doctor information');
    }
  }

  // Get patient by ID with Redis caching
  public async getPatientById(id: string): Promise<any> {
    const cacheKey = `patient:${id}`;
    // Check Redis for cached data
    const cachedPatient = await redisClient.get(cacheKey);
    if (cachedPatient) {
      console.log('Cache hit for patient:', id);
      return JSON.parse(cachedPatient);
    }
    const patient = await PatientModel.findById(id);
    if (!patient) {
      throw new Error('Patient not found');
    }
    await redisClient.set(cacheKey, JSON.stringify(patient), {
      EX: 600
    });
    return patient;
  }

  // Update ailment status and flush the entire cache
  public async updateAilmentStatus(
    id: string,
    ailment_status: boolean
  ): Promise<any> {
    const updatedAppointment = await appointmentsModel.findByIdAndUpdate(
      id,
      { ailment_status },
      { new: true }
    );
    if (!updatedAppointment) {
      throw new Error('Patient not found');
    }
    await redisClient.flushAll();
    return updatedAppointment;
  }

  public async AppointmentsByPatientId(patient_id): Promise<any> {
    const appointments = await appointmentsModel.find({ patient_id });
    if (!appointments) {
      throw new Error('no appointments found');
    }
    await redisClient.flushAll();
    return appointments;
  }

  // Delete patient by ID and flush all Redis cache
  public deletePatientById = async (patientId: string): Promise<void> => {
    try {
      const patientData = await PatientModel.findById(patientId);
      if (!patientData) {
        throw new Error('Patient not found');
      }
      await patientData.remove();
      await redisClient.flushAll();
    } catch (error) {
      throw new Error(`Error deleting patient: ${error.message}`);
    }
  };

  // generate bill with prescription
  public async generateBill(id, { prescription, invoice }): Promise<Ibill> {
    const appointment = await appointmentsModel.findById(id);
    if (!appointment) {
      throw new Error('No appointment found');
    }
    const patient = await patientModel.findOne({ id: appointment.patient_id });
    const bill = await billModel.create({
      appointment_id: appointment.id,
      doctor_id: appointment.doctor_id,
      patient,
      prescription,
      invoice
    });
    console.log(bill);
    return bill;
  }

  // Get total money earned by doctor
  public async getTotalEarningsByDoctor(doctorId: string): Promise<number> {
    try {
      const bills = await billModel.find({ doctor_id: doctorId });
      if (!bills || bills.length === 0) {
        return 0;
      }
      const totalEarnings = bills.reduce(
        (total, bill) => total + parseFloat(bill.invoice.replace('rs', '')),
        0
      );
      return totalEarnings;
    } catch (error) {
      console.error('Error calculating total earnings:', error.message);
      throw new Error('Unable to calculate total earnings');
    }
  }

  // Forgot password
  public async forgotPassword(email: string): Promise<void> {
    const doctor = await DoctorModel.findOne({ email });
    if (!doctor) {
      throw new Error('Email not found');
    }
    const token = jwt.sign(
      { id: doctor._id },
      process.env.JWT_RESET_DOCTOR as string,
      { expiresIn: '1h' }
    );
    await sendEmail(email, token);
  }

  // Reset password
  public async resetPassword(id: string, newPassword: string): Promise<void> {
    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      throw new Error('Doctor not found');
    }
    doctor.password = await bcrypt.hash(newPassword, 10);
    await doctor.save();
  }

  // Refresh token
  public async refreshToken(doctorId: string): Promise<string> {
    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor || !doctor.refreshToken) {
      throw new Error('Invalid refresh token');
    }
    const payload = jwt.verify(
      doctor.refreshToken,
      process.env.JWT_DOCTOR as string
    ) as { id: string };
    const newToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_DOCTOR as string,
      { expiresIn: '1h' }
    );
    return newToken;
  }

  public async getAllAppointmentById(doctorId: string): Promise<any> {
    console.log(doctorId)
    const appointments = await appointmentsModel.find({ doctor_id: doctorId });
    return appointments;
  }
  
}

export default new DoctorService();
