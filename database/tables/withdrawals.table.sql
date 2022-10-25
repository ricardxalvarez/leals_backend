CREATE TABLE withdrawals (
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION CHECK(amount > 0),
    approved BOOLEAN NOT NULL DEFAULT(false)
)