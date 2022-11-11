import { advertisesService } from "../services/index.js";

export async function post_advertise(req, res, next) {
    const { id } = req.user
    const { post_link } = req.body
    const valid_posts_links = ['facebook.com', 'https://facebook.com', 'https://instagram.com', 'instagram.com', 'https://tiktok.com', 'tiktok.com', 'https://youtube.com', 'youtube.com']
    if (!valid_posts_links.some(word => post_link.startsWith(word))) return { status: false, content: 'Please provide a valid url' }
    const response = await advertisesService.post_advertise(id, post_link)
    res.send(response)
}

export async function list_advertises(req, res, next) {
    const { id } = req.user
    const advertises = await advertisesService.list_advertises(id)
    res.send({ status: true, content: advertises })
}