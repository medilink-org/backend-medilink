import { Router } from 'express';
import { createUser, authenticateUser } from '../controllers/user.controller';

const router = Router();

// API:
// - /account/register
// - /account/login
router.post('/register', createUser);
router.post('/login', authenticateUser);

export default router;
