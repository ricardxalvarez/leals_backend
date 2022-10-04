import conexion from '../database/conexion.js'

export async function split_info(user_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const network_shopping_array = await (await conexion.query('SELECT amount FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'buy'])).rows
    const network_seller_array = await (await conexion.query('SELECT amount FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'sell'])).rows
    const network_shopping = network_shopping_array.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const network_seller = network_seller_array.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const network_withdrawls = 0
    const my_buys = await (await conexion.query('SELECT orders.amount, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_buyer_id WHERE orders.status=($1) AND tickets.owner=($2)', ['successfull', user_id])).rowCount
    const my_sells = await (await conexion.query('SELECT orders.amount, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id WHERE orders.status=($1) AND tickets.owner=($2)', ['successfull', user_id])).rowCount
    const my_withdrawls = 0
    const pack = await (await conexion.query('SELECT amount FROM tickets WHERE owner=($1) AND type=($2)', [user_id, 'buy'])).rows[0]?.amount * p2p_config.value_compared_usdt || 0
    const split_remain = p2p_config.initial_split - p2p_config.split
    const percentage_split_available = 100 * Math.abs((p2p_config.initial_split - split_remain) / ((p2p_config.initial_split - split_remain / 2)))
    const content = {
        available_split: p2p_config.split,
        network_shopping,
        network_withdrawls,
        my_buys,
        my_sells,
        my_withdrawls,
        price: p2p_config.value_compared_usdt,
        pack,
        network_seller,
        percentage_split_available
    }
    return { status: true, content }
}