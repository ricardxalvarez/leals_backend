import conexion from '../database/conexion.js'
import { io } from '../index.js'
import { users } from '../index.js'
const create_order = async (seller_ticket_id, buyer_ticket_id, amount) => {
    const two_days_seconds = 3600 * 24
    const new_order = await (await conexion.query("INSERT INTO orders(ticket_seller_id, ticket_buyer_id, amount, created_at, deadline_seconds) VALUES ($1, $2, $3, $4, $5) RETURNING *", [seller_ticket_id, buyer_ticket_id, amount, new Date(), two_days_seconds])).rows[0]
    return new_order
}

const find_user = (user_id) => {
    const user = users.find(object => object.user_id === user_id)
    return user
}

export async function createTicket(data, userid) {
    const packag = await (await conexion.query("SELECT * FROM packages WHERE package_id=($1)", [data.package_id])).rows[0]
    if (!packag) return { status: false, content: 'You selected a non valid package' }
    const ticket = await (await conexion.query("INSERT INTO tickets (amount, remain, type, created_at, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *", [packag.leals_quantity, packag.leals_quantity, 'buy', new Date(), userid])).rows[0]
    const ticket_to_pair = await (await conexion.query('SELECT * FROM tickets WHERE owner<>($1) AND type=($2) AND (status=($3) OR status=($4)) ORDER BY created_at', [userid, 'sell', 'pending', 'precompleted'])).rows[0]
    let new_order
    let amount
    let new_ticket_buyer_info
    let new_ticket_seller_info
    if (ticket_to_pair) {
        ticket.remain <= ticket_to_pair.remain ? amount = ticket.remain : amount = ticket_to_pair.remain
        new_order = await create_order(ticket_to_pair.ticket_id, ticket.ticket_id, amount)
        const remain_buyer = ticket.remain - amount
        const remain_seller = ticket_to_pair.remain - amount
        if (ticket.status === 'precompleted') {
            if (remain_buyer === 0) new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_buyer, ticket.ticket_id])).rows[0]
            else new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET remain=($1) WHERE ticket_id=($2) RETURNING *', [remain_buyer, ticket.ticket_id])).rows[0]
        } else {
            if (remain_buyer === 0) new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_buyer, ticket.ticket_id])).rows[0]
            else new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['precompleted', remain_buyer, ticket.ticket_id])).rows[0]
        }
        if (ticket_to_pair.status === 'precompleted') {
            if (remain_seller === 0) new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_seller, ticket_to_pair.ticket_id])).rows[0]
            else new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET remain=($1) WHERE ticket_id=($2) RETURNING *', [remain_seller, ticket_to_pair.ticket_id])).rows[0]
        } else {
            if (remain_seller === 0) new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_seller, ticket_to_pair.ticket_id])).rows[0]
            else new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['precompleted', remain_seller, ticket_to_pair.ticket_id])).rows[0]
        }
        const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [ticket_to_pair.owner])).rows[0]
        const new_seller_balance = wallet.balance - amount
        const new_seller_balance_to_sell = wallet.balance_to_sell + amount
        await conexion.query('UPDATE wallets SET balance=($1), balance_to_sell=($2) WHERE owner=($3)', [new_seller_balance, new_seller_balance_to_sell, ticket_to_pair.owner])
        const user = await find_user(ticket_to_pair.owner)
        if (user) io.sockets.to(user.socket_id).emit("new_order", { new_order, new_ticket_buyer_info, new_ticket_seller_info })
    }
    return { status: true, content: "Ticket created successfully", new_order, new_ticket_buyer_info, new_ticket_seller_info }
}

export async function listTickets(type = 'sell') {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE type=($1) ORDER BY created_at', [type])).rows
    return tickets
}

export async function searchTicket(ticket_id) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    return ticket
}