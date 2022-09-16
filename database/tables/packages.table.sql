CREATE TABLE packages (
    package_id BIGSERIAL UNIQUE NOT NULL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    leals_quantity DOUBLE PRECISION NOT NULL,
    available_packages BIGINT DEFAULT(100) CHECK(available_packages >= 0)
);