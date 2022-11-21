import conexion from '../database/conexion.js'

export async function split_info(user_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const network_shopping_array = await (await conexion.query('SELECT amount FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'buy'])).rows
    const network_seller_array = await (await conexion.query('SELECT amount FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'sell'])).rows
    const network_shopping = network_shopping_array.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) * p2p_config.not_available_earnings_stop
    const network_seller = network_seller_array.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) / p2p_config.value_compared_usdt
    const network_withdrawals = await (await conexion.query('SELECT amount FROM withdrawals WHERE status=($1)', ['successful'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) / p2p_config.value_compared_usdt
    const my_buys = await (await conexion.query('SELECT * FROM tickets WHERE tickets.status=($1) AND tickets.owner=($2) AND tickets.type=($3)', ['finished', user_id, 'buy'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) * p2p_config.not_available_earnings_stop / p2p_config.value_compared_usdt
    const my_sells = await (await conexion.query('SELECT * FROM tickets WHERE tickets.status=($1) AND tickets.owner=($2) AND tickets.type=($3)', ['finished', user_id, 'sell'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) / p2p_config.value_compared_usdt
    const my_withdrawals = await (await conexion.query('SELECT amount FROM withdrawals WHERE owner=($1) AND status=($2)', [user_id, 'successful'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) / p2p_config.value_compared_usdt
    const pack = await (await conexion.query('SELECT amount FROM tickets WHERE owner=($1) AND type=($2) AND status=($3)', [user_id, 'buy', 'finished'])).rows[0]?.amount || 0
    const user_p2p_status = await (await conexion.query('SELECT status_p2p FROM usuarios WHERE id=($1)', [user_id])).rows[0]?.status_p2p
    const available_split = (p2p_config.initial_split - network_shopping)
    const percentage_split_available = 100 * available_split / p2p_config.initial_split
    const content = {
        available_split: available_split / p2p_config.value_compared_usdt,
        network_shopping: network_shopping / p2p_config.value_compared_usdt,
        network_withdrawals,
        my_buys,
        my_sells,
        my_withdrawals,
        price: p2p_config.value_compared_usdt,
        pack: user_p2p_status == 'active' ? pack : 'null',
        network_seller,
        percentage_split_available
    }
    return { status: true, content }
}