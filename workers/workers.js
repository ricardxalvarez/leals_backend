import orders_date_limit from "./order.date_limit.js";
import wallet_free_not_available from "./wallet_free_not_available_balance.js";
function workers() {
    orders_date_limit()
    wallet_free_not_available()
}

export default workers;