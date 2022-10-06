import conexion from '../database/conexion.js'

export async function listTickets(userid) {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows
    return tickets
}

export async function cancelTicket(ticket_id, userid) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    if (!ticket) return { status: false, content: 'This ticket does not exist' }
    if (ticket.status !== 'pending') return { status: false, content: 'Ticket already matched' }
    if (ticket.owner !== userid) return { status: false, content: "You are not the owner of this ticket" }
    if (ticket.type === 'sell') {
        const user_wallet = await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [ticket.owner])
        const new_balance_to_sell = user_wallet.balance_to_sell - ticket.amount
        const new_balance = user_wallet.balance + ticket.amount
        await conexion.query('UPDATE wallets SET balance_to_sell=($1), balance=($2) WHERE owner=($3)', [new_balance_to_sell, new_balance, ticket.owner])
    }
    if (ticket.type === 'buy') {
        await conexion.query('UPDATE usuarios SET status_p2p=($1) WHERE id=($2)', ['inactive', userid])
    }
    await conexion.query('DELETE FROM tickets WHERE ticket_id=($1)', [ticket_id])
    return { status: true, content: 'Ticket successfully cancelled' }
}