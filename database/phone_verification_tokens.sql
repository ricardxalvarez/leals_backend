CREATE TABLE phone_verification_tokens (
    id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    code BIGINT NOT NULL,
    timestamp timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX owner ON phone_verification_tokens(owner);