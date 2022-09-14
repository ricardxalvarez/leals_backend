import conexion from '../database/conexion.js'

export async function wallet_info(userid) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (!wallet) return await conexion.query('INSERT INTO wallets (owner) VALUES ($1)', [userid])
    return wallet
}