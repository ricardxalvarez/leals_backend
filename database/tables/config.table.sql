CREATE TABLE config (
    is_buying_active BOOLEAN DEFAULT(true) NOT NULL,
    is_selling_active BOOLEAN DEFAULT(true) NOT NULL,
    is_registering_active BOOLEAN DEFAULT(true) NOT NULL,
    wthdrawal_sell_minimun_amount DOUBLE PRECISION DEFAULT(10)
);