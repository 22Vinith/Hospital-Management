import mongoose, { Schema } from 'mongoose';
import { IAdmin } from '../interfaces/admin.interface';

// Admin Schema
const AdminSchema = new Schema<IAdmin>({
  name: { type: String, required: true},
  email: { type: String, required: true, unique: true },  
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },  
  refreshToken: { type: String, required: false }, 
});

const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);
export { AdminModel };
