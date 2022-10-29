CREATE TABLE withdrawals (
    withdrawal_id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION CHECK(amount > 0),
    approved BOOLEAN NOT NULL DEFAULT(false),
    requested_at timestamptz NOT NULL
);