import conexion from '../database/conexion.js'

export async function split_info(user_id) {
    const split = await (await conexion.query('SELECT split FROM p2p_config')).rows[0]?.split
    const network_shopping_array = await (await conexion.query('SELECT amount FROM orders WHERE status=($1)', ['successfull'])).rows
    const network_shopping = network_shopping_array.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const network_withdrawls = 0
    const my_buys = await (await conexion.query('SELECT orders.amount, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_buyer_id WHERE orders.status=($1) AND tickets.owner=($2)', ['successfull', user_id])).rowCount
    const my_sells = await (await conexion.query('SELECT orders.amount, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id WHERE orders.status=($1) AND tickets.owner=($2)', ['successfull', user_id])).rowCount
    const content = {
        split,
        network_shopping,
        network_withdrawls,
        my_buys,
        my_sells
    }
    return { status: true, content }
}