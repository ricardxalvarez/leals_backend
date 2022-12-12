CREATE TABLE packages (
    package_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    usdt_quantity DOUBLE PRECISION NOT NULL,
    available_packages BIGINT DEFAULT(100) CHECK(available_packages >= 0),
    users_to_free_package DOUBLE PRECISION DEFAULT(0)
);