import { model } from 'mongoose';
import ReceptionistSchema from './schemas/receptionist.schema';

const Receptionist = model<Receptionist>('Receptionist', ReceptionistSchema);

export default Receptionist;
