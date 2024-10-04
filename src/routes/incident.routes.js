import express from 'express';
import incidentController from '../controllers/incidentController.js';

const router = express.Router();

router.get('/', incidentController.getAllIncidents);
router.get('/:id', incidentController.getIncidentById);
router.post('/', incidentController.createIncident);
router.put('/:id', incidentController.updateIncident);
router.delete('/:id', incidentController.deleteIncident);

export default router;
