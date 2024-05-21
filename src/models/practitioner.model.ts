import { model } from "mongoose"
import schema from "./schemas/practitioner.schema"

export default class PractitionerModel {
  public static model = model<Practitioner>("practitioner", schema)
}
