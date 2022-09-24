CREATE TYPE ticket_type AS ENUM ('buy', 'sell');

CREATE TYPE ticket_status AS ENUM ('pending', 'precompleted', 'completed', 'prefinished', 'finished', 'annulled');

CREATE TABLE tickets (
    ticket_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    remain DOUBLE PRECISION NOT NULL CHECK(remain <= amount),
    created_at timestamptz NOT NULL,
    status TICKET_STATUS DEFAULT('pending') NOT NULL,
    type TICKET_TYPE NOT NULL,
    fee DOUBLE PRECISION,
    id_hash_fee VARCHAR(70)
);