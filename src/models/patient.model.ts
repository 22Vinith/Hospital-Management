import { Schema, model } from 'mongoose';
import { IPatient } from '../interfaces/patient.interface';

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  phno: { type: Number, required: true },
  password: { type: String, required: true },
  ailment: { type: String },
  required_specialist: { type: String },
  ailment_status: { type: Boolean, default: false },
  refreshToken: { type: String, required: false },
},
{ timestamps: true });
export default model<IPatient> ('patient',PatientSchema);
