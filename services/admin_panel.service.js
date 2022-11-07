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
    await conexion.query('DELETE FROM withdrawals')
    await conexion.query('DELETE FROM transfers')
    return { status: true, content: 'Cleaned' }
}

export async function list_withdrawals() {
    const withdrawals = await (await conexion.query('SELECT * FROM withdrawals')).rows
    return withdrawals
}

export async function handle_switches(data) {
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    switch (data) {
        case data.sell:
            await conexion.query('UPDATE config SET is_selling_active=($1)', [!config.is_selling_active])
            break;
        case data.buy:
            await conexion.query('UPDATE config SET is_buying_active=($1)', [!config.is_buy_active])
            break;
        case data.register:
            await conexion.query('UPDATE config SET is_registering_active=($1)', [!config.is_registering_active])
            break;
    }
}

export async function update_commissions_rules(list) {
    await conexion.query('UPDATE p2p_config SET rules_commissions=($1)', [list])
}

export async function update_rules_ads(list) {
    await conexion.query('UPDATE p2p_config SET rules_ads=($1)', [list])
}

export async function get_home_page() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    const p2p_buys = await (await conexion.query('SELECT * FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'buy'])).rows
    const p2p_sells = await (await conexion.query('SELECT * FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'sell'])).rows
    const p2p_buys_amount_usdt = p2p_buys.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const p2p_buys_amount_leals = p2p_buys_amount_usdt / p2p_config.value_compared_usdt
    const p2p_sells_amount_usdt = p2p_sells.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const p2p_sells_amount_leals = p2p_sells_amount_usdt / p2p_config.value_compared_usdt
    const p2p_buys_users = new Set(...p2p_buys.map(object => object.owner)).size
    const p2p_sells_users = new Set(...p2p_sells.map(object => object.owner)).size
    return {
        ...config,
        p2p_buys: p2p_buys.length,
        p2p_sells: p2p_sells.length,
        p2p_buys_amount_usdt,
        p2p_buys_amount_leals,
        p2p_sells_amount_usdt,
        p2p_sells_amount_leals,
        p2p_buys_users,
        p2p_sells_users
    }
}

export async function get_p2p_settings_page() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    const penalty_fees = await (await conexion.query('SELECT * FROM penalty_fees')).rows[0]
    const packages = await (await conexion.query('SELECT * FROM packages')).rows
    return {
        ...p2p_config,
        ...config,
        ...penalty_fees,
        packages
    }
}

export async function update_earnings_stop(new_stop) {
    await conexion.query('UPDATE p2p_config SET not_available_earnings_stop=($1)', [new_stop])
}

export async function update_pealties_address(new_address) {
    await conexion.query('UPDATE penalty_fees SET usdt_address_penalty=($1)', [new_address])
}

export async function update_fees_address(new_address) {
    await conexion.query('UPDATE penalty_fees SET usdt_address_fees=($1)', [new_address])
}

export async function update_sending_time_hash(new_time) {
    await conexion.query('UPDATE p2p_config SET sending_time_hash_seconds=($1)', [new_time])
}

export async function update_penalty_fee(new_fee) {
    await conexion.query('UPDATE penalty_fees SET amount_penalty=($1)', [new_fee])
}

export async function update_wthdrawal_sell_minimun_amount(new_amount) {
    await conexion.query('UPDATE config SET wthdrawal_sell_minimun_amount=($1)', [new_amount])
}

// withdrawals

export async function approve_withdrawal(withdrawal_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['successful', withdrawal_id])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, widthdrawal_condition,currency) VALUES($1,$2,$3,$4,$5,$6)', [withdrawal_request.owner, 'withdrawal', 'outcome', withdrawal_request.amount * p2p_config.value_compared_usdt, withdrawal_request.amount, 'successful', 'usdt'])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.owner, `Your withdrawal has already been processed to the leals address you provided. Amount: ${withdrawal_request.amount / p2p_config.value_compared_usdt} leals`, new Date()])
    return { status: true, content: 'Withdrawal succesfully approved' }
}

export async function deny_withdrawal(withdrawal_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['successful', withdrawal_id])
    await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, widthdrawal_condition,currency) VALUES($1,$2,$3,$4,$5,$6,$7)', [withdrawal_request.owner, 'withdrawal', 'outcome', withdrawal_request.amount * p2p_config.value_compared_usdt, withdrawal_request.amount, 'successful', 'usdt'])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.owner, `We are very sorry your withdrawal was not processed`], new Date())
    return { status: true, content: 'Withdrawal succesfully denied' }
}

export async function list_by_status(status) {
    const withdrawals = await (await conexion.query('SELECT * FROM withdrawals WHERE status=($1) ORDER BY requested_at DESC', [status])).rows
    return withdrawals
}

export async function get_withdrawal_by_requester(username) {
    const withdrawals = await (await conexion.query('SELECT * FROM withdrawals INNER JOIN usuarios ON usuarios.id = withdrawals.owner WHERE usuarios.nombre_usuario=($1) ORDER BY requested_at DESC', [username])).rows
    return withdrawals
}

export async function get_withdrawal_info(withdrawal_id) {
    const withdrawal = await (await conexion.query('SELECT * FROM withdrawals INNER JOIN usuarios ON usuarios.id = withdrawals.owner WHERE withdrawal_id=($1) ORDER BY requested_at DESC', [withdrawal_id])).rows[0]
    return withdrawal
}

// advertises

export async function list_advertises(status) {
    const advertises = await (await conexion.query('SELECT * FROM advertises WHERE status=($1) ORDER BY created_at DESC', [status])).rows
    return advertises
}

export async function get_advertise_info(advertise_id) {
    const advertise = await (await conexion.query('SELECT * FROM advertises INNER JOIN usuarios ON usuarios.id = advertises.owner WHERE advertise_id=($1)', [advertise_id])).rows[0]
    return advertise
}

export async function get_advertises_by_username(username) {
    const advertises = await (await conexion.query('SELECT * advertises INNER JOIN usuarios ON usuarios.id = advertises.owner WHERE usuarios.nombre_usuario=($1) ORDER BY created_at DESC', [username])).rows
    return advertises
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