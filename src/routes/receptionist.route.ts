import express, { Request, Response } from 'express';
import Receptionist from '../models/receptionist.model';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.get('/all', async (req: Request, res: Response) => {
  try {
    const receptionists = await Receptionist.find({});
    res.status(200).json(receptionists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receptionists' });
  }
});

router.put('/id/:_id', async (req: Request, res: Response) => {
  const { _id } = req.params;
  const { username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const updatedReceptionist = await Receptionist.findByIdAndUpdate(
      _id,
      { username, password: hashedPassword },
      { new: true }
    );
    res.status(200).json(updatedReceptionist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update receptionist' });
  }
});

export default router;
