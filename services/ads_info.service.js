import conexion from '../database/conexion.js'

export async function get_ads_info() {
    const info = await (await conexion.query('SELECT * FROM ads_info')).rows[0]
    return { status: true, content: info }
}