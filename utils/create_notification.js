import conexion from '../database/conexion.js'

async function create_notification(user_id, message) {
    const new_notification = await (await conexion.query('INSERT INTO notifications (owner, message) VALUES ($1, $2) RETURNING *', [user_id, message])).rows
    return new_notification
}


export default create_notification