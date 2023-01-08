CREATE TYPE payment_status_type AS ENUM ('approved', 'denied', 'in review');

CREATE TABLE business_payments (
    payment_id BIGSERIAL PRIMARY KEY NOT NULL,
    owner BIGINT REFERENCES usuarios(id),
    business_id BIGINT REFERENCES businesses(business_id),
    payment_status PAYMENT_STATUS_TYPE DEFAULT('in review') NOT NULL,
    id_hash VARCHAR(100) NOT NULL,
    image VARCHAR(255),
    amount DOUBLE PRECISION NOT NULL,
    created_at timestamptz NOT NULL
);