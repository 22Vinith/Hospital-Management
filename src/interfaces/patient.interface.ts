import  {  Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age: number;
  email: string;
  phno: number;
  password: string;
  ailment?: string;
  required_specialist?: string;
  ailment_status?: boolean;
  refreshToken?: string; 
}