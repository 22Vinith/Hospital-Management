import { Document } from 'mongoose';
// Doctor Interface
export interface IDoctor extends Document {
    doctor_name: string;
    specialization: string;
    email: string;
    password: string;
    refreshToken?: string; 
  }
  