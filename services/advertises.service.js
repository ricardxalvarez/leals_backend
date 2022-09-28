import conexion from '../database/conexion.js'

export async function post_advertise(userid, post_link) {
    const new_advertise = await conexion.query('INSERT INTO advertises (owner, post_link, created_at) VALUES ($1, $2, $3)', [userid, post_link, new Date()])
    return { stats: true, content: 'Your advertise is being reviewed, this might take a while' }
}

export async function list_advertises(userid) {
    const advertises = await (await conexion.query('SELECT * FROM advertises WHERE owner=($1)', [userid])).rows
    return advertises
}