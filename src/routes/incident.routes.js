import express from 'express';
import incidentController from '../controllers/incidentController.js';
import { validateCORS } from '../middlewares/middleware.js';
import uploadImage from '../config/multer.js';



const router = express.Router();

router.get('/', incidentController.getAllIncidents);
router.get('/incident/:incident_id', incidentController.getIncidentById);
router.get('/user/:user_id', validateCORS, incidentController.getIncidentsByUser);
router.post('/', uploadImage.single('image'), incidentController.createIncident);
router.put('/incident/:incident_id', incidentController.updateIncident);
router.delete('/incident/:incident_id', incidentController.deleteIncident);

export default router;
