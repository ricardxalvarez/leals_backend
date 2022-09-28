CREATE TYPE advertises_status AS ENUM ('approved', 'denied', 'in review');

CREATE TABLE advertises (
    advertise_id BIGSERIAL NOT NULL UNIQUE,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    status ADVERTISES_STATUS NOT NULL DEFAULT('in review'),
    post_link VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL
);