import { Schema, model } from 'mongoose';
import mongoose from 'mongoose';
import { IPatient } from '../interfaces/patient.interface';

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  phno: {
    type: Number,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/,
  },
  ailment: {
    type: String,
    required: true,
  },
  required_specialist: {
    type: String,
    required: true,
  },
  ailment_status: {
    type: Boolean,
    default: false,
  },
}, 
{ timestamps: true });

export default model<IPatient> ('patient',patientSchema);
