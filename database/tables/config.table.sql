CREATE TABLE config (
    is_buying_active BOOLEAN DEFAULT(true) NOT NULL,
    is_selling_active BOOLEAN DEFAULT(true) NOT NULL,
    is_registering_active BOOLEAN DEFAULT(true) NOT NULL,
    withdrawal_minimum_amount DOUBLE PRECISION DEFAULT(10),
    transfer_minimum_amount DOUBLE PRECISION DEFAULT(10),
    sell_minimum_amount DOUBLE PRECISION DEFAULT(10)
);