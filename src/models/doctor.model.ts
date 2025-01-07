import mongoose, { Schema } from 'mongoose';
import { IDoctor } from '../interfaces/doctor.interface';

const DoctorSchema = new Schema<IDoctor>(
    {
      doctor_name: { type: String, default: null},
      specialization: { type: String, default: null},
      email: { type: String, required: true, unique: true },
      password: { type: String, default: null},
      refreshToken: { type: String, required: false }, 
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IDoctor>('Doctor', DoctorSchema);