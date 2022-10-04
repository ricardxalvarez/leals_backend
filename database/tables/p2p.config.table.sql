CREATE TABLE p2p_config (
    initial_split DOUBLE PRECISION NOT NULL DEFAULT(250000000) CHECK(initial_split>split),
    split DOUBLE PRECISION NOT NULL,
    is_selling_active BOOLEAN DEFAULT(true) NOT NULL,
    is_buying_active BOOLEAN DEFAULT(true) NOT NULL,
    value_compared_usdt DOUBLE PRECISION NOT NULL,
    p2p_sells_fee DOUBLE PRECISION NOT NULL DEFAULT(0),
    rules_commissions JSON ARRAY
);

INSERT INTO p2p_config (split, value_compared_usdt, p2p_sells_fee) VALUES (200000, 0.25, 2);

ALTER TABLE p2p_config ADD COLUMN initial_split DOUBLE PRECISION NOT NULL DEFAULT(250000000) CHECK(initial_split>split);