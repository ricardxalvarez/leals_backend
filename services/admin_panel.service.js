import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'
export async function add_balance(userid, amount) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    if (!wallet) await create_wallet(userid)
    const new_amount = wallet?.balance ? wallet.balance + amount : amount
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_amount, userid])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, currency, date) VALUES($1,$2,$3,$4,$5,$6,$7)', [userid, 'balance add', 'income', amount, amount / p2p_config.value_compared_usdt, 'usdt', new Date()])
    return { status: true, content: 'Balance updated' }
}

export async function clean() {
    await conexion.query('DELETE FROM orders')
    await conexion.query('ALTER SEQUENCE orders_order_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM tickets')
    await conexion.query('ALTER SEQUENCE tickets_ticket_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM wallets')
    await conexion.query('DELETE FROM history')
    await conexion.query('DELETE FROM notifications')
    await conexion.query('UPDATE usuarios SET status_p2p=($1)', ['inactive'])
    await conexion.query('UPDATE p2p_config SET initial_split=($1), split=($1)', [100000])
    return { status: true, content: 'Cleaned' }
}

export async function approve_advertise(advertise_id) {
    const ad = await (await conexion.query('UPDATE advertises SET status=($1) WHERE advertise_id=($2) RETURNING *', ['approved', advertise_id])).rows[0]
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [ad.owner, 'Excellent work, your ad was registered successfully', new Date()])
    return { status: true, content: 'Advertise succesfully approved' }
}

export async function deny_advertise(advertise_id) {
    const ad = await (await conexion.query('UPDATE advertises SET status=($1) WHERE advertise_id=($2) RETURNING *', ['denied', advertise_id])).rows[0]
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [ad.owner, 'We are very sorry your ad was not processed', new Date()])
    return { status: true, content: 'Advertise succesfully denied' }
}

export async function approve_withdrawal(withdrawal_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['successful', withdrawal_id])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, widthdrawal_condition,currency) VALUES($1,$2,$3,$4,$5,$6)', [withdrawal_request.owner, 'withdrawal', 'outcome', withdrawal_request.amount, 'successful', 'usdt'])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.id, `Your withdrawal has already been processed to the leals address you provided. Amount: ${withdrawal_request.amount / p2p_config.value_compared_usdt} leals`])
    return { status: true, content: 'Withdrawal succesfully approved' }
}

export async function deny_withdrawal(withdrawal_id) {
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['successful', withdrawal_id])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, widthdrawal_condition,currency) VALUES($1,$2,$3,$4,$5,$6)', [withdrawal_request.owner, 'withdrawal', 'outcome', withdrawal_request.amount, 'successful', 'usdt'])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.id, `We are very sorry your withdrawal was not processed`])
    return { status: true, content: 'Withdrawal succesfully denied' }
}