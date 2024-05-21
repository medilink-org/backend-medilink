import { model } from "mongoose"
import schema from "./schemas/patient.schema"

export default class PatientModel {
  public static model = model<Patient>("patient", schema)
}
