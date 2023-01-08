import fetch, { Headers } from "node-fetch";
import conexion from '../database/conexion.js'
import config from "../config/config.js";

export default async function get_value_by_currency(currency, amount) {
    const p2p_config = (await conexion.query('SELECT * FROM p2p_config')).rows[0]
    var myHeaders = new Headers();
    myHeaders.append("apikey", config.apilayer.exchange_rate);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    if (currency === 'USD') {
        fetch(`https://api.apilayer.com/exchangerates_data/latest?base=USD`, requestOptions)
            .then(async result => {
                const rates = await (await result.json()).rates
                const sourceExchange = rates[currency] || 0
                const USD_amount = amount / sourceExchange
                const LEALS_amount = USD_amount / p2p_config.value_compared_usdt
                let response = {
                    source: currency,
                    USD_exchange: sourceExchange,
                    base_amount: amount,
                    USD_amount,
                    LEALS_amount
                }
                if (!sourceExchange) {
                    response = {
                        source: currency,
                        USD_exchange: sourceExchange,
                        base_amount: amount,
                        USD_amount,
                        LEALS_amount
                    }
                }
                return response
            })
            .catch(error => { return error });
    } else {
        return {
            source: currency,
            USD_exchange: 1,
            base_amount: amount,
            USD_amount: amount,
            LEALS_amount: amount / p2p_config.value_compared_usdt
        }
    }
}