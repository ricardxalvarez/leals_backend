CREATE TABLE tokens (
    id BIGSERIAL NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    timestamp timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX owner ON tokens(owner);

CREATE FUNCTION tokens_delete_old_rows() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  DELETE FROM tokens WHERE timestamp < NOW() - INTERVAL '5 minutes';
  RETURN NEW;
END;
$$;

CREATE TRIGGER tokens_delete_old_rows_trigger
    AFTER INSERT ON tokens
    EXECUTE PROCEDURE tokens_delete_old_rows();
