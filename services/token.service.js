import conexion from '../database/conexion.js'

export async function createToken(userid) {
    const code = Math.floor(100000 + Math.random() * 900000)
    const token = await conexion.query('INSERT INTO tokens(owner, code) VALUES($1, $2) RETURNING *', [userid, code])
    return token
}

export async function getToken(userid) {
    const token = await (await conexion.query('SELECT * FROM tokens WHERE owner=($1)', [userid])).rows[0]
    return token
}

export async function deleteTokens(userid) {
    const tokens = await conexion.query('DELETE FROM tokens WHERE owner=($1)', [userid])
    return tokens
}