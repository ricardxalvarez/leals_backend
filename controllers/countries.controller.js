import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countries = require("../data/contries.json").countries.country
import fetch, { Headers } from "node-fetch";

export const retrieveCountry = (req, res, next) => {
    switch (req.query.find) {
        case 'currencyCode':
        case 'countryName':
        case 'countryCode': {
            res.send(countries.map(c => c[req.query.find]))
            break;
        };
        default: {
            res.send(countries)
        }
    }
}

export const currencyControl = async (req, res, next) => {
    const currency = req.params.currency
    var myHeaders = new Headers();
    myHeaders.append("apikey", "nx4fRpHqyfycX58eydu8R1qjFQDMJKhK");

    var requestOptions = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders
    };

    fetch(`https://api.apilayer.com/currency_data/live?source=USD&currencies=EUR`, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}