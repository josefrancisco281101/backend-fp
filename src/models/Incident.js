import {pool} from '../config/db.js';

class Incident {
        static async all() {
        const [incidents] = await pool.execute(`
            SELECT i.incident_id, i.user_id, i.title, i.type, i.description, i.location, i.image_url, i.status, i.created_at, i.updated_at, u.f_name, u.l_name
            FROM incidents i
            JOIN users u ON i.user_id = u.user_id
        `);
        return incidents;
    }
    
    static async findByUserId(user_id) {
        const [incidents] = await pool.execute(`
            SELECT i.incident_id, i.user_id, i.title, i.type, i.description, i.location, i.image_url, i.status, i.created_at, i.updated_at, u.f_name, u.l_name
            FROM incidents i
            JOIN users u ON i.user_id = u.user_id
            WHERE i.incident_id = ?
        `, [id]);
        return incidents[0];
    }
    static async findOne (columna, valor) {
        const [incident] = await pool.execute(`SELECT i.incident_id, i.user_id, i.title, i.type, i.description, i.location, i.image_url, i.status, i.created_at, i.updated_at, u.f_name, u.l_name
        FROM incidents i
        JOIN users u ON i.user_id = u.user_id
        WHERE ${columna} = ?`, [valor]);
        return incident[0];
    }

    static async create({ userId, title, type, description, location, imageUrl }) {
        if (!userId || !title || !type || !description || !location) {
            throw new Error('Campos obligatorios faltantess');
        }
        const [result] = [ userId, title, type, description, location];
        const camposObligatorios = ['user_id', 'title', 'type', 'description', 'location'];
        if (imageUrl) {
            camposObligatorios.push('image_url');
        result.push(imageUrl);
    }
    const campos = camposObligatorios.join(', ');
    const placeholders = camposObligatorios.map(() => '?').join(', ');
    const query = `INSERT INTO incidents (${campos}) VALUES (${placeholders})`;

    const [newIncident] = await pool.execute(query, result);
    const incident = await this.findById(newIncident.insertId);
    return incident;
       
    }
    static async update({ incidentId, title, type, description, location, imageUrl, status }) {
        let query = 'UPDATE incidents SET ';
        const camposActualizar = [];
        const valoresActualizar = [];

        if (title !== undefined) {
            camposActualizar.push('title = ?');
            valoresActualizar.push(title);
        }

         if (type !== undefined) {
            camposActualizar.push('type = ?');
            valoresActualizar.push(type);
        }

        if (description !== undefined) {
            camposActualizar.push('description = ?');
            valoresActualizar.push(description);
        }

        if (location !== undefined) {
            camposActualizar.push('location = ?');
            valoresActualizar.push(location);
        }

        if (imageUrl !== undefined) {
            camposActualizar.push('image_url = ?');
            valoresActualizar.push(imageUrl);
        }

        if (status !== undefined) {
            camposActualizar.push('status = ?');
            valoresActualizar.push(status);
        }
        if (camposActualizar.length === 0) return null;

        query += camposActualizar.join(', ') + ', updated_at = CURRENT_TIMESTAMP WHERE incident_id = ?';
        valoresActualizar.push(incidentId);

        const [result] = await pool.execute(query, valoresActualizar);
        return result;
    }
    static async deleteById(id) {
        const [result] = await pool.execute('DELETE FROM incidents WHERE incident_id = ?', [id]);
        return result;
    }

}

export default Incident;