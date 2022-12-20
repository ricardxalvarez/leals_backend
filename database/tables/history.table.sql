CREATE TYPE history_type AS ENUM ('withdrawal', 'transfer', 'commission', 'weekly payment', 'balance add', 'balance decreased', 'penalty payment');

CREATE TYPE history_withdrawal_condition AS ENUM ('processing', 'denied', 'successful');

CREATE TYPE cash_flow_type AS ENUM ('income', 'outcome');

CREATE TABLE history (
    history_id BIGSERIAL NOT NULL PRIMARY KEY,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    amount DOUBLE PRECISION,
    leals_amount DOUBLE PRECISION,
    date TIMESTAMPTZ,
    currency VARCHAR(25),
    percentage VARCHAR(5),
    ads_number BIGINT,
    new_business BIGINT,
    destinary_transfer VARCHAR(25) REFERENCES usuarios(nombre_usuario),
    sender_transfer VARCHAR(25) REFERENCES usuarios(nombre_usuario),
    username_network_commision VARCHAR(25) REFERENCES usuarios(nombre_usuario),
    user_level_network_commision VARCHAR(5),
    history_type HISTORY_TYPE NOT NULL,
    widthdrawal_condition HISTORY_WITHDRAWAL_CONDITION,
    cash_flow CASH_FLOW_TYPE NOT NULL,
    surplus DOUBLE PRECISION,
    surplus_leals DOUBLE PRECISION,
    percentage_commission DOUBLE PRECISION,
    withdrawal_related BIGINT REFERENCES withdrawals(withdrawal_id)
);

ALTER TYPE history_type ADD VALUE 'penalty payment';

ALTER TABLE history ADD COLUMN widthdraw_condition HISTORY_WITHDRAW_CONDITION;

ALTER TABLE history ADD COLUMN cash_flow CASH_FLOW_TYPE NOT NULL;

ALTER TABLE history ADD COLUMN leals_amount DOUBLE PRECISION;