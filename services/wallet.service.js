import conexion from '../database/conexion.js'

export async function wallet_info(userid) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    if (!wallet) return await (await conexion.query('INSERT INTO wallets (owner) VALUES ($1) RETURNING *', [userid])).rows[0]
    const usd_balance = wallet.balance / p2p_config.value_compared_usdt
    return { ...wallet, usd_balance }
}