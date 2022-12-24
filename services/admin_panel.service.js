import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js'
import get_countryname_by_id from '../utils/get_countryname_by_id.js'
import get_currency_by_id from '../utils/get_currency_by_id.js'
import resizeImageBase64 from '../utils/resizeImageBase64.js'
export async function add_balance(list, amount) {
    for (let i = 0; i < list.length; i++) {
        const userid = list[i];
        const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
        const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
        if (!wallet) await create_wallet(userid)
        const new_amount = wallet?.balance ? wallet.balance + amount : amount
        await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_amount, userid])
        await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, currency, date) VALUES($1,$2,$3,$4,$5,$6,$7)', [userid, 'balance add', 'income', amount, amount / p2p_config.value_compared_usdt, 'usdt', new Date()])
    }
    return { status: true, content: 'Balance updated' }
}

export async function decrease_balance(list, amount) {
    let users_balanced_decreased = 0
    for (let i = 0; i < list.length; i++) {
        const userid = list[i];
        const wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
        const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
        if (!wallet) continue;
        if (amount > wallet.balance) continue;
        const new_amount = wallet.balance - amount
        await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [new_amount, userid])
        await conexion.query('INSERT INTO history (owner, history_type, cash_flow, amount, leals_amount, currency, date) VALUES($1,$2,$3,$4,$5,$6,$7)', [userid, 'balance decreased', 'outcome', amount, amount / p2p_config.value_compared_usdt, 'usdt', new Date()])
        users_balanced_decreased++
    }
    return { status: true, content: `Balance decreased to ${users_balanced_decreased} users` }
}

export async function clean() {
    await conexion.query('DELETE FROM orders')
    await conexion.query('ALTER SEQUENCE orders_order_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM tickets')
    await conexion.query('ALTER SEQUENCE tickets_ticket_id_seq RESTART WITH 1')
    await conexion.query('DELETE FROM wallets')
    await conexion.query('DELETE FROM history')
    await conexion.query('DELETE FROM notifications')
    await conexion.query('UPDATE usuarios SET status_p2p=($1)', ['inactive'])
    await conexion.query('UPDATE p2p_config SET initial_split=($1)', [100000])
    await conexion.query('DELETE FROM withdrawals')
    await conexion.query('DELETE FROM transfers')
    await conexion.query('DELETE FROM advertises')
    return { status: true, content: 'Cleaned' }
}


export async function handle_switches(query) {
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    switch (query) {
        case 'sell':
            await conexion.query('UPDATE config SET is_selling_active=($1)', [!config.is_selling_active])
            break;
        case 'buy':
            await conexion.query('UPDATE config SET is_buying_active=($1)', [!config.is_buy_active])
            break;
        case 'register':
            await conexion.query('UPDATE config SET is_registering_active=($1)', [!config.is_registering_active])
            break;
    }
}

export async function update_commissions_rules(list) {
    await conexion.query('UPDATE p2p_config SET rules_commissions=($1)', [list])
}

export async function update_rules_ads(list) {
    await conexion.query('UPDATE p2p_config SET rules_ads=($1)', [list])
}

export async function get_home_page() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    const p2p_buys = await (await conexion.query('SELECT * FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'buy'])).rows
    const p2p_sells = await (await conexion.query('SELECT * FROM tickets WHERE status=($1) AND type=($2)', ['finished', 'sell'])).rows
    const p2p_buys_amount_usdt = p2p_buys.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const p2p_buys_amount_leals = p2p_buys_amount_usdt / p2p_config.value_compared_usdt
    const p2p_sells_amount_usdt = p2p_sells.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const p2p_sells_amount_leals = p2p_sells_amount_usdt / p2p_config.value_compared_usdt
    const p2p_buys_users = new Set(...p2p_buys.map(object => object.owner)).size
    const p2p_sells_users = new Set(...p2p_sells.map(object => object.owner)).size
    return {
        ...config,
        p2p_buys: p2p_buys.length,
        p2p_sells: p2p_sells.length,
        p2p_buys_amount_usdt,
        p2p_buys_amount_leals,
        p2p_sells_amount_usdt,
        p2p_sells_amount_leals,
        p2p_buys_users,
        p2p_sells_users
    }
}

export async function get_p2p_settings_page() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    const penalty_fees = await (await conexion.query('SELECT * FROM penalty_fees')).rows[0]
    const packages = await (await conexion.query('SELECT * FROM packages')).rows
    return {
        ...p2p_config,
        ...config,
        ...penalty_fees,
        packages
    }
}

