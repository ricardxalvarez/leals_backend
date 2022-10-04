CREATE TYPE history_type AS ENUM ('withdraw', 'transfer', 'commission', 'weekly payment', 'balance add', 'balance decreased');

CREATE TABLE history (
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION,
    date TIMESTAMPTZ,
    currency VARCHAR(25),
    percentage VARCHAR(5),
    ads_number BIGINT,
    new_business BIGINT,
    destinary_transfer VARCHAR(25) REFERENCES usuarios(nombre_usuario),
    username_network_commision VARCHAR(25) REFERENCES usuarios(nombre_usuario),
    user_level_network_commision VARCHAR(5),
    history_type HISTORY_TYPE NOT NULL
);