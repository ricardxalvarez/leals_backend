import conexion from '../database/conexion.js'

export async function request_wihtdrawal(userid, amount) {
    const config = await (await conexion.query('SELECT withdrawal_minimum_amount FROM config')).rows[0]
    if (amount < config.withdrawal_minimum_amount) return { status: false, content: `The minimum amount to withdraw is ${config.withdrawal_minimum_amount}` }
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const user_info = await (await conexion.query('SELECT status_p2p, is_user_blocked_p2p, is_user_deleted FROM usuarios WHERE id=($1)', [userid])).rows[0]
    if (user_info?.is_user_blocked_p2p || user_info?.is_user_deleted) return { status: false, content: `You cannot make a withdrawal, because you have a sanction.` }
    const user_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if ((user_wallet?.balance / p2p_config.value_compared_usdt) < amount) return { status: false, content: 'You cannot withdrawl more balance than you have' }
    const new_balance = user_wallet.balance - amount * p2p_config.value_compared_usdt
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_balance, userid])
    const returning_withdrawal = await (await conexion.query('INSERT INTO withdrawals (owner, amount, requested_at) VALUES($1,$2,$3) RETURNING *', [userid, amount, new Date()])).rows[0]
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, widthdrawal_condition,currency, date, withdrawal_related) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', [userid, 'withdrawal', 'outcome', amount * p2p_config.value_compared_usdt, amount, 'processing', 'usdt', new Date(), returning_withdrawal.withdrawal_id])
    return { status: true, content: 'Your withdrawal is being processed!' }
}