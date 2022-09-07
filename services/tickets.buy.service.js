import conexion from '../database/conexion.js'

export async function createTicket(data, userid) {
    // tickets for emparejamiento
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE owner<>($1) AND type=($2) ORDER BY created_at', [userid, 'sell'])).rows
    const packag = await (await conexion.query("SELECT * FROM packages WHERE package_id=($1)", [data.package_id])).rows[0]
    if (!packag) return { status: false, content: 'You selected a non valid package' }
    await conexion.query("INSERT INTO tickets (amount, remain, type, created_at, owner) VALUES ($1, $2, $3, $4, $5)", [packag.leals_quantity, packag.leals_quantity, 'buy', new Date(), userid])
    return { status: true, content: "Ticket created successfully" }
}

export async function listTickets() {
    const tickets = await (await conexion.query('SELECT * FROM tickets WHERE type=($1)', ['buy'])).rows
    return tickets
}

export async function searchTicket(ticket_id) {
    const ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [ticket_id])).rows[0]
    return ticket
}