import {Router} from 'express';
import authController from '../controllers/authController.js';
import { validateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', validateJWT, authController.me);

export default router