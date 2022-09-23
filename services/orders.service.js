import conexion from '../database/conexion.js'
import create_wallet from '../utils/create_wallet.js';

export async function list_buy(userid) {
    const orders = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_buyer_id WHERE tickets.owner=($1) ORDER BY created_at DESC', [userid])).rows
    const results = []
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let buyer
        let seller
        let type
        buyer = await (await conexion.query('SELECT full_nombre AS full_name, nombre_usuario AS username FROM usuarios WHERE id=($1)', [userid])).rows[0]
        seller = await (await conexion.query('SELECT usuarios.full_nombre AS full_name, usuarios.nombre_usuario AS username FROM tickets INNER JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.ticket_id=($1)', [order.ticket_seller_id])).rows[0]
        if (order.ticket_id === order.ticket_buyer_id) type = 'buy'
        if (order.ticket_id === order.ticket_seller_id) type = 'sell'
        results.push({ ...order, buyer, seller, type })
    }
    return results
}

export async function list_sell(userid) {
    const orders = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id WHERE tickets.owner=($1) ORDER BY created_at DESC', [userid])).rows
    const results = []
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let buyer
        let seller
        let type
        seller = await (await conexion.query('SELECT full_nombre AS full_name, nombre_usuario AS username FROM usuarios WHERE id=($1)', [userid])).rows[0]
        buyer = await (await conexion.query('SELECT usuarios.full_nombre AS full_name, usuarios.nombre_usuario AS username FROM tickets INNER JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.ticket_id=($1)', [order.ticket_buyer_id])).rows[0]
        if (order.ticket_id === order.ticket_buyer_id) type = 'buy'
        if (order.ticket_id === order.ticket_seller_id) type = 'sell'
        results.push({ ...order, buyer, seller, type })
    }
    return results
}

export async function list(userid) {
    const orders = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id OR tickets.ticket_id=orders.ticket_buyer_id WHERE tickets.owner=($1) ORDER BY created_at DESC', [userid])).rows
    const results = []
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        let buyer
        let seller
        let type
        if (order.ticket_id === order.ticket_buyer_id) type = 'buy'
        if (order.ticket_id === order.ticket_seller_id) type = 'sell'
        if (type === 'sell') {
            seller = await (await conexion.query('SELECT full_nombre AS full_name, nombre_usuario AS username FROM usuarios WHERE id=($1)', [order.owner])).rows[0]
            buyer = await (await conexion.query('SELECT usuarios.full_nombre AS full_name, usuarios.nombre_usuario AS username FROM tickets INNER JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.ticket_id=($1)', [order.ticket_buyer_id])).rows[0]
        }
        if (type === 'buy') {
            buyer = await (await conexion.query('SELECT full_nombre AS full_name, nombre_usuario AS username FROM usuarios WHERE id=($1)', [order.owner])).rows[0]
            seller = await (await conexion.query('SELECT usuarios.full_nombre AS full_name, usuarios.nombre_usuario AS username FROM tickets INNER JOIN usuarios ON usuarios.id=tickets.owner WHERE tickets.ticket_id=($1)', [order.ticket_seller_id])).rows[0]
        }
        results.push({ ...order, buyer, seller, type })
    }
    return results
}

export async function search(order_id, userid) {
    // ORDER BY tickets.type will make buy order first, and sell, second
    const order = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner, tickets.type, usuarios.full_nombre AS full_name, usuarios.nombre_usuario AS username, usuarios.codigo_pais AS country_code, usuarios.usd_direction AS usdt_direction FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id OR tickets.ticket_id=orders.ticket_buyer_id INNER JOIN usuarios ON usuarios.id=tickets.owner WHERE order_id=($1) AND tickets.owner<>($2)', [order_id, userid])).rows[0]
    // all timezones must be GM-4
    // if deadline_seconds_remain is less than 0, means that deadline time has expired
    const deadline_seconds_remain = (((new Date().getTime() - new Date(order.created_at).getTime()) / 1000) - order.deadline_seconds) * -1

    const result = {
        ...order, deadline_seconds_remain
    }
    return result
}

