import { ticketsBuyService } from "../services/index.js";
import { io } from '../index.js'

export async function create(req, res, next) {
    const { id } = req.user
    const response = await ticketsBuyService.createTicket(req.body, id)
    res.send(response)
    if (!response.new_ticket_list) return
    io.sockets.emit("new_tickets", tickets)
}

export async function list(req, res, next) {
    const response = await ticketsBuyService.listTickets("buy")
    res.send({ status: true, content: response })
}

export async function search(req, res, next) {
    const ticket_id = req.body.ticket_id
    const response = await ticketsBuyService.searchTicket(ticket_id)
    res.send({ status: true, content: response })
}