import { model } from 'mongoose';
import UserSchema from './schemas/user.schema';

const UserModel = model<User>('User', UserSchema);

export default UserModel;
