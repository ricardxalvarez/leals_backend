import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'

const create_order = async (seller_ticket_id, buyer_ticket_id, amount) => {
    const two_days_seconds = 3600 * 24
    const new_order = await (await conexion.query("INSERT INTO orders(ticket_seller_id, ticket_buyer_id, amount, created_at, deadline_seconds) VALUES ($1, $2, $3, $4, $5) RETURNING *", [seller_ticket_id, buyer_ticket_id, amount, new Date(), two_days_seconds])).rows[0]
    return new_order
}

export async function createTicket(data, userid) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (!wallet) {
        await create_wallet(userid)
        return { status: false, content: "You don't have enough leals to continue" }
    }
    if (data.amount > wallet.balance) return { status: false, content: `You have not enough leals to continue, your available balance is ${wallet.balance}` }
    const ticket = await (await conexion.query("INSERT INTO tickets (amount, remain, type, created_at, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *", [data.amount, data.amount, 'sell', new Date(), userid])).rows[0]
    const ticket_to_pair = await (await conexion.query('SELECT * FROM tickets WHERE owner<>($1) AND type=($2) ORDER BY created_at', [userid, 'buy'])).rows[0]
    let new_order
    let amount
    if (ticket_to_pair) {
        // ticket status must be updated (reminder)
        ticket_to_pair.remain <= ticket.remain ? amount = ticket_to_pair.remain : amount = ticket.remain
        new_order = await create_order(ticket.ticket_id, ticket_to_pair.ticket_id, amount)
    }
    return { status: true, content: "Ticket created successfully", new_order }
}

export async function listTickets() {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE type=($1) ORDER BY created_at', ['sell'])).rows
    return tickets
}

export async function searchTicket(ticket_id) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    return ticket
}