CREATE TABLE email_verification_tokens (
    id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    code BIGINT NOT NULL,
    timestamp timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX owner ON email_verification_tokens(owner);

CREATE FUNCTION tokens_delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM tokens WHERE timestamp < NOW() - INTERVAL '1 minute';
  RETURN NEW;
END;
$$;

CREATE TRIGGER tokens_delete_old_rows_trigger
    AFTER INSERT ON tokens
    EXECUTE PROCEDURE tokens_delete_old_rows();
