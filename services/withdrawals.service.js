import conexion from '../database/conexion.js'

export async function request_wihtdrawal(userid, amount) {
    const user_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    if (user_wallet?.balance < amount) return { status: false, content: 'You cannot withdrawl more balance than you have' }
    const new_balance = user_wallet.balance - amount
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_balance, userid])
    await conexion.query('INSERT INTO withdrawals (owner, amount, requested_at) VALUES($1,$2,$3)', [userid, amount, new Date()])
    return { status: true, content: 'Your withdrawal is being processed!' }
}