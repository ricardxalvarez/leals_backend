CREATE TABLE p2p_config (
    initial_split DOUBLE PRECISION NOT NULL DEFAULT(250000000),
    value_compared_usdt DOUBLE PRECISION NOT NULL,
    p2p_sells_fee DOUBLE PRECISION NOT NULL DEFAULT(0),
    rules_commissions JSON ARRAY,
    rules_ads JSON ARRAY,
    not_available_earnings_stop DOUBLE PRECISION DEFAULT(300),
    sending_time_hash_seconds BIGINT DEFAULT(86400)
);

INSERT INTO p2p_config (initial_split, value_compared_usdt, p2p_sells_fee) VALUES (200000, 0.25, 2);

ALTER TABLE p2p_config ADD COLUMN initial_split DOUBLE PRECISION NOT NULL DEFAULT(250000000) CHECK(initial_split>=split);