import { Schema } from 'mongoose';
import UserSchema from './user.schema';

const ReceptionistSchema = new Schema<Receptionist>(
  {
    ...UserSchema.obj
  },
  { timestamps: true }
);

export default ReceptionistSchema;
