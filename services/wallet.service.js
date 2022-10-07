import conexion from '../database/conexion.js'
import fix_number from '../utils/fix_number.js'
export async function wallet_info(userid) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    if (!wallet) return { ...await (await conexion.query('INSERT INTO wallets (owner) VALUES ($1) RETURNING *', [userid])).rows[0], leals_balance: "0.00" }
    const leals_balance = fix_number(wallet.balance / p2p_config.value_compared_usdt) || "0.00"
    wallet.balance = fix_number(wallet.balance) || "0.00"
    wallet.not_available = fix_number(wallet.not_available * p2p_config.value_compared_usdt) || "0.00"
    return { ...wallet, leals_balance }
}