CREATE TABLE transfers (
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION CHECK(amount > 0),
    destinary BIGINT REFERENCES usuarios(id) NOT NULL
)