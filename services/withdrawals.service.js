import conexion from '../database/conexion.js'

export async function request_wihtdrawal(userid, amount) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const user_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if ((user_wallet?.balance / p2p_config.value_compared_usdt) < amount) return { status: false, content: 'You cannot withdrawl more balance than you have' }
    const new_balance = user_wallet.balance - amount * p2p_config.value_compared_usdt
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_balance, userid])
    await conexion.query('INSERT INTO withdrawals (owner, amount, requested_at) VALUES($1,$2,$3)', [userid, amount, new Date()])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, widthdrawal_condition,currency) VALUES($1,$2,$3,$4,$5,$6)', [userid, 'withdrawal', 'outcome', amount, 'processing', 'usdt'])
    return { status: true, content: 'Your withdrawal is being processed!' }
}