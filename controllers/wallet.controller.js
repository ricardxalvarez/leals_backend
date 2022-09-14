import { walletService } from "../services/index.js";

export async function get_info(req, res, next) {
    const { id } = req.user
    const wallet = await walletService.wallet_info(id)
    res.send({ status: true, content: wallet })
}