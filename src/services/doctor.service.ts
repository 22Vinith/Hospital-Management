// services/doctor.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import DoctorModel from '../models/doctor.model';
import { IDoctor } from '../interfaces/doctor.interface';
import PatientModel from '../models/patient.model';
import { sendEmail } from '../utils/user.util';

class DoctorService {

    //register doctor
  public async signUp(body: IDoctor): Promise<any> {
    const doctor = await DoctorModel.findOne({email:body.email});
    if(!doctor){
        throw Error('doctor not registered by admin')
    }
    const hashedPassword = await bcrypt.hash(body.password!, 10);
    body.password = hashedPassword;
    const data = await DoctorModel.updateOne({email:body.email},
      {doctor_name:body.doctor_name,
      specialization:body.specialization,
      password:body.password},{new: true});
    return data;
  }

  //login doctor
  public async login(body: { email: string; password: string }): Promise<{ token: string; refreshToken: string }> {
    const doctor = await DoctorModel.findOne({ email: body.email });
    if (!doctor || !(await bcrypt.compare(body.password, doctor.password))) {
      throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: doctor._id }, process.env.JWT_DOCTOR, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: doctor._id }, process.env.JWT_DOCTOR, { expiresIn: '7d' });
    doctor.refreshToken = refreshToken;
    await doctor.save();
    return { token, refreshToken };
  }


// Get patients by specialization with pagination
public async getPatientsBySpecialization(
  specialization: string,
  page: number,
  limit: number
): Promise<{ patients: any[]; total: number }> {
  try {
    const skip = (page - 1) * limit;
    const patients = await PatientModel.find({ required_specialist: specialization })
      .skip(skip)
      .limit(limit);
    const total = await PatientModel.countDocuments({ required_specialist: specialization });
    return { patients, total };
  } catch (error) {
    throw new Error(`Error fetching patients by specialization: ${error.message}`);
  }
}


  //get patient by id
  public async getPatientById(id: string) {
    return await PatientModel.findById(id);
  }

  //update the status by id
  public async updateAilmentStatus(id: string, ailment_status: boolean) {
    return await PatientModel.findByIdAndUpdate(id, { ailment_status }, { new: true });
  }

  // forget password
  public forgotPassword = async (email: string): Promise<void> => {
    try{
      const doctorData = await DoctorModel.findOne({ email });
      if (!doctorData) {
        throw new Error('Email not found');
      }
      const token = jwt.sign({ id: doctorData._id }, process.env.JWT_RESET_DOCTOR, { expiresIn: '1h' });
      await sendEmail(email, token);
    } catch(error){
      throw new Error("Error occured cannot send email: "+error)
    }
  };


  // Delete patient by ID
public deletePatientById = async (patientId: string): Promise<void> => {
    try {
        const patientData = await PatientModel.findById(patientId);

        if (!patientData) {
            throw new Error('Patient not found');
        }
        await patientData.remove();
    } catch (error) {
        throw new Error(`Error deleting patient: ${error.message}`);
    }
};

    //reset password
    public resetPassword = async (body: any, userId: string): Promise<void> => {
        try{
          const doctorData = await DoctorModel.findById(userId);
          if (!doctorData) {
            throw new Error('User not found');
          }
          const hashedPassword = await bcrypt.hash(body.newPassword, 10);
          doctorData.password = hashedPassword;
          await doctorData.save();
        } catch (error) {
          throw new Error(`Error resetting password: ${error.message}`);
        }
    };


    //refresh token
  public async refreshToken(doctorId: string): Promise<string> {
    try {
      const doctorRecord = await DoctorModel.findById(doctorId);
      if (!doctorRecord) {
        throw new Error('Doctor not found');
      }
      const refreshToken = doctorRecord.refreshToken;  
      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }
      const payload: any = jwt.verify(refreshToken, process.env.JWT_DOCTOR);
      const { id } = payload;
      const newAccessToken = jwt.sign({ id }, process.env.JWT_DOCTOR, { expiresIn: '1h' });
      return newAccessToken;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }
}

export default new DoctorService();
