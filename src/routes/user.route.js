import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes
router.use(verifyJWT);

// Define user routes below
// Example: router.get('/profile', getUserProfile);

export default router; 