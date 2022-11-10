import { adsInfoService } from "../services/index.js";

export async function get_ads_info(req, res, next) {
    const response = await adsInfoService.get_ads_info()
    res.send(response)
}