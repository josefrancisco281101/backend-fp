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
       
               try {
            const incident = await Incident.findById(req.params.id);
            console.log(incident)
            if (!incident) {
                return res.status(404).json({ error: 'Incidencia no encontrada' });
            }
            res.status(200).json(incident);
        } catch (error) {
            console.error('Error al obtener la incidencia:', error);
            res.status(500).json({ error: 'Error al obtener la incidencia' });
        }
    }

    
    static async createIncident(req, res) {
        try {
            const { userId, title, type, description, location, imageUrl } = req.body;
            if (!userId || !title || !type || !description || !location) {
                return res.status(400).json({ error: 'Campos obligatorios faltantes' });
            }
            const newIncident = await Incident.create({ userId, title, type, description, location, imageUrl: imageUrl || null });
            res.status(201).json(newIncident);
        } catch (error) {
            console.error('Error al crear la incidencia:', error);
            res.status(500).json({ error: 'Error al crear la incidencia' });
        }
    }

    static async updateIncident(req, res) {
        const { id } = req.params;
        const { title, type, description, location, imageUrl, status } = req.body;
        try {
            const result = await Incident.update({ incidentId: id, title, type, description, location, imageUrl, status });
            if (!result.affectedRows) return res.status(404).json({ message: 'Incidencia no encontrada' });
            res.status(200).json({ message: 'Incidencia actualizada' });
        } catch (error) {
            console.error('Error al actualizar la incidencia:', error);
            res.status(500).json({ error: 'Error al actualizar la incidencia' });
        }
    }

    static async deleteIncident(req, res) {
        const { id } = req.params;
        try {
            const result = await Incident.deleteById(id);
            if (!result.affectedRows) return res.status(404).json({ message: 'Incidencia no encontrada' });
            res.status(200).json({ message: 'Incidencia eliminada' });
        } catch (error) {
            console.error('Error al eliminar la incidencia:', error);
            res.status(500).json({ error: 'Error al eliminar la incidencia' });
        }
    }
}

export default IncidentController ;
