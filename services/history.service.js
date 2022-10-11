import conexion from '../database/conexion.js'

export async function list_p2p(userid) {
    const username = await (await conexion.query('SELECT nombre_usuario FROM usuarios WHERE id=($1)', [userid])).rows[0]?.nombre_usuario
    const list = await (await conexion.query('SELECT * FROM history WHERE owner=($1) OR destinary_transfer=($2)', [userid, username])).rows
    return list
}