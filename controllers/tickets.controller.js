import { ticketsService } from "../services/index.js"

export async function list(req, res, next) {
    const { id } = req.user
    const response = await ticketsService.listTickets(id)
    res.send({ status: true, content: response })
}

export async function cancel(req, res, next) {
    const { ticket_id } = req.body
    const { id } = req.body
    const response = await ticketsService.cancelTicket(ticket_id, id)
    res.send(response)
}