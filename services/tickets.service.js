import conexion from '../database/conexion.js'

export async function listTickets(userid) {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows
    return tickets
}

export async function cancelTicket(ticket_id, userid) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    if (ticket.status !== 'pending') return { status: false, content: 'Ticket already matched' }
    if (ticket.owner !== userid) return { status: false, content: "You are not the owner of this ticket" }
    await conexion.query('DELETE FROM tickets WHERE ticket_id=($1)', [ticket_id])
    return { status: true, content: 'Ticket successfully cancelled' }
}