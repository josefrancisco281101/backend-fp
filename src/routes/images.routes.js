import {Router} from 'express'; 
import imageController from '../controllers/imageController.js';

const router = Router();

router.get('/:nombre', imageController.sendImage);

export default router