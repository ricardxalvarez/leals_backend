import conexion from '../database/conexion.js'

async function create_wallet(userid) {
    await conexion.query('INSERT INTO wallets (owner) VALUES($1)', [userid])
}

export default create_wallet