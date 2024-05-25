import { Schema } from 'mongoose';

export default new Schema<Practitioner>(
  {
    name: { type: String, required: true },
    initials: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    patients: [{ type: Schema.Types.ObjectId, ref: 'patient' }],
    appointments: [{ type: Schema.Types.ObjectId, ref: 'appointment' }],
    availability: [{ day: String, times: [String] }]
  },
  { timestamps: true, collection: 'practitioner' }
);
