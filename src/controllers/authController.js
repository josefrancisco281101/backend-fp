import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/config.js';

class AuthController {
    static async login (req, res) {
        try {
            const {username, password} = req.body;
            
            const user = await User.findOne('username', username);
            
            if (!user) return res.status(404).json({message: 'No se encontro el usuario'});

            const esValida =  bcrypt.compare(password, user.password);
            if (!esValida) return res.status(401).json({message: 'Credenciales incorrecta'});

            const token = jwt.sign({userId: user.user_id}, SECRET_KEY, {expiresIn: '1h'});
            res.json({ message: 'Inicio de sesión exitoso', token })
                        
        } catch (error) {
            console.log(error)
            res.status(500).json({message: error.message})
        }
    }
static async me (req, res) {
    try {
    delete req.user.password;
    res.json(req.user);
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}

static async register (req, res) {

    // console.log(req.body)


    try {
        const {fName, lName, username, email, password, role, image} = req.body;

        if (!fName || !lName || !username || !email || !password || !role) return res.status(400).json({ message: 'Faltan datos' });

        // const image = req.file ? req.file.filename : null

        const user = await User.create({fName, lName, username, email, password, image, role});

        console.log(user)
        delete user.password;
        res.status(201).json({message: 'Usuario creado', data: user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

}

export default AuthController