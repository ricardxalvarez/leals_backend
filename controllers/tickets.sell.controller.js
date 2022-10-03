import { ticketsSellService } from "../services/index.js";
import { io } from '../index.js'

export async function create(req, res, next) {
    const { id } = req.user
    const response = await ticketsSellService.createTicket(req.body, id)
    res.send(response)
    if (!response.new_ticket_list) return
    io.sockets.emit("new_tickets", tickets)
}

export async function list(req, res, next) {
    const response = await ticketsSellService.listTickets("sell")
    res.send({ status: true, content: response })
}

export async function search(req, res, next) {
    const ticket_id = req.body.ticket_id
    const response = await ticketsSellService.searchTicket(ticket_id)
    res.send({ status: true, content: response })
}

export async function getFee(req, res, next) {
    const response = await ticketsSellService.getFee()
    res.send(response)
}