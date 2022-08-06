import { createRequire } from "module";
const require = createRequire(import.meta.url);
const countriesList = require("../data/contries.json")
const dialsList = require("../data/dialCodes.json")
import fetch, { Headers } from "node-fetch";

const countries = countriesList.map(object => {
    const newObject = dialsList.find(country => country.code === object.countryCode)
    return { ...object, dialCode: newObject?.dial_code }
})

export const retrieveCountry = (req, res, next) => {
    switch (req.query.find) {
        case 'currencyCode':
        case 'countryName':
        case 'dialCode':
        case 'countryCode': {
            res.send(countries.map(c => c[req.query.find]))
            break;
        };
        default: {
            res.send(countries)
        }
    }
}

export const getCurrencyWithDial = (req, res, next) => {
    const country = countries.filter(object => object.dialCode !== req.query.dialCode)
    res.send(country.dialCode);
}

export const currencyControl = async (req, res, next) => {
    const currency = req.params.currency
    const amount = req.query.amount || 1
    var myHeaders = new Headers();
    myHeaders.append("apikey", "nx4fRpHqyfycX58eydu8R1qjFQDMJKhK");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    fetch(`https://api.apilayer.com/exchangerates_data/latest?base=USD`, requestOptions)
        .then(result => {
            const value = result.json()
            res.send(value)
        })
        .catch(error => res.send(error));
}