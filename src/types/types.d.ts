// KEEP THESE UP TO DATE WITH FRONTEND TYPES
declare interface Patient {
  _id?: string
  name: string
  initials: string
  age: number
  birthDate: Date
  gender: string
  appointments?: Appointment[] | Mongoose.Schema.Types.ObjectId[] | string[]
  notes: Note[]
  prescriptions: Prescription[]
  allergies: Allergy[]
  activeTreatments: Treatment[]
  medicalHistory: Operation[]
  familyHistory: Condition[]
}

declare interface Practitioner {
  _id?: string
  name: string
  initials: string
  username: string
  password: string
  patients: Patient[] | Mongoose.Schema.Types.ObjectId[] | string[]
  appointments: Appointment[] | Mongoose.Schema.Types.ObjectId[] | string[]
}

declare interface Condition {
  condition: string
  relative: string
}
declare interface Operation {
  operation: string
  reason: string
  date: string
}
declare interface Treatment {
  treatment: string
  reason: string
  start: string
  end: string
}
declare interface Allergy {
  allergen: string
  severity: string
  reaction: string
}

declare interface Prescription {
  medication: string
  dosage: string
  frequency: string
  reason: string
  start: string
  end: string
}

declare interface Note {
  author: string
  date: Date
  content: string
  summary?: string
}

declare interface Appointment {
  _id?: string
  patient: Patient | Mongoose.Schema.Types.ObjectId | string
  practitioner: Practitioner | string | Mongoose.Schema.Types.ObjectId
  status: "in-progress" | "complete" | "cancelled" | "scheduled"
  date: Date
  type: string
  reason: string
  synopsis: string
  measurements: Measurement[]
  socialHistory: SocialHistory[]
}

declare interface Measurement {
  value: number
  type: string
}

declare interface SocialHistory {
  type: string
  value: string
}
