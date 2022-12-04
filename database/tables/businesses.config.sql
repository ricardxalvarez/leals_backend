CREATE TABLE businesses_config (
    cashback_for_customer DOUBLE PRECISION NOT NULL,
    leals_cashback DOUBLE PRECISION NOT NULL,
    earnings_by_level JSON ARRAY NOT NULL,
    commission_businesses_gift DOUBLE PRECISION ARRAY NOT NULL,
    businesses_types_categories JSON ARRAY NOT NULL,
    businesses_rating JSON ARRAY NOT NULL
);

-- businesses_types_categories {
    -- type: "local"
    -- categories: ["peluqueria", "barberia"]
    -- max_businesses_per_user: 5
-- }


-- businesses_rating {
    -- name: "bronce"
    -- users_quantity: 5
-- }