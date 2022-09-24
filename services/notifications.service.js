import conexion from '../database/conexion.js'

export async function list(userid) {
    const notifications = await (await conexion.query('SELECT * FROM notifications WHERE owner=($1) ORDER BY date', [userid])).rows
    return notifications
}

export async function read(notification_id, user_id) {
    await conexion.query('UPDATE notifications SET read=($1) WHERE notification_id=($2) AND owner=($3)', [true, notification_id, user_id])
    return { status: true, content: 'Notification read' }
}

export async function read_all(user_id) {
    await conexion.query('UPDATE notifications SET read=($1) WHERE owner=($2)', [true, user_id])
    return { status: true, content: 'All notifications read' }
}

export async function delete_notification(notification_id, user_id) {
    await conexion.query('DELETE FROM notifications WHERE notification_id=($1) AND owner=($2)', [notification_id, user_id])
    return { status: true, content: 'Notification deleted successfully' }
}

export async function delete_all_notifications(user_id) {
    await conexion.query('DELETE FROM notifications WHERE owner=($1)', [user_id])
    return { status: true, content: 'Notifications deleted successfully' }
}