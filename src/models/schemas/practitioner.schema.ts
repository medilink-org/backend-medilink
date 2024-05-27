import { Schema } from 'mongoose';
import UserSchema from './user.schema';

export default new Schema<Practitioner>(
  {
    ...UserSchema.obj,
    initials: { type: String, required: true },
    patients: [{ type: Schema.Types.ObjectId, ref: 'patient' }],
    appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
    availability: [{ day: String, times: [String] }]
  },
  { timestamps: true, collection: 'practitioner' }
);
