import conexion from '../database/conexion.js'

export async function listTickets(userid) {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const results = []
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const usdt_amount = ticket.amount * p2p_config.value_compared_usdt
        results.push({ ...ticket, usdt_amount })
    }
    return results
}

export async function cancelTicket(ticket_id, userid) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    if (!ticket) return { status: false, content: 'This ticket does not exist' }
    if (ticket.status !== 'pending') return { status: false, content: 'Ticket already matched' }
    console.log(ticket)
    console.log(userid)
    if (ticket.owner !== userid) return { status: false, content: "You are not the owner of this ticket" }
    await conexion.query('DELETE FROM tickets WHERE ticket_id=($1)', [ticket_id])
    return { status: true, content: 'Ticket successfully cancelled' }
}