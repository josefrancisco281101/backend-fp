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
            SELECT i.incident_id, i.user_id, i.title, i.type, i.description, i.location, i.image_url, i.status, i.priority, i.image_url, i.created_at, i.updated_at, u.f_name, u.l_name
            FROM incidents i
            JOIN users u ON i.user_id = u.user_id
            WHERE i.user_id = ?
        `, [user_id]);
        return incidents;
    }
    static async findOne (columna, valor) {
        const [incident] = await pool.execute(`SELECT i.incident_id, i.user_id, i.title, i.type, i.description, i.location, i.image_url, i.status, i.created_at, i.updated_at, u.f_name, u.l_name
        FROM incidents i
        JOIN users u ON i.user_id = u.user_id
        WHERE ${columna} = ?`, [valor]);
        return incident[0];
    }
    static async findById(incident_id) {
       
        const query = `SELECT incident_id, title, type, description, location, status, priority, image_url FROM incidents WHERE incident_id = ?`;
        
        try {
          const [rows] = await pool.execute(query, [incident_id]);
      
          if (rows.length === 0) {
            throw new Error('Incidente no encontrado');
          }
      
          return rows[0];
        } catch (error) {
          throw new Error('Error al buscar el incidente: ' + error.message);
        }
      }
      

    static async create({ userId, title, type, description, location, status, priority, image_url }) {
        if (!userId || !title || !type || !description || !location || !status || !priority) {
            throw new Error('Campos obligatorios faltantess');
        }
        const result = [ userId, title, type, description, location, status, priority ];
        const camposObligatorios = ['user_id', 'title', 'type', 'description', 'location', 'status', 'priority'];


        if (image_url) {
            result.push(image_url);
            camposObligatorios.push('image_url');
            
        }

    const campos = camposObligatorios.join(', ');
    const placeholders = camposObligatorios.map(() => '?').join(', ');
    const query = `INSERT INTO incidents (${campos}) VALUES (${placeholders})`;

    const [newIncident] = await pool.execute(query, result);
    const incident = await this.findById(newIncident.insertId);
    return incident;
       
    }
    static async update({ incidentId, title, type, description, location, status, priority }) {
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

     
        if (status !== undefined) {
            camposActualizar.push('status = ?');
            valoresActualizar.push(status);
        }

        if (priority !== undefined) {
            camposActualizar.push('priority = ?');
            valoresActualizar.push(priority);
        }
        if (camposActualizar.length === 0) return null;

        query += camposActualizar.join(', ') + ', updated_at = CURRENT_TIMESTAMP WHERE incident_id = ?';
        valoresActualizar.push(incidentId);

        const [result] = await pool.execute(query, valoresActualizar);
        return result;
    }
    static async deleteById(incident_id) {
        const [result] = await pool.execute('DELETE FROM incidents WHERE incident_id = ?', [incident_id]);
        return result;
    }

}

export default Incident;