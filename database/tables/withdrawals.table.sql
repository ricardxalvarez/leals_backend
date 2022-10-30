CREATE TYPE withdrawals_status AS ENUM ('processing', 'denied', 'successful');

CREATE TABLE withdrawals (
    withdrawal_id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION CHECK(amount > 0),
    status WITHDRAWALS_STATUS NOT NULL DEFAULT('processing'),
    requested_at timestamptz NOT NULL
);