export async function send_proof_order(order_id, userid, data) {
    // add id hash column to orders table
    const order = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_buyer_id WHERE order_id=($1)', [order_id])).rows[0]
    if (!order) return { status: false, content: 'This order does not exist' }
    if (order.owner !== userid) return { status: false, content: 'You are not the buyer of this order' }
    if (order.status === 'successfull' || order.status === 'cancelled') return { status: false, content: 'Order was already successfull or cancelled' }
    // update order status and
    const new_order_info = await (await conexion.query('UPDATE orders SET proof=($1), id_hash=($2), status=($3) WHERE order_id=($4) RETURNING *', [data.proof, data.id_hash, 'hashed', order_id])).rows[0]
    // update tickets status (buyer and seller)
    const ticket_seller = await (await conexion.query('SELECT status FROM tickets WHERE ticket_id=($1)', [order.ticket_seller_id])).rows[0]
    if (ticket_seller.status === 'completed' || ticket_seller.status === 'precompleted') await conexion.query('UPDATE tickets SET status=($1) WHERE ticket_id=($2)', ['prefinished', order.ticket_seller_id])
    const ticket_buyer = await (await conexion.query('SELECT status FROM tickets WHERE ticket_id=($1)', [order.ticket_buyer_id])).rows[0]
    if (ticket_buyer.status === 'completed' || ticket_buyer.status === 'precompleted') await conexion.query('UPDATE tickets SET status=($1) WHERE ticket_id=($2)', ['prefinished', order.ticket_buyer_id])
    return { status: true, content: new_order_info }
}

export async function approve_order(order_id, userid) {
    const order = await (await conexion.query('SELECT orders.*, tickets.ticket_id, tickets.owner FROM orders INNER JOIN tickets ON tickets.ticket_id=orders.ticket_seller_id WHERE order_id=($1)', [order_id])).rows[0]
    if (!order) return { status: false, content: 'This order does not exist' }
    if (order.owner !== userid) return { status: false, content: 'You are not the seller of this order' }
    if (order.status === 'successfull' || order.status === 'cancelled') return { status: false, content: 'Order was already successfull or cancelled' }
    const new_order_info = await (await conexion.query('UPDATE orders SET status=($1) WHERE order_id=($2) RETURNING *', ['successfull', order_id])).rows[0]
    // update tickets
    const buyer_ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [order.ticket_buyer_id])).rows[0]
    const seller_ticket = await (await conexion.query('SELECT * FROM tickets WHERE ticket_id=($1)', [order.ticket_seller_id])).rows[0]
    const buyer_orders = await (await conexion.query('SELECT * FROM orders WHERE ticket_buyer_id=($1)', [order.ticket_buyer_id])).rows
    const seller_orders = await (await conexion.query('SELECT * FROM orders WHERE ticket_seller_id=($1)', [order.ticket_seller_id])).rows
    // tick
    // update wallets
    const wallet_seller = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [userid])).rows[0]
    await conexion.query('UPDATE wallets SET balance_to_sell=($1) WHERE owner=($2)', [wallet_seller.balance_to_sell - order.amount, userid])
    const wallet_buyer = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [buyer_ticket.owner])).rows[0]
    if (!wallet_buyer) await create_wallet(buyer_ticket.owner)
    await conexion.query('UPDATE wallets SET not_available=($1) WHERE owner=($2)', [wallet_buyer?.not_available ? wallet_buyer.not_available + order.amount : order.amount, buyer_ticket.owner])
    // get array of parents
    const parents = []
    while (parents.length < 10) {
        // commmisions are going to parents of seller
        const last_parent_id = parents[parents.length - 1]?.id || buyer_ticket.owner
        const last_parent = await (await conexion.query('SELECT id, id_sponsor, id_progenitor FROM usuarios WHERE id=($1)', [last_parent_id])).rows[0]
        const parent = await (await conexion.query('SELECT id, id_progenitor FROM usuarios WHERE id=($1)', [last_parent.id_sponsor])).rows[0]
        if (!parent) break;
        parents.push(parent)
    }
    //  handle comissions
    const rules_commissions = [
        {
            level: 1,
            commission: 20,
            expected_children_qty: 1
        }, {
            level: 2,
            commission: 12,
            expected_children_qty: 0
        }, {
            level: 3,
            commission: 8,
            expected_children_qty: 1
        }, {
            level: 4,
            commission: 6,
            expected_children_qty: 1
        }, {
            level: 5,
            commission: 4,
            expected_children_qty: 1
        }, {
            level: 6,
            commission: 2,
            expected_children_qty: 1
        }, {
            level: 7,
            commission: 2,
            expected_children_qty: 1
        }, {
            level: 8,
            commission: 2,
            expected_children_qty: 1
        }, {
            level: 9,
            commission: 2,
            expected_children_qty: 1
        }, {
            level: 10,
            commission: 2,
            expected_children_qty: 1
        },
    ]
    // use childs_count in referrals/child to get commissions percentage
    if (seller_orders.every(object => object.status === 'successfull') && seller_ticket.remain == 0) await conexion.query('UPDATE tickets SET status=($1) WHERE ticket_id=($2)', ['finished', order.ticket_seller_id])
    if (buyer_orders.every(object => object.status === 'successfull') && buyer_ticket.remain == 0) {
        await conexion.query('UPDATE tickets SET status=($1) WHERE ticket_id=($2)', ['finished', order.ticket_buyer_id])
        for (let i = 0; i < parents.length; i++) {
            const parent = parents[i];
            const rule = rules_commissions.find(object => object.level === i + 1)
            if (!rule) continue;
            const commission = rule.commission * buyer_ticket.amount / 100
            const response = await submit_commissions(parent.id_progenitor || parent.id, parent.id, commission, rule.expected_children_qty, rule.level, buyer_ticket.owner)
            console.log(response)
        }
    }
    return { status: true, content: new_order_info }
}

async function submit_commissions(id_progenitor, id, commission, expected_children_qty, level, id_child) {
    const users = await (await conexion.query("SELECT id, id_sponsor, nombre_usuario FROM usuarios WHERE id_progenitor=($1) OR id=($1) ORDER BY id_sponsor NULLS FIRST", [id_progenitor])).rows
    let results = []
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
    let count = results[results.length - 1].user.level > 10 ? 10 : results[results.length - 1].user.level
    const childsCount = [];
    for (let i = 1; i <= count; i++) {
        const element = results.filter(object => object.user.level === i);
        childsCount.push(element.length)
    }
    if (childsCount[level - 1] >= expected_children_qty) {
        let wallet
        wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [id])).rows[0]
        if (!wallet) {
            await create_wallet(id)
            wallet = await (await conexion.query('SELECT * FROM wallets WHERE owner=($1)', [id])).rows[0]
        }
        // update not_available balance of wallet id
        const new_not_available_balance = wallet.not_available ? wallet.not_available + commission : commission
        await conexion.query('UPDATE wallets SET not_available=($1) WHERE owner=($2)', [new_not_available_balance, id])
        const old_split = await (await conexion.query('SELECT split FROM p2p_config')).rows[0]
        const new_split = old_split.split - commission
        await conexion.query('UPDATE p2p_config SET split=($1)', [new_split])
        // add this action to history
        const child_provider = await results.find(object => object.user.id === id_child)
        await (await conexion.query('INSERT INTO history (owner, amount, date, username_network_commision, user_level_network_commision) VALUES($1,$2,$3,$4,$5)', [id, commission, new Date(), child_provider.user.nombre_usuario, child_provider.user.level])).rows[0]
        // send notification to user 
        await (await conexion.query('INSERT INTO notifications (owner, message, date) VALUES ($1,$2, $3)', [id, `Congratulations, you just received a commission of amount: ${commission}, from user: ${child_provider.user.nombre_usuario}, level: ${child_provider.user.level}`, new Date()])).rows[0]
        return 'expecting commision to user ' + id + ' for ' + commission + ' leals'
    } else return 'not enough children for user ' + id
}