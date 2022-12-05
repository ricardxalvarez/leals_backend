import conexion from '../database/conexion.js'

export default async function wallet_free_not_available() {
    const p2p_config = await (await conexion.query('SELECT * FROM p2p_config')).rows[0]
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
            const seconds_in_a_week = p2p_config.free_not_available_balance
            const seconds_remain = (((new Date().getTime() - new Date(wallet.last_not_available_release).getTime()) / 1000) - seconds_in_a_week) * -1
            if (seconds_remain <= 0) {
                const rule_ads = await (await conexion.query('SELECT rules_ads FROM p2p_config')).rows[0].rules_ads

                const advertises = await (await conexion.query('SELECT * FROM advertises WHERE owner=($1)', [wallet.owner])).rows
                let valid_advertises_count = 0
                for (let j = 0; j < advertises.length; j++) {
                    const ad = advertises[j];
                    const seconds_remain = (((new Date().getTime() - new Date(ad.created_at).getTime()) / 1000) - seconds_in_a_week) * -1
                    if (seconds_remain >= 0) valid_advertises_count++;
                }
                const user_percentage_by_ads = rule_ads.find(object => object.ads_quantity >= valid_advertises_count)?.percentage || rule_ads.find(object => object.ads_quantity === 0)?.percentage || 1
                const new_balance_not_available_rest = user_percentage_by_ads * wallet.p2p_earnings / 100
                await conexion.query('INSERT INTO history (history_type, amount, date, percentage, ads_number, owner, currency, cash_flow, leals_amount) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)', ['weekly payment', new_balance_not_available_rest, new Date(), user_percentage_by_ads, valid_advertises_count, wallet.owner, 'usdt', 'income', new_balance_not_available_rest / p2p_config.value_compared_usdt])
                // await conexion.query('INSERT INTO notifications (owner, message, date) VALUES ($1,$2,$3)', [wallet.owner, `Congratulations, you just received a commission.\n\\amount\\: 350usdt\n\\from user\\: ricardo12\n\\l evel\\: 5`, new Date()])
                await conexion.query('INSERT INTO notifications (owner, message, date) VALUES ($1,$2,$3)', [wallet.owner, `Congratulations on weekends is celebrated with a payment. Amount: ${new_balance_not_available_rest}usdt = ${new_balance_not_available_rest / p2p_config.value_compared_usdt} leals, Percentage: ${user_percentage_by_ads}% Ads: ${valid_advertises_count}`, new Date()])
                let new_balance
                let new_balance_not_available
                if ((wallet.not_available - new_balance_not_available_rest) <= 0) {
                    new_balance = wallet.balance + wallet.not_available
                    new_balance_not_available = 0
                    await conexion.query('UPDATE wallets SET p2p_earnings=($1) WHERE owner=($2)', [0, wallet.owner])
                    await conexion.query('UPDATE usuarios SET status_p2p=($1) WHERE id=($2)', ['inactive', wallet.owner])
                } else {
                    new_balance = wallet.balance + new_balance_not_available_rest
                    new_balance_not_available = wallet.not_available - new_balance_not_available_rest
                }
                await conexion.query('UPDATE wallets SET balance=($1), not_available=($2), last_not_available_release=($3) WHERE owner=($4)', [new_balance, new_balance_not_available, new Date(), wallet.owner])
            }
        }

    }
}