export async function get_businesses_config() {
    const data = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]
    return data
}

export async function get_split_settings_page() {
    const split_info = await (await conexion.query('SELECT initial_split, value_compared_usdt FROM p2p_config')).rows[0]
    return split_info
}

export async function get_ads_config() {
    const ads_config = await (await conexion.query('SELECT * FROM ads_config')).rows[0]
    return ads_config
}

export async function update_earnings_stop(new_stop) {
    await conexion.query('UPDATE p2p_config SET not_available_earnings_stop=($1)', [new_stop])
}

export async function update_penalty_data(data) {
    await conexion.query('UPDATE penalty_fees SET usdt_address_penalty=($1), usdt_address_fees=($2), amount_penalty=($3)', [data.usdt_address_penalty, data.usdt_address_fees, data.amount_penalty])
}

export async function update_sending_time_hash(new_time) {
    await conexion.query('UPDATE p2p_config SET sending_time_hash_seconds=($1)', [new_time])
}

export async function update_wthdrawal_sell_minimun_amount(new_amount) {
    await conexion.query('UPDATE config SET wthdrawal_sell_minimun_amount=($1)', [new_amount])
}

// withdrawals

export async function approve_withdrawal(withdrawal_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['successful', withdrawal_id])
    const old_history_row = await (await conexion.query('SELECT * FROM history WHERE withdrawal_related=($1)', [withdrawal_request.withdrawal_id])).rows[0]
    await conexion.query('UPDATE history SET widthdrawal_condition=($1), date=($2) WHERE history_id=($3)', ['successful', new Date(), old_history_row.history_id])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.owner, `Your withdrawal has already been processed to the leals address you provided. Amount: ${withdrawal_request.amount / p2p_config.value_compared_usdt} leals`, new Date()])
    return { status: true, content: 'Withdrawal succesfully approved' }
}

export async function deny_withdrawal(withdrawal_id) {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    const withdrawal_request = await (await conexion.query('SELECT * FROM withdrawals WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    if (!withdrawal_request) return { status: false, content: 'There is no withdrawal request with such id' }
    await conexion.query('UPDATE withdrawals SET status=($1) WHERE withdrawal_id=($2)', ['denied', withdrawal_id])
    const old_history_row = await (await conexion.query('SELECT * FROM history WHERE withdrawal_related=($1)', [withdrawal_request.withdrawal_id])).rows[0]
    await conexion.query('UPDATE history SET widthdrawal_condition=($1), date=($2), cash_flow=($3) WHERE history_id=($4)', ['denied', new Date(), 'outcome', old_history_row.history_id])
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [withdrawal_request.owner, `We are very sorry your withdrawal was not processed`, new Date()])
    const requester_wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [withdrawal_request.owner])).rows[0]
    await conexion.query('UPDATE wallets SET balance=($1) WHERE owner=($2)', [requester_wallet.balance + withdrawal_request.amount * p2p_config.value_compared_usdt, withdrawal_request.owner])
    return { status: true, content: 'Withdrawal succesfully denied' }
}

export async function list_withdrawals(status) {
    const withdrawals = await (await conexion.query('SELECT withdrawals.*, usuarios.nombre_usuario FROM withdrawals LEFT JOIN usuarios ON usuarios.id=withdrawals.owner WHERE status=($1) ORDER BY requested_at DESC', [status])).rows
    return withdrawals
}

export async function get_withdrawals_by_requester(username) {
    const withdrawals = await (await conexion.query('SELECT * FROM withdrawals INNER JOIN usuarios ON usuarios.id = withdrawals.owner WHERE usuarios.nombre_usuario=($1) ORDER BY requested_at DESC', [username])).rows
    return withdrawals
}

export async function get_withdrawal_info(withdrawal_id) {
    const withdrawal = await (await conexion.query('SELECT * FROM withdrawals INNER JOIN usuarios ON usuarios.id = withdrawals.owner WHERE withdrawal_id=($1)', [withdrawal_id])).rows[0]
    return withdrawal
}

