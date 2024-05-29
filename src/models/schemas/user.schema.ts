import { Schema } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    role: {
      type: String,
      required: true,
      enum: ['practitioner', 'receptionist', 'admin']
    },
    initials: { type: String, required: true }
  },
  { timestamps: true }
);

export default UserSchema;
