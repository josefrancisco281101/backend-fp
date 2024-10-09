import {Router} from 'express';
import authController from '../controllers/authController.js';
import { validateJWT } from '../middlewares/auth.middleware.js';
import uploadImage from '../config/multer.js';

const router = Router();

router.post('/login', authController.login);
router.get('/me', validateJWT, authController.me);
router.post('/register', authController.register);

export default router