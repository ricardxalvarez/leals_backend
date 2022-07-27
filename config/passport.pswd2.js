import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import conexion from '../database/conexion.js'

const verifyPassword2 = async (username, password, done) => {
    try {
        const user = await (await conexion.query('SELECT * FROM usuarios WHERE nombre_usuario=($1)', [username])).rows[0]
        const isPasswordMatch = bcrypt.compare(password, user.password2)
        if (isPasswordMatch) {
            done(null, user)
        } else done('invalid password', false)
    } catch (error) {
        done(error, false)
    }
}

const passportPswd2 = new Strategy({}, verifyPassword2)

export default passportPswd2;