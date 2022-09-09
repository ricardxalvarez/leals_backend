CREATE TABLE wallets (
    owner BIGINT REFERENCES usuarios(id) UNIQUE PRIMARY KEY,
    balance NUMERIC NOT NULL DEFAULT(0),
    not_available NUMERIC NOT NULL DEFAULT(0),
    balance_to_sell NUMERIC NOT NULL DEFAULT(0)
);