import { StatusCodes } from 'http-status-codes';
import conexion from '../database/conexion.js'
import bcrypt from 'bcrypt'

const auth = async (req, res, next) => {
    if (req.session.tokenPsswd2) {
        const user_id = req.session.tokenPsswd2.iduser
        const password = req.session.tokenPsswd2.password
        const user = await (await conexion.query('SELECT id, email, full_nombre, telefono, nombre_usuario, password2, id_progenitor, id_sponsor FROM usuarios WHERE id=($1)', [user_id])).rows[0]
        const isPasswordMatch = await bcrypt.compare(password, user.password2)
        if (isPasswordMatch) {
            req.user = { id: user.id, email: user.email, telefono: user.telefono, nombre_usuario: user.nombre_usuario }
            next()
        }
        else res.status(StatusCodes.UNAUTHORIZED).send({ status: false, content: 'Incorrent password 2' })
    } else res.status(400).send({
        status: false,
        content: "enter your password 2"
    })
}

export default auth;