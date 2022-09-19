CREATE TABLE p2p_config (
    split DOUBLE PRECISION NOT NULL,
    is_selling_active BOOLEAN DEFAULT(true) NOT NULL,
    is_buying_active BOOLEAN DEFAULT(true) NOT NULL,
    value_compared_usdt DOUBLE PRECISION NOT NULL,
    rules_commissions JSON ARRAY
);