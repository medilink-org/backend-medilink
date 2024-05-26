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

router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const receptionist = new Receptionist({
      username,
      password: hashedPassword,
      role: 'receptionist'
    });
    await receptionist.save();
    res.status(201).json(receptionist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create receptionist' });
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

router.delete('/id/:_id', async (req: Request, res: Response) => {
  const { _id } = req.params;

  try {
    await Receptionist.findByIdAndDelete(_id);
    res.status(200).json({ message: 'Receptionist deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete receptionist' });
  }
});

router.get('/login/:username/:password', async (req, res) => {
  const { username, password } = req.params;

  try {
    const receptionist: any = await Receptionist.findOne({ username });
    if (!receptionist) {
      return res.status(404).send('Receptionist not found');
    }

    const isMatch = await bcrypt.compare(password, receptionist.password);
    if (!isMatch) {
      return res.status(401).send('Incorrect password');
    }

    return res.status(200).json(receptionist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
