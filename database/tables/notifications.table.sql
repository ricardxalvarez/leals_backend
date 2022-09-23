CREATE TABLE notifications (
    notification_id BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    read BOOLEAN DEFAULT(false) NOT NULL,
    message VARCHAR(200),
    date TIMESTAMPTZ NOT NULL
);