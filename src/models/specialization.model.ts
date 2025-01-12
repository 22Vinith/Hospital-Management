import mongoose, { Schema } from 'mongoose';
import { Ispecialization } from '../interfaces/specialization.interface';

const Specializations = new Schema<Ispecialization>(
    {
      specializations: { type: [String], default: null}, 
    },
  );
  
  export default mongoose.model<Ispecialization>('specializations', Specializations);