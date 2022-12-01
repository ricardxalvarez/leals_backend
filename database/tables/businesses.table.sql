CREATE TYPE businesses_types AS ENUM ('local', 'local professional', 'mobility', 'professional online', 'buy s/p')

CREATE TYPE business_status_type AS ENUM ('in review', 'approved', 'denied')

CREATE TABLE businesses (
    business_id BIGSERIAL PRIMARY KEY NOT NULL,
    owner BIGINT REFERENCES usuarios(id) NOT NULL,
    type businesses_types NOT NULL,
    category VARCHAR(50) NOT NULL,
    country VARCHAR(2) NOT NULL,
    lat VARCHAR(20),
    long VARCHAR(20),
    number_phone VARCHAR(50),
    business_status BUSINESS_STATUS_TYPE DEFAULT('in review') NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    business_name VARCHAR(70),
    description VARCHAR(255),
    address VARCHAR(255),
    gift_percentage DOUBLE PRECISION NOT NULL,
    website_url VARCHAR(255),
    facebook_url VARCHAR(255),
    instagram_url VARCHAR(255),
    tiktok_url VARCHAR(255),
    opening_time VARCHAR(10),
    closing_time VARCHAR(10),
    fee_per_hour DOUBLE PRECISION,
    fee_per_kilometer DOUBLE PRECISION,
    driver_name VARCHAR(50),
    registration_number_car VARCHAR(25),
    product_name VARCHAR(70),
    product_price DOUBLE PRECISION
);