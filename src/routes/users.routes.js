import {Router} from 'express';
import UserController from '../controllers/userController.js';
import { validateUserID } from '../middlewares/user.middleware.js';
import uploadImage from '../config/multer.js';

const router = Router();

router.get('/', UserController.index)
router.get('/:id', validateUserID, UserController.getByID)
router.post('/', uploadImage.single('image'), UserController.store)
router.delete('/:id', validateUserID, UserController.delete)
router.put('/:id', validateUserID, UserController.updatePut)
router.patch('/:id', validateUserID, UserController.updatePatch)
export default router