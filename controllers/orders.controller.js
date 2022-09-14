import { ordersService } from "../services/index.js";

export async function list_buy(req, res, next) {
    const { id } = req.user
    const response = await ordersService.list_buy(id)
    res.send({ status: true, content: response })
}

export async function list_sell(req, res, next) {
    const { id } = req.user
    const response = await ordersService.list_sell(id)
    res.send({ status: true, content: response })
}

export async function list(req, res, next) {
    const { id } = req.user
    const response = await ordersService.list(id)
    res.send({ status: true, content: response })
}

export async function search(req, res, next) {
    const { id } = req.user
    const { order_id } = req.body
    const response = await ordersService.search(order_id, id)
    res.send({ status: true, content: response })
}

export async function send_proof(req, res, next) {
    const { id } = req.user
    const { order_id } = req.body
    const response = await ordersService.send_proof_order(order_id, id, req.body)
    res.send(response)
}

export async function approve_order(req, res, next) {
    const { id } = req.user
    const { order_id } = req.body
    const response = await ordersService.approve_order(order_id, id)
    res.send(response)
}