// advertises

export async function list_advertises(status) {
    const advertises = await (await conexion.query('SELECT advertises.*, usuarios.nombre_usuario FROM advertises LEFT JOIN usuarios ON usuarios.id = advertises.owner  WHERE status=($1) ORDER BY created_at DESC', [status])).rows
    return advertises
}

export async function get_advertise_info(advertise_id) {
    const advertise = await (await conexion.query('SELECT * FROM advertises INNER JOIN usuarios ON usuarios.id = advertises.owner WHERE advertise_id=($1)', [advertise_id])).rows[0]
    return advertise
}

export async function get_advertises_by_username(username) {
    const advertises = await (await conexion.query('SELECT * FROM advertises INNER JOIN usuarios ON usuarios.id = advertises.owner WHERE usuarios.nombre_usuario=($1) ORDER BY created_at DESC', [username])).rows
    return advertises
}

export async function approve_advertise(advertise_id) {
    const ad = await (await conexion.query('UPDATE advertises SET status=($1) WHERE advertise_id=($2) RETURNING *', ['approved', advertise_id])).rows[0]
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [ad.owner, 'Excellent work, your ad was registered successfully', new Date()])
    return { status: true, content: 'Advertise succesfully approved' }
}

export async function deny_advertise(advertise_id) {
    const ad = await (await conexion.query('UPDATE advertises SET status=($1) WHERE advertise_id=($2) RETURNING *', ['denied', advertise_id])).rows[0]
    await conexion.query('INSERT INTO notifications (owner, message, date) VALUES($1,$2,$3)', [ad.owner, 'We are very sorry your ad was not processed', new Date()])
    return { status: true, content: 'Advertise succesfully denied' }
}

// ads settings 

export async function update_ads_config(data) {
    await conexion.query('UPDATE ads_config SET code=($1), hashtag=($2), time_between_ads=($3), facebook_url=($4), tiktok_url=($5), tutorial_url=($6)', [data.code, data.hashtag, data.time_between_ads, data.facebook_url, data.tiktok_url, data.tutorial_url])
}

export async function get_team({ id_progenitor, level, id }) {
    const tempUsers = await (await conexion.query("SELECT id, nombre_usuario, full_nombre, avatar, id_sponsor, codigo_pais FROM usuarios WHERE id_progenitor=($1) OR id=($1) ORDER BY id_sponsor NULLS FIRST", [id_progenitor])).rows
    const direct_users = await (await conexion.query('SELECT FROM usuarios WHERE id_sponsor=($1)', [id])).rowCount
    const indirect_users = await (await conexion.query('SELECT FROM usuarios WHERE id_sponsor<>($1) AND id_progenitor=($1)', [id])).rowCount
    const users = []
    let results = []
    for (let i = 0; i < tempUsers.length; i++) {
        const user = tempUsers[i];
        const avatar = await resizeImageBase64(60, 60, 70, user.avatar)
        const newObject = { ...user, avatar: avatar || null }
        users.push(newObject)
    }
    function Node(user) {
        this.user = user,
            this.children = [];
    }
    class Tree {
        constructor() {
            this.root = null;
        }
        add(data, toNodeData) {
            const node = new Node(data);
            const parent = toNodeData ? this.findBFS(toNodeData) : null;
            if (parent) {
                parent.children.push({ ...node, user: { ...node.user, level: parent.user.level + 1 } })
            } else {
                if (!this.root) {
                    this.root = { ...node, user: { ...node.user, level: 0 } };
                } else return 'Tried to store node at root when root already exists'
            }
        }

        findBFS(data) {
            let _node = null
            this.traverseBFS((node) => {
                if (node) {
                    if (node.user.id === data) {
                        _node = node
                    }
                }
            })

            return _node
        }

        traverseBFS(cb) {
            const queue = [this.root]
            if (cb) {
                while (queue.length) {
                    const node = queue.shift()

                    cb(node)
                    for (const child of node.children) {
                        queue.push(child)
                    }

                }
            }
        }
    }

    let tree = new Tree()
    let lastLevel
    let isChild = false
    for (const object of users) {
        if (object.id_sponsor === id) isChild = true
        if (object.id == id) {
            tree.add(object)
        } else if (object.id_sponsor && isChild) tree.add(object, object.id_sponsor)
    }
    tree.traverseBFS((node) => {
        results.push(node)
    })
    lastLevel = results[results.length - 1].user.level
    let count = results[results.length - 1].user.level < 10 ? 10 : results[results.length - 1].user.level
    const childsCount = [];
    for (let i = 1; i <= count; i++) {
        const element = results.filter(object => object.user.level === i);
        childsCount.push(element.length)
    }
    if (level > 0) {
        results = { user: results[0].user, children: results.filter(object => object.user.level === level) }
    } else results = results[0]
    return { results, last_level: lastLevel, childs_count: childsCount, direct_users, indirect_users }
}

