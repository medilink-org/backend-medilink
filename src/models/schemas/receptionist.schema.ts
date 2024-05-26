import { Schema } from 'mongoose';
import UserSchema from './user.schema';

const ReceptionistSchema = new Schema(
  {
    ...UserSchema.obj,
    role: { type: String, default: 'receptionist', required: true }
  },
  { timestamps: true }
);

export default ReceptionistSchema;
