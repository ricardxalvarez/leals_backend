import conexion from '../database/conexion.js'

async function orders_date_limit() {
    setInterval(() => {
        loop()
    }, 1000)
    async function loop() {
        const orders = await (await conexion.query('SELECT * FROM orders WHERE status=($1)', ['hashless'])).rows
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];

            // if deadline_seconds_remain is less than 0, means that deadline time has expired
            const deadline_seconds_remain = (((new Date().getTime() - new Date(order.created_at).getTime()) / 1000) - order.deadline_seconds) * -1

            if (deadline_seconds_remain <= 0) {
                await conexion.query('UPDATE orders SET status=($1) WHERE order_id=($2)', ['cancelled', order.order_id])
                await conexion.query('UPDATE tickets SET status=($1) WHERE ticket_id=($2)', ['annulled', order.ticket_buyer_id])
                const sell_tickets_involved = await (await conexion.query('SELECT order_id, ticket_seller_id, amount FROM orders WHERE ticket_buyer_id=($1)', [order.ticket_buyer_id])).rows
                for (let i = 0; i < sell_tickets_involved.length; i++) {
                    const order_involved = sell_tickets_involved[i];
                    const old_seller_ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [order_involved.ticket_seller_id])).rows[0]
                    const new_seller_remain = old_seller_ticket.remain + order_involved.amount
                    let new_seller_ticket_status = old_seller_ticket.status
                    if (old_seller_ticket.status === 'prefinished' && new_seller_remain == old_seller_ticket.amount) new_seller_ticket_status = 'pending'
                    if (old_seller_ticket.status === 'prefinished' && new_seller_remain != old_seller_ticket.amount) new_seller_ticket_status = 'precompleted'
                    if (old_seller_ticket.status === 'completed' && new_seller_remain == old_seller_ticket.amount) new_seller_ticket_status = 'pending'
                    if (old_seller_ticket.status === 'completed' && new_seller_remain != old_seller_ticket.amount) new_seller_ticket_status = 'precompleted'
                    if (old_seller_ticket.status === 'precompleted' && new_seller_remain == old_seller_ticket.amount) new_seller_ticket_status = 'pending'
                    await conexion.query('UPDATE tickets SET status=($1), remain=($2) WHERE ticket_id=($3)', [new_seller_ticket_status, new_seller_remain, order_involved.ticket_seller_id])
                }
            }
        }
    }
}

export default orders_date_limit