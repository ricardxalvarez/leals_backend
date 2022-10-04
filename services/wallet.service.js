import conexion from '../database/conexion.js'
import fix_number from '../utils/fix_number.js'
export async function wallet_info(userid) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    if (!wallet) return { ...await (await conexion.query('INSERT INTO wallets (owner) VALUES ($1) RETURNING *', [userid])).rows[0], usd_balance: 0 }
    const usd_balance = fix_number(wallet.balance * p2p_config.value_compared_usdt) || 0
    wallet.balance = fix_number(wallet.balance) || 0
    wallet.not_available = fix_number(wallet.not_available) || 0
    return { ...wallet, usd_balance }
}