CREATE TABLE businesses_comments (
    comment_id BIGSERIAL PRIMARY KEY NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    business_id BIGINT REFERENCES businesses(business_id) NOT NULL,
    comment VARCHAR(300) NOT NULL,
    stars INTEGER NOT NULL DEFAULT(0),
    created_at TIMESTAMPTZ NOT NULL
);