export async function get_tree_by_username(text) {
    const searched_user = await (await conexion.query('SELECT id, id_progenitor FROM usuarios WHERE nombre_usuario=($1)', [text])).rows[0]
    if (!searched_user) return { status: false, content: 'No user matches this username' }
    const direct_users = await (await conexion.query('SELECT FROM usuarios WHERE id_sponsor=($1)', [searched_user.id])).rowCount
    const tempUsers = await (await conexion.query("SELECT id, nombre_usuario, full_nombre, id_sponsor, avatar, codigo_pais FROM usuarios WHERE id_progenitor = ($1) OR id = ($1) ORDER BY id_sponsor NULLS FIRST", [searched_user.id_progenitor])).rows
    const users = []
    for (let i = 0; i < tempUsers.length; i++) {
        const user = tempUsers[i];
        const avatar = await resizeImageBase64(60, 60, 70, user.avatar)
        const newObject = { ...user, avatar: avatar || null }
        users.push(newObject)
    }
    function Node(user) {
        this.user = user,
            this.children = [];
    }
    class Tree {
        constructor() {
            this.root = null;
        }
        add(data, toNodeData) {
            const node = new Node(data);
            const parent = toNodeData ? this.findBFS(toNodeData) : null;
            if (parent) {
                parent.children.push({ ...node, user: { ...node.user, level: parent.user.level + 1 } })
            } else {
                if (!this.root) {
                    this.root = { ...node, user: { ...node.user, level: 0 } };
                } else return 'Tried to store node at root when root already exists'
            }
        }

        findBFS(data) {
            let _node = null
            this.traverseBFS((node) => {
                if (node) {
                    if (node.user.id === data) {
                        _node = node
                    }
                }
            })

            return _node
        }

        traverseBFS(cb) {
            const queue = [this.root]
            if (cb) {
                while (queue.length) {
                    const node = queue.shift()

                    cb(node)
                    for (const child of node.children) {
                        queue.push(child)
                    }
                }
            }
        }
    }
    let tree = new Tree()
    let results = []
    let lastLevel
    let isChild = false
    for (const object of users) {
        if (object.id_sponsor === searched_user.id) isChild = true
        if (object.id == searched_user.id) {
            tree.add(object)
        } else if (object.id_sponsor && isChild) tree.add(object, object.id_sponsor)
    }
    tree.traverseBFS((node) => {
        results.push(node)
    })
    lastLevel = results[results.length - 1].user.level
    let count = results[results.length - 1].user.level < 10 ? 10 : results[results.length - 1].user.level
    const childsCount = [];
    for (let i = 1; i <= count; i++) {
        const element = results.filter(object => object.user.level === i);
        childsCount.push(element.length)
    }

    const indirect_users = childsCount.slice(1).reduce((a, b) => { return a + b })
    return { results: results[0], last_level: lastLevel, childs_count: childsCount, indirect_users, direct_users }
}

