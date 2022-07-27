import { createRequire } from "module";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
const countries = (req, res, next) => {
    const require = createRequire(import.meta.url);
    const countriesArray = require("../data/contries.json")
    if (countriesArray.countries.country.some(c => c.countryCode === req.body.idcountry)) next()
    else throw new ApiError(StatusCodes.BAD_REQUEST, "This is a not valid id country")
}

export default countries;