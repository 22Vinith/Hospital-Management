import { Schema, model } from 'mongoose';
import { IAppointment } from '../interfaces/appointment.interface';

const AppointmentSchema: Schema<IAppointment> = new Schema(
  {
    patient_id: { type: String, required: true },
    ailment: { type: String, required: true },
    doctor_id: { type: String, required: true },
    ailment_status: { type: Boolean, default: false },
    specialization: { type: String, required: true }
  },
  { timestamps: true }
);
export default model<IAppointment>('appointment', AppointmentSchema);
