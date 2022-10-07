import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'
export async function add_balance(userid, amount) {
    const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (!wallet) await create_wallet(userid)
    const new_amount = wallet?.balance ? wallet.balance + amount : amount
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_amount, userid])
    return { status: true, content: 'Balance updated' }
}

export async function clean() {
    await conexion.query('DELETE FROM orders')
    await conexion.query('ALTER SEQUENCE orders_order_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM tickets')
    await conexion.query('ALTER SEQUENCE tickets_ticket_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM wallets')
    return { status: true, content: 'Cleaned' }
}

export async function approve_advertise(advertise_id) {
    await conexion.query('UPDATE advertises SET status=($1) WHERE advertise_id=($2)', ['approved', advertise_id])
    return { status: true, content: 'Advertise succesfully approved' }
}