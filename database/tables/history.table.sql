CREATE TYPE history_type AS ENUM ('withdraw', 'transfer', 'commission', 'weekly payment', 'balance add', 'balance decreased');

CREATE TYPE history_withdraw_condition AS ENUM ('received', 'not received');

CREATE TYPE cash_flow_type AS ENUM ('income', 'outcome');

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
    history_type HISTORY_TYPE NOT NULL,
    widthdraw_condition HISTORY_WITHDRAW_CONDITION,
    cash_flow CASH_FLOW_TYPE NOT NULL
);

ALTER TYPE history_type ADD VALUE 'penalty payment';

ALTER TABLE history ADD COLUMN widthdraw_condition HISTORY_WITHDRAW_CONDITION;

ALTER TABLE history ADD COLUMN cash_flow CASH_FLOW_TYPE NOT NULL;