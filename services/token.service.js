import conexion from '../database/conexion.js'

export async function createTokenEmailVerification(userid) {
    const code = Math.floor(100000 + Math.random() * 900000)
    const token = await conexion.query('INSERT INTO email_verification_tokens(owner, code) VALUES($1, $2) RETURNING *', [userid, code])
    return token
}

export async function getTokenEmailVerification(userid) {
    const token = await (await conexion.query('SELECT * FROM email_verification_tokens WHERE owner=($1)', [userid])).rows[0]
    return token
}

export async function deleteTokensEmailVerification(userid) {
    const tokens = await conexion.query('DELETE FROM email_verification_tokens WHERE owner=($1)', [userid])
    return tokens
}