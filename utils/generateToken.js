import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const generateToken = (user) => {
    const token = jwt.sign(
        {
            iduser: user.id,
            password1: user.password1,
            password2: user.password2,
            nombre_usuario: user.nombre_usuario
        },
        config.jwt.secret);
    return token;
};

export default generateToken;