import conexion from '../database/conexion.js'

export async function list_p2p(userid) {
    const list = await (await conexion.query('SELECT * FROM history WHERE owner=($1)', [userid])).rows
    return list
}