export async function list_users(condition) {
    let users
    switch (condition) {
        case 'active':
            users = await (await conexion.query('SELECT * FROM usuarios WHERE status_p2p=($1)', ['active'])).rows
            break;
        case 'inactive':
            users = await (await conexion.query('SELECT * FROM usuarios WHERE status_p2p=($1)', ['inactive'])).rows
            break;
        case 'blocked':
            users = await (await conexion.query('SELECT * FROM usuarios WHERE is_user_blocked_p2p=($1)', [true])).rows
            break;
        case 'deleted':
            users = await (await conexion.query('SELECT * FROM usuarios WHERE is_user_deleted=($1)', [true])).rows
            break;
        case 'with buys':
            users = await (await conexion.query('SELECT DISTINCT ON (owner) usuarios.* FROM tickets LEFT JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.status=($1) AND tickets.type=($2)', ['finished', 'buy'])).rows
            break;
        case 'with sells':
            users = await (await conexion.query('SELECT DISTINCT ON (owner) usuarios.* FROM tickets LEFT JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.status=($1) AND tickets.type=($2)', ['finished', 'sell'])).rows
            break;
        case "with businesses":
            users = await (await conexion.query('SELECT * FROM usuarios u WHERE EXISTS (SELECT FROM businesses WHERE businesses.owner=u.id)')).rows
            break;
        case "no businesses":
            users = await (await conexion.query('SELECT * FROM usuarios u WHERE NOT EXISTS (SELECT FROM businesses WHERE businesses.owner=u.id)')).rows
            break;
        case 'admins':
            users = await (await conexion.query('SELECT * FROM admins INNER JOIN usuarios ON admins.iduser=usuarios.id')).rows
            break;
    }
    return users
}

export async function update_user_info(user_id, data) {
    const user = await (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [user_id])).rows[0]
    const new_info = {
        ...user,
        ...data
    }
    if (new_info.email == user.email) {
        if (new_info.telefono == user.telefono) {
            await conexion.query('UPDATE usuarios SET full_nombre=($1), usd_direction=($2), payment_methods=($3), codigo_pais=($4), habilidades=($5) WHERE id=($6)', [new_info.full_nombre, new_info.usd_direction, new_info.payment_methods, new_info.codigo_pais, new_info.habilidades, user_id])
        } else {
            await conexion.query('UPDATE usuarios SET full_nombre=($1), usd_direction=($2), payment_methods=($3), codigo_pais=($4), telefono=($5), habilidades=($6) WHERE id=($7)', [new_info.full_nombre, new_info.usd_direction, new_info.payment_methods, new_info.codigo_pais, new_info.telefono, new_info.habilidades, user_id])
        }
    } else {
        if (new_info.telefono == user.telefono) {
            await conexion.query('UPDATE usuarios SET full_nombre=($1), email=($2), usd_direction=($3), payment_methods=($4), codigo_pais=($5), habilidades=($6) WHERE id=($7)', [new_info.full_nombre, new_info.email, new_info.usd_direction, new_info.payment_methods, new_info.codigo_pais, new_info.habilidades, user_id])
        } else {
            await conexion.query('UPDATE usuarios SET full_nombre=($1), email=($2), usd_direction=($3), payment_methods=($4), codigo_pais=($5), telefono=($6), habilidades=($7) WHERE id=($8)', [new_info.full_nombre, new_info.email, new_info.usd_direction, new_info.payment_methods, new_info.codigo_pais, new_info.telefono, new_info.habilidades, user_id])
        }
    }
}

export async function get_user_info(user_id) {
    const p2p_config = await (await conexion.query('SELECT not_available_earnings_stop FROM p2p_config')).rows[0]
    const user = await (await conexion.query('SELECT * FROM usuarios WHERE id=($1)', [user_id])).rows[0]
    const wallet = await (await conexion.query('SELECT balance, not_available FROM wallets WHERE owner=($1)', [user_id])).rows[0]
    const buys = await (await conexion.query('SELECT * FROM tickets WHERE tickets.status=($1) AND tickets.owner=($2) AND tickets.type=($3)', ['finished', user_id, 'buy'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0) * p2p_config.not_available_earnings_stop
    const sells = await (await conexion.query('SELECT * FROM tickets WHERE tickets.status=($1) AND tickets.owner=($2) AND tickets.type=($3)', ['finished', user_id, 'sell'])).rows.map(object => object.amount).reduce((partialSum, a) => partialSum + a, 0)
    const pack_1 = await (await conexion.query('SELECT amount FROM tickets WHERE owner=($1) AND type=($2) AND status=($3)', [user_id, 'buy', 'finished'])).rows[0]?.amount || 0
    const pack_2 = await (await conexion.query('SELECT amount FROM tickets WHERE owner=($1) AND type=($2) AND status=($3)', [user_id, 'buy', 'finished'])).rows[1]?.amount || 0
    const businesses_total = 0
    const scrow_balance = 0
    const currency = get_currency_by_id(user.codigo_pais)
    const country_name = get_countryname_by_id(user.codigo_pais)
    const object = {
        ...user,
        ...wallet,
        buys,
        sells,
        currency,
        country_name,
        pack_1,
        pack_2,
        businesses_total,
        scrow_balance
    }
    return object
}

export async function block_user_buttons(user_id) {
    await conexion.query('UPDATE usuarios SET is_user_blocked_p2p=($1) WHERE id=($2)', [true, user_id])
}

export async function unblock_user_buttons(user_id) {
    await conexion.query('UPDATE usuarios SET is_user_blocked_p2p=($1) WHERE id=($2)', [false, user_id])
}

export async function make_admin(user_id) {
    const user = await (await conexion.query('SELECT * FROM admins WHERE iduser=($1)', [user_id])).rows[0]
    if (user) return { status: false, content: 'This user is already an admin' }
    await conexion.query('INSERT INTO admins (iduser, role) VALUES ($1, $2)', [user_id, 'admin'])
    return { status: true, content: 'User successfully added to admins' }
}

export async function update_leal_value(new_value) {
    await conexion.query('UPDATE p2p_config SET value_compared_usdt=($1)', [new_value])
}

export async function update_initial_split(new_value) {
    await conexion.query('UPDATE p2p_config SET initial_split=($1)', [new_value])
}

// businesses

export async function list_businesses(status) {
    const list = await (await conexion.query('SELECT businesses.*, usuarios.nombre_usuario FROM businesses LEFT JOIN usuarios ON usuarios.id = businesses.owner WHERE business_status=($1)', [status])).rows
    return list
}

export async function get_business_info(business_id) {
    const business = await (await conexion.query('SELECT businesses.*, usuarios.nombre_usuario, usuarios.full_nombre FROM businesses LEFT JOIN usuarios ON usuarios.id = businesses.owner WHERE business_id=($1)', [business_id])).rows[0]
    return business
}

export async function approve_business(business_id) {
    await conexion.query('UPDATE businesses SET business_status=($1) WHERE business_id=($2)', ['approved', business_id])
}

export async function deny_business(business_id) {
    await conexion.query('UPDATE businesses SET business_status=($1) WHERE business_id=($2)', ['denied', business_id])
}

export async function search_business_by_username(username) {
    const businesses = await (await conexion.query('SELECT businesses.*, usuarios.nombre_usuario, usuarios.full_nombre FROM businesses LEFT JOIN usuarios ON usuarios.id = businesses.owner WHERE usuarios.nombre_usuario=($1)', [username])).rows
    return businesses
}

export async function update_businesses_config(data) {
    const old_data = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]
    const new_data = {
        ...old_data,
        ...data
    }

    await conexion.query('UPDATE businesses_config SET cashback_for_customer=($1), leals_cashback=($2), earnings_by_level=($3), commission_businesses_gift=($4), businesses_types_categories=($5), businesses_rating=($6)', [new_data.cashback_for_customer, new_data.leals_cashback, new_data.earnings_by_level, new_data.commission_businesses_gift, new_data.businesses_types_categories, new_data.businesses_rating])
}

export async function edit_business_type_name(old_name, new_name) {
    const old_list = await (await conexion.query('SELECT * FROM businesses_config')).rows[0]?.businesses_types_categories
    const old_data = old_list.find(object => object.type == old_name)
    if (!old_data) return { status: false, content: 'This old type name does not exist' }
    const new_list = [...old_list.filter(object => object.type !== old_name), { ...old_data, type: new_name }]
    await conexion.query('UPDATE businesses_config SET businesses_types_categories=($1)', [new_list])
    await conexion.query('UPDATE businesses SET type=($1) WHERE type=($2)', [new_name, old_name])
    return { status: true, content: 'Type name successfully updated' }
}

export async function search_by_username(username) {
    const user = await (await conexion.query('SELECT * FROM usuarios WHERE nombre_usuario=($1)', [username])).rows[0]
    return user
}

export async function get_p2p_config() {
    const config = await (await conexion.query('SELECT * FROM config')).rows[0]
    return config
}