import  { Document } from 'mongoose';
import { IPatient } from './patient.interface';

export interface Ibill extends Document {
  appointment_id: string,
  patient: IPatient,
  prescription: string,
  doctor_id: string,
  invoice: string
}