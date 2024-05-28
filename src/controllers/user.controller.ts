import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import ReceptionistModel from '../models/receptionist.model';
import PractitionerModel from '../models/practitioner.model';
import bcrypt from 'bcryptjs';

// Hash the password before saving
const hashPasswordBeforeSave = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Helper method to compare passwords
const comparePassword = async function (
  candidatePassword: string,
  userPassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, userPassword);
};

export const createUser = async (req: Request, res: Response) => {
  const user = req.body;
  const { role, userId, password } = req.body; // userId is the admin user's ID

  try {
    const adminUser = await UserModel.findById(userId);
    if (!adminUser || adminUser.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access Denied: You are not an admin' });
    }

    const validRoles = ['practitioner', 'receptionist', 'admin'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message:
          'Cannot Create Account: Role must be practitioner | receptionist | admin'
      });
    }

    // Hash the password before saving
    const hashedPassword = await hashPasswordBeforeSave(password);
    user.password = hashedPassword;

    let newUser;

    if (role === 'admin') {
      newUser = new UserModel(user);
    } else if (role === 'receptionist') {
      newUser = new ReceptionistModel(user);
    } else if (role === 'practitioner') {
      newUser = new PractitionerModel.model(user);
    }
    newUser = await newUser.save();

    if (!newUser) {
      return res.status(500).send('Failed to create practitioner');
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

// Authenticate user for login
export const authenticateUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user =
      (await UserModel.findOne({ username })) ||
      (await ReceptionistModel.findOne({ username })) ||
      (await PractitionerModel.model.findOne({ username }));

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Incorrect password');
    }

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Only admins should be able to get all users, but for now, we will allow all users to use this endpoint
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const admins = await UserModel.find();
    const receptionists = await ReceptionistModel.find();
    const practitioners = await PractitionerModel.model.find();

    const allUsers = admins.concat(receptionists, practitioners);

    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get all users' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userToDeleteId = req.body._id;
    const user =
      (await UserModel.findByIdAndDelete(userToDeleteId)) ||
      (await ReceptionistModel.findByIdAndDelete(userToDeleteId)) ||
      (await PractitionerModel.model.findByIdAndDelete(userToDeleteId));

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json({ message: 'User deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
