import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'
import { users, io } from '../index.js'
const create_order = async (seller_ticket_id, buyer_ticket_id, amount) => {
    const two_days_seconds = 3600
    const new_order = await (await conexion.query("INSERT INTO orders(ticket_seller_id, ticket_buyer_id, amount, created_at, deadline_seconds) VALUES ($1, $2, $3, $4, $5) RETURNING *", [seller_ticket_id, buyer_ticket_id, amount, new Date(), two_days_seconds])).rows[0]
    return new_order
}

const find_user = (user_id) => {
    const user = users.find(object => object.user_id === user_id)
    return user
}

export async function createTicket(data, userid) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    if (p2p_config.p2p_sells_fee && !data.id_hash_fee) return { status: false, content: 'Please send a hash of the commission payment' }
    const old_ticket = await (await conexion.query('SELECT * FROM tickets WHERE owner=($1) AND type=($2) AND status<>($3) AND status<>($4)', [userid, 'sell', 'finished', 'annulled'])).rows[0]
    if (old_ticket) return { status: false, content: `You already have an active selling ticket with id ${old_ticket.ticket_id}` }
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (!wallet) {
        await create_wallet(userid)
        return { status: false, content: "You don't have enough leals to continue" }
    }
    if (data.amount > wallet.balance) return { status: false, content: `You have not enough leals to continue, your available balance is ${wallet.balance}` }
    let fee = p2p_config.p2p_sells_fee ? p2p_config.p2p_sells_fee * data.amount / 1000 : 0
    const ticket_returning = await (await conexion.query("INSERT INTO tickets (amount, remain, type, created_at, owner, fee, id_hash_fee) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [data.amount, data.amount, 'sell', new Date(), userid, fee, data.id_hash_fee])).rows[0]
    const tickets_to_pair = await (await conexion.query('SELECT * FROM tickets WHERE owner<>($1) AND type=($2) AND remain>0 ORDER BY created_at', [userid, 'buy'])).rows
    let amount
    let new_ticket_seller_info
    let new_list_buyers_info = []
    let new_orders = []
    if (tickets_to_pair.length) {
        for (let i = 0; i < tickets_to_pair.length; i++) {
            const ticket_to_pair = tickets_to_pair[i];
            const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_returning.ticket_id])).rows[0]
            let new_ticket_buyer_info
            let new_order
            // ticket status must be updated (reminder)
            ticket_to_pair.remain <= ticket.remain ? amount = ticket_to_pair.remain : amount = ticket.remain
            if (amount <= 0) break;
            new_order = await create_order(ticket.ticket_id, ticket_to_pair.ticket_id, amount)

            const remain_buyer = ticket_to_pair.remain - amount
            const remain_seller = ticket.remain - amount

            if (ticket_to_pair.status === 'precompleted') {
                if (remain_buyer === 0) new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_buyer, ticket_to_pair.ticket_id])).rows[0]
                else new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET remain=($1) WHERE ticket_id=($2) RETURNING *', [remain_buyer, ticket_to_pair.ticket_id])).rows[0]
            } else if (ticket_to_pair.status === 'prefinished') {
                new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET remain=($1) WHERE ticket_id=($2) RETURNING *', [remain_buyer, ticket_to_pair.ticket_id])).rows[0]
            }
            else {
                if (remain_buyer === 0) new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_buyer, ticket_to_pair.ticket_id])).rows[0]
                else new_ticket_buyer_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['precompleted', remain_buyer, ticket_to_pair.ticket_id])).rows[0]
            }
            if (ticket.status === 'precompleted') {
                if (remain_seller === 0) new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_seller, ticket.ticket_id])).rows[0]
                else new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET remain=($1) WHERE ticket_id=($2) RETURNING *', [remain_seller, ticket.ticket_id])).rows[0]
            } else {
                if (remain_seller === 0) new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['completed', remain_seller, ticket.ticket_id])).rows[0]
                else new_ticket_seller_info = await (await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3) RETURNING *', ['precompleted', remain_seller, ticket.ticket_id])).rows[0]
            }

            const wallet_seller = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [ticket.owner])).rows[0]
            const new_seller_balance = wallet_seller.balance - amount
            const new_seller_balance_to_sell = wallet_seller.balance_to_sell + amount
            await conexion.query('UPDATE wallets SET balance=($1), balance_to_sell=($2) WHERE owner=($3)', [new_seller_balance, new_seller_balance_to_sell, ticket.owner])
            new_list_buyers_info.push(new_ticket_buyer_info)
            new_orders.push(new_order)
            const user = await find_user(ticket_to_pair.owner)
            if (user) io.sockets.to(user.socket_id).emit("new_order", { new_order, new_ticket_buyer_info, new_ticket_seller_info })

        }

    }
    return { status: true, content: "Ticket created successfully", new_orders, new_list_buyers_info, new_ticket_seller_info }
}

export async function listTickets() {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE type=($1) ORDER BY created_at', ['sell'])).rows
    return tickets
}

export async function searchTicket(ticket_id) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    return ticket
}

export async function getFee() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    return { status: true, content: { fee_percentage: p2p_config.p2p_sells_fee || 0 } }
}