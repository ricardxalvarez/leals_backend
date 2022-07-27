import conexion from '../database/conexion.js'

export async function createToken(userid) {
    const token = await conexion.query('INSERT INTO tokens(owner) VALUES($1)', [userid])
    return token
}

export async function getToken(userid) {
    const token = await (await conexion.query('SELECT * FROM tokens WHERE owner=($1)', [userid])).rows[0]
    return token
}