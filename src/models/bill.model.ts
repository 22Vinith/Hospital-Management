import { Schema, model } from 'mongoose';
import { Ibill } from '../interfaces/bill.interface';
import { required } from '@hapi/joi';

const BillSchema: Schema<Ibill> = new Schema(
  {
    appointment_id: { type: String, required: true },
    doctor_id: {type: String, required: true},
    prescription: { type: String, required: true },
    invoice: { type: String, required: true }
  },
  { timestamps: true }
);
export default model<Ibill>('bill', BillSchema);
