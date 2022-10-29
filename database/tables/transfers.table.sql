CREATE TABLE transfers (
    transfer_id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION CHECK(amount > 0),
    destinary BIGINT REFERENCES usuarios(id) NOT NULL,
    created_at timestamptz NOT NULL
);