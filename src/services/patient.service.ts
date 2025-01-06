import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import PatientModel from '../models/patient.model';
import { sendEmail } from '../utils/user.util';

export class PatientService {

  // Patient SignUp
  public async signup(data: { name: string; age: number; email: string; phno: number; password: string }) {
    // Check if patient already exists
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
  public async login(data: { email: string; password: string }) {
 
    const patient = await PatientModel.findOne({ email: data.email });
    if (!patient) {
      throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(data.password, patient.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    // Generate JWT tokens
    const token = jwt.sign({ id: patient._id }, process.env.JWT_PATIENT, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: patient._id }, process.env.JWT_PATIENT, { expiresIn: '7d' });

    patient.refreshToken = refreshToken;
    await patient.save();

    return { token, refreshToken, patientId: patient._id };
  }


  //Book appointnment for patient
  public async bookAppointment(data: {
    ailment: string;
    required_specialist: string;
    ailment_status: boolean;
    patientId: string;
  }) {
    const { ailment, required_specialist, ailment_status, patientId } = data;
    const patient = await PatientModel.findById(patientId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    patient.ailment = ailment;
    patient.required_specialist = required_specialist;
    patient.ailment_status = ailment_status;

    await patient.save();

    return { message: 'Appointment booked successfully', patient };
  }

// forget password
public forgotPassword = async (email: string): Promise<void> => {
  try{
    const patientData = await PatientModel.findOne({ email });
    if (!patientData) {
      throw new Error('Email not found');
    }
    const token = jwt.sign({ id: patientData._id }, process.env.JWT_RESET_PATIENT, { expiresIn: '1h' });
    await sendEmail(email, token);
  } catch(error){
    throw new Error("Error occured cannot send email: "+error)
  }
};

  //reset password
  public resetPassword = async (body: any, userId: string): Promise<void> => {
      try{
         
        const patientData = await PatientModel.findById(userId);
        if (!patientData) {
          throw new Error('User not found');
        }
        const hashedPassword = await bcrypt.hash(body.newPassword, 10);
        patientData.password = hashedPassword;
        await patientData.save();
      } catch (error) {
        throw new Error(`Error resetting password: ${error.message}`);
      }
  };

  //refresh token
  public async refreshToken(patientId: string): Promise<string> {
    try {
      const patient = await PatientModel.findById(patientId);
      if (!patient) {
        throw new Error('Patient not found');
      }
      const refreshToken = patient.refreshToken; 
      if (!refreshToken) {
        throw new Error('Refresh token is missing');
      }
      // Verify the refresh token
      const payload: any = jwt.verify(refreshToken, process.env.JWT_PATIENT);
      // Generate a new access token
      const newAccessToken = jwt.sign(
        { id: payload.id }, 
        process.env.JWT_PATIENT,
        { expiresIn: '1h' }
      );

      return newAccessToken;
    } catch (error) {
      throw new Error(`Error refreshing token: ${error.message}`);
    }
  }
}

export default new PatientService();
