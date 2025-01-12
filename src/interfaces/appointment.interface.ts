import  {  Document } from 'mongoose';

export interface IAppointment extends Document {
  patient_id: string;
  ailment: string;
  doctor_id: string,
  ailment_status?: boolean;
  specialization: string;
}