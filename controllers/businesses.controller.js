import { businessesService } from "../services/index.js";

export async function add_business(req, res, next) {
    const { id } = req.user
    const response = await businessesService.add_business(req.body, id)
    res.send(response)
}

export async function edit_business(req, res, next) {
    const { id } = req.user
    const response = await businessesService.edit_business(id, req.body)
    res.send(response)
}

export async function list_businesses(req, res, next) {
    const list = await businessesService.list_businesses(req.body)
    res.send({ status: true, content: list })
}

export async function get_business(req, res, next) {
    const { business_id } = req.body
    const business = await businessesService.get_business(business_id)
    res.send({ status: true, content: business })
}

export async function post_review(req, res, next) {
    const { id } = req.user
    const response = await businessesService.post_review(req.body, id)
    res.send(response)
}

export async function list_reviews(req, res, next) {
    const { business_id } = req.body
    const list = await businessesService.list_reviews(business_id)
    res.send({ status: true, content: list })
}

export async function list_my_businesses(req, res, next) {
    const { id } = req.user
    const list = await businessesService.list_my_businesses(id)
    res.send({ status: true, content: list })
}

export async function delete_business(req, res, next) {
    const { id } = req.user
    const { business_id } = req.query
    const response = await businessesService.delete_business(id, business_id)
    res.send(response)
}

export async function search_by_address(req, res, next) {
    const { address } = req.body
    const list = await businessesService.search_by_address(address)
    res.send({ status: true, content: list })
}

export async function search_by_business_id(req, res, next) {
    const data = req.body
    const response = await businessesService.search_by_business_id(data)
    res.send(response)
}

export async function make_payment(req, res, next) {
    const data = req.body
    const { id } = req.user
    const response = await businessesService.make_payment(data, id)
    res.send(response)
}

export async function list_business_history(req, res, next) {
    const { id } = req.user
    const list = await businessesService.list_business_history(id)
    res.send({ status: false, content: list })
}

export async function list_business_history_customer(req, res, next) {
    const { id } = req.user
    const list = await businessesService.list_business_history_customer(id)
    res.send({ status: true, content: list })
}

export async function deny_payment(req, res, next) {
    const { id } = req.user
    const { payment_id } = req.body
    const response = await businessesService.deny_payment(id, payment_id)
    res.send(response)
}

export async function approve_payment(req, res, next) {
    const { id } = req.user
    const { payment_id } = req.body
    const response = await businessesService.approve_payment(id, payment_id)
    res.send(response)
}

export async function search_businesses(req, res, next) {
    const { string } = req.body
    const list = await businessesService.search_businesses(string)
    res.send({ status: true, content: list })
}