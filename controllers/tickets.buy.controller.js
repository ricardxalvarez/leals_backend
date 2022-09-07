import { ticketsService } from "../services/index.js";

export async function create(req, res, next) {
    const { id } = req.user
    const response = await ticketsService.createTicket(req.body, id)
    res.send(response)
}

export async function list(req, res, next) {
    const response = await ticketsService.listTickets()
    res.send({ status: true, content: response })
}

export async function search(req, res, next) {
    const ticket_id = req.body.ticket_id
    const response = await ticketsService.searchTicket(ticket_id)
    res.send({ status: true, content: response })
}