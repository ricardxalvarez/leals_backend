import conexion from '../database/conexion.js'

export async function post_advertise(userid, post_link) {
    const same_link = await (await conexion.query('SELECT * FROM advertises WHERE post_link=($1)', [post_link])).rows[0]
    if (same_link) return { status: false, content: 'the URL is already used by another user' }
    const last_advertise = await (await conexion.query('SELECT * FROM advertises WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows[0]
    const is_user_able_to_post = ((new Date().getTime() - new Date(last_advertise?.created_at).getTime()) / 1000) > 360
    if (!is_user_able_to_post) return { status: false, content: 'You are not still able to publish a new URL, please wait 6 hours after the last one' }
    await conexion.query('INSERT INTO advertises (owner, post_link, created_at) VALUES ($1, $2, $3)', [userid, post_link, new Date()])
    return { stats: true, content: 'Your advertise is being reviewed, this might take a while' }
}

export async function list_advertises(userid) {
    const advertises = await (await conexion.query('SELECT * FROM advertises WHERE owner=($1) ORDER BY created_at DESC', [userid])).rows
    return advertises
}