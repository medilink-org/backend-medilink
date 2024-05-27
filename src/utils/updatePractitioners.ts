import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import PractitionerModel from '../models/practitioner.model';

const hashPasswordBeforeSave = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const isPasswordHashed = (password: string) => {
  return password.startsWith('$2a$');
};

const updatePasswords = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/medilink_db');

    const practitioners = await PractitionerModel.model.find();

    for (const practitioner of practitioners) {
      if (!isPasswordHashed(practitioner.password)) {
        const hashedPassword = await hashPasswordBeforeSave('password');
        await PractitionerModel.model.findByIdAndUpdate(practitioner._id, {
          password: hashedPassword,
          role: 'practitioner'
        });
        console.log(`Updated practitioner ${practitioner._id}`);
      } else {
        console.log(
          `Practitioner ${practitioner._id} had already been updated`
        );
      }
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating practitioner:', error);
    mongoose.connection.close();
  }
};

updatePasswords();
