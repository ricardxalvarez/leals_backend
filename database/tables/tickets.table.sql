CREATE TYPE ticket_type AS ENUM ('buy', 'sell');

CREATE TYPE ticket_status AS ENUM ('pending', 'precompleted', 'completed', 'prefinished', 'finished', 'annulled');

CREATE TABLE tickets (
    ticket_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount INT NOT NULL,
    remain INT NOT NULL,
    created_at timestamptz NOT NULL,
    status TICKET_STATUS DEFAULT('pending') NOT NULL,
    type TICKET_TYPE NOT NULL
);