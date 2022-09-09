CREATE TYPE order_status AS ENUM ('hashless', 'hashed', 'successfull', 'cancelled');

CREATE TABLE orders (
    order_id BIGSERIAL UNIQUE PRIMARY KEY,
    ticket_seller_id BIGINT REFERENCES tickets(ticket_id) NOT NULL,
    ticket_buyer_id BIGINT REFERENCES tickets(ticket_id) NOT NULL,
    amount NUMERIC NOT NULL,
    created_at timestamptz NOT NULL,
    deadline_seconds INT NOT NULL,
    status ORDER_STATUS DEFAULT('hashless'),
    proof VARCHAR(100000)
);