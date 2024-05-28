import { Router } from 'express';
import {
  createUser,
  authenticateUser,
  getAllUsers,
  deleteUser
} from '../controllers/user.controller';

const router = Router();

// API endpoints:
// - /account/register
// - /account/login
// - /account/allUsers
// - /account/deleteUser
router.post('/register', createUser);
router.post('/login', authenticateUser);
router.get('/allUsers', getAllUsers);
router.delete('/deleteUser', deleteUser);

export default router;
