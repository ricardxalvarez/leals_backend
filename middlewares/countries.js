import { StatusCodes } from "http-status-codes";
import { createRequire } from "module";
const countries = (req, res, next) => {
    const require = createRequire(import.meta.url);
    const countries = require("../data/contries.json")
    if (countries.some(c => c.countryCode === req.body.idcountry)) next()
    else throw res.status(StatusCodes.BAD_REQUEST).send("This is a not valid id country")
}

export default countries;