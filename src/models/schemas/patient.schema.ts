import { Schema } from "mongoose"

export default new Schema<Patient>(
  {
    name: { type: String, required: true },
    initials: { type: String, required: true },
    age: { type: Number, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    appointments: [{ type: Schema.Types.ObjectId, ref: "appointment" }],
    notes: [
      {
        author: { type: String },
        date: { type: String },
        content: { type: String },
        summary: { type: String },
      },
    ],
    prescriptions: [
      {
        medication: { type: String },
        dosage: { type: String },
        frequency: { type: String },
        reason: { type: String },
        start: { type: String },
        end: { type: String },
      },
    ],
    allergies: [
      {
        allergen: { type: String },
        severity: { type: String },
        reaction: { type: String },
      },
    ],
    activeTreatments: [
      {
        treatment: { type: String },
        reason: { type: String },
        start: { type: String },
        end: { type: String },
      },
    ],
    medicalHistory: [
      {
        operation: { type: String },
        reason: { type: String },
        date: { type: String },
      },
    ],
    familyHistory: [
      {
        condition: { type: String },
        relative: { type: String },
      },
    ],
  },
  { timestamps: true, collection: "patient" }
)
