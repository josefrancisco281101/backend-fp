import {pool} from '../config/db.js';
import bcrypt from 'bcrypt';

class User {
    static async all () {
        const [Users] = await pool.execute('SELECT user_id, f_name, l_name, username, email, image, role FROM users');
        return Users;
    }
    static async findById (id) {
        const [Users] = await pool.execute('SELECT user_id, f_name, l_name, username, email, image, role, password FROM users WHERE user_id = ?', [id]);
        return Users[0];
    }

    static async findOne (columna, valor) {
        const [user] = await pool.execute(`SELECT user_id, f_name, l_name, username, email, image, role, password FROM users WHERE ${columna} = ?`, [valor]);
        console.log(user)
        return user[0];
    }
    
  static async create({ fName, lName, username, email, password, image, role}) {

   
    if (!fName || !lName || !username || !email || !password || !role) {
      throw new Error('Campos obligatorios faltantes');
    }
        const encriptada = await bcrypt.hash(password, 10);
        const result =  [fName, lName, username, email, encriptada, role];
        

    const camposObligatorios = ['f_name', 'l_name', 'username', 'email', 'password', 'role'];
    
    
    if (image) {
      result.push(image);
        camposObligatorios.push('image');
       
    }
    const campos = camposObligatorios.join(', ');
    const placeholders = camposObligatorios.map(() => '?').join(', ');

    const query = `INSERT INTO users (${campos}) VALUES (${placeholders})`;


    const [newUser] = await pool.execute(query, result);
 

    const user = await this.findById(newUser.insertId);
   

    delete user.password;
    return user;

  }
  static async deleteByID (id) {
    const [resultado] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    )
    return resultado
  }
          
  
  static async update ({
    userId,
    fName,
    lName,
    username,
    email,
    password,
    image,
    role
  }) {
    let query = 'UPDATE users SET ';
    const camposActualizar = [];
    const valoresActualizar = [];

    if (fName !== undefined) {
        camposActualizar.push('f_name = ?')
        valoresActualizar.push(fName || null)
      }

      if (lName !== undefined) {
        camposActualizar.push('l_name = ?')
        valoresActualizar.push(lName || null)
      }

    if (username !== undefined) {
      camposActualizar.push('username = ?')
      valoresActualizar.push(username || null)
    }

    if (email !== undefined) {
      camposActualizar.push('email = ?')
      valoresActualizar.push(email || null)
    }
    
    if (password !== undefined) {
        camposActualizar.push('password = ?')
        const encriptada = await bcrypt.hash(password, 10)
        valoresActualizar.push(encriptada)
      }
      if (role !== undefined) {
        camposActualizar.push('role = ?');
        valoresActualizar.push(role || null);
    }

   if (image !== undefined) {
      camposActualizar.push('image = ?')
      valoresActualizar.push(image || null)
    }

    if (camposActualizar.length === 0) return null

    query += camposActualizar.join(', ') + ' WHERE user_id = ?'
    valoresActualizar.push(userId)

    const [result] = await pool.execute(query, valoresActualizar)
    return result
  }


}

export default User
