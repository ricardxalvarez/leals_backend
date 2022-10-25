import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'

export async function create_transfer(userid, data) {
    const transferer_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (!transferer_wallet) {
        await create_wallet(userid)
        return { status: false, content: 'You have not enough balance to continue' }
    }
    if (transferer_wallet.balance < data.amount) return { statsus: false, content: `You have not enough balance to continue, balance available is ${transferer_wallet.balance}` }
    const destinary = await (await conexion.query('SELECT id FROM usuarios WHERE nombre_usuario=($1)', [data.destinary])).rows[0]
    if (!destinary) return { status: true, content: 'There is no such a user with this username' }
    const destinary_wallet = await (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [destinary.id])).rows[0]
    if (!destinary_wallet) await create_wallet(destinary.id)
    const destinary_wallet_new_amount = destinary_wallet ? destinary_wallet.balance + data.amount : data.amount
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [destinary_wallet_new_amount])
    const transferer_new_balance = transferer_wallet.balance - data.amount
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [transferer_new_balance])
    return { status: true, content: 'Transfer successfully created' }
}