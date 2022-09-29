import conexion from '../database/conexion.js'

export default async function wallet_free_not_available() {
    setInterval(() => {
        timeout()
    }, 1000)
    async function timeout() {
        const wallets = await (await conexion.query('SELECT * FROM wallets WHERE not_available>0')).rows
        for (let i = 0; i < wallets.length; i++) {
            const wallet = wallets[i];
            if (!wallet.last_not_available_release) {
                await conexion.query('UPDATE wallets SET last_not_available_release=($1) WHERE owner=($2)', [new Date(), wallet.owner])
                continue;
            }
            const seconds_in_a_week = 60 /** 60 * 24 * 7 */
            const seconds_remain = (((new Date().getTime() - new Date(wallet.last_not_available_release).getTime()) / 1000) - seconds_in_a_week) * -1
            if (seconds_remain <= 0) {
                const rule_ads =
                    [
                        {
                            ads_quantity: 0,
                            percentage: 1
                        },
                        {
                            ads_quantity: 1,
                            percentage: 2
                        },
                        {
                            ads_quantity: 2,
                            percentage: 5
                        }
                    ]
                const advertises = await (await conexion.query('SELECT * FROM advertises WHERE owner=($1)', [wallet.owner])).rows
                let valid_advertises_count = 0
                for (let j = 0; j < advertises.length; j++) {
                    const ad = advertises[j];
                    const seconds_remain = (((new Date().getTime() - new Date(ad.created_at).getTime()) / 1000) - seconds_in_a_week) * -1
                    if (seconds_remain >= 0) valid_advertises_count++;
                }
                const user_percentage_by_ads = rule_ads.find(object => object.ads_quantity >= valid_advertises_count)?.percentage || rule_ads.find(object => object.ads_quantity === 0)?.percentage || 1
                const new_balance_not_available_rest = user_percentage_by_ads * wallet.p2p_earnings / 100
                let new_balance
                let new_balance_not_available
                if ((wallet.not_available - new_balance_not_available_rest) <= 0) {
                    new_balance = wallet.balance + wallet.not_available
                    new_balance_not_available = 0
                    await conexion.query('UPDATE wallets SET p2p_earnings=($1) WHERE owner=($2)', [0, wallet.owner])
                } else {
                    new_balance = wallet.balance + new_balance_not_available_rest
                    new_balance_not_available = wallet.not_available - new_balance_not_available_rest
                }
                await conexion.query('UPDATE wallets SET balance=($1), not_available=($2), last_not_available_release=($3) WHERE owner=($4)', [new_balance, new_balance_not_available, new Date(), wallet.owner])
            }
        }

    }
}