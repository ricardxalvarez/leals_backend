import config from './config.js'
import { Strategy, ExtractJwt } from 'passport-jwt'
import conexion from '../database/conexion.js'
import bcrypt from 'bcrypt'
const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const verifyJwt = async (payload, done) => {
    try {
        const user = await (await conexion.query('SELECT * FROM admins LEFT JOIN usuarios ON admins.iduser = usuarios.id WHERE iduser=($1)', [payload.iduser])).rows[0]
        if (!user) {
            done(null, false)
        } else {
            const isPassword1Match = await bcrypt.compare(payload.password1, user.password1)
            if (isPassword1Match) {
                done(null, user)
            } else done(null, false)
        }
    } catch (error) {
        console.log(error);
        done(error, false);
    }
}

const jwt = new Strategy(jwtOptions, verifyJwt)

export default jwt;