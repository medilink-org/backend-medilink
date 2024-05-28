import { Schema } from 'mongoose';

export default new Schema<Appointment>(
  {
    patient: { type: Schema.Types.ObjectId, ref: 'patient' },
    practitioner: { type: Schema.Types.ObjectId, ref: 'practitioner' },
    date: { type: Date },
    status: { type: String, default: 'scheduled' },
    type: { type: String, default: '' },
    reason: { type: String, default: '' },
    synopsis: { type: String, default: '' },
    measurements: [
      {
        value: { type: Number },
        type: { type: String }
      }
    ],
    socialHistory: [
      {
        type: { type: String },
        value: { type: String }
      }
    ]
  },
  { timestamps: true, collection: 'appointment' }
);
