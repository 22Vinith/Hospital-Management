import mongoose, { Schema } from 'mongoose';
import { IDoctor } from '../interfaces/doctor.interface';

const DoctorSchema = new Schema<IDoctor>(
    {
      doctor_name: { type: String, required: true },
      specialization: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      refreshToken: { type: String, required: false }, 
    },
    { timestamps: true }
  );
  
  export default mongoose.model<IDoctor>('Doctor', DoctorSchema);