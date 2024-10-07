import Incident from "../models/Incident.js";

class IncidentController {
    static async getAllIncidents(req, res) {
        try {
            const incidents = await Incident.all();
            res.status(200).json(incidents);
        } catch (error) {
            console.error('Error al obtener las incidencias:', error);
            res.status(500).json({ error: 'Error al obtener las incidencias' });
        }
    }

    static async getIncidentById(req, res) {
        const { incident_id } = req.params;
       
       
               try {
            const incident = await Incident.findById(incident_id);
            
            if (!incident) {
                return res.status(404).json({ error: 'Incidencia no encontrada' });
            }
            res.status(200).json(incident);
        } catch (error) {
            console.error('Error al obtener la incidencia:', error);
            res.status(500).json({ error: 'Error al obtener la incidencia' });
        }
    }

    static async getIncidentsByUser(req, res) {
        const { user_id } = req.params; 
        try {
            const incidents = await Incident.findByUserId(user_id);
            if (incidents.length === 0) {
                return res.status(404).json({ message: 'No se encontraron incidencias para este usuario.' });
            }
            res.status(200).json(incidents);
        } catch (error) {
            console.error('Error al obtener incidencias por usuario:', error);
            res.status(500).json({ error: 'Error al obtener incidencias por usuario' });
        }
    }
    
    static async createIncident(req, res) {
        try {
            const { userId, title, type, description, location, status, priority } = req.body;
            
            if (!userId || !title || !type || !description || !location || !priority || !status) {
                return res.status(400).json({ error: 'Campos obligatorios faltantes' });
            }
    
          
            const image_url = req.file ? req.file.filename : null;
    
         
            const newIncident = await Incident.create({ userId, title, type, description, location, status, priority, image_url });
    
            
            res.status(201).json(newIncident);
        } catch (error) {
            console.error('Error al crear la incidencia:', error);
            res.status(500).json({ error: 'Error al crear la incidencia' });
        }
    }
    

    static async updateIncident(req, res) {
        const { incident_id } = req.params;
       
        const { title, type, description, location, status, priority } = req.body;
        try {
            const result = await Incident.update({ incidentId: incident_id, title, type, description, location, status, priority });
            if (!result.affectedRows) return res.status(404).json({ message: 'Incidencia no encontrada' });
            res.status(200).json({ message: 'Incidencia actualizada' });
        } catch (error) {
            console.error('Error al actualizar la incidencia:', error);
            res.status(500).json({ error: 'Error al actualizar la incidencia' });
        }
    }

    static async deleteIncident(req, res) {
        const { incident_id } = req.params;
        try {
            const result = await Incident.deleteById(incident_id);
            if (!result.affectedRows) return res.status(404).json({ message: 'Incidencia no encontrada' });
            res.status(200).json({ message: 'Incidencia eliminada' });
        } catch (error) {
            console.error('Error al eliminar la incidencia:', error);
            res.status(500).json({ error: 'Error al eliminar la incidencia' });
        }
    }
}

export default IncidentController ;
