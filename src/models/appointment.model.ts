import { model } from "mongoose"
import schema from "./schemas/appointment.schema"
export default class AppointmentModel {
  public static model = model<Appointment>("appointment", schema)
}
