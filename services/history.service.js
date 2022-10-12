import conexion from '../database/conexion.js'

export async function list_p2p(userid) {
    const username = await (await conexion.query('SELECT nombre_usuario FROM usuarios WHERE id=($1)', [userid])).rows[0]?.nombre_usuario
    const list = await (await conexion.query('SELECT * FROM history WHERE owner=($1) OR destinary_transfer=($2) ORDER BY date DESC', [userid, username])).rows
    const results = []
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let cash_flow = item.cash_flow
        if (item.history_type == 'transfer' && item.destinary_transfer == username) cash_flow = 'income'
        results.push({ ...item, cash_flow })
    }
    return results
}