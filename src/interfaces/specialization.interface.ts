import  {  Document } from 'mongoose';

export interface Ispecialization extends Document {
  specializations: [string] 
}