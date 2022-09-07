CREATE TYPE roles AS ENUM ('superadmin', 'admin');

CREATE TABLE admins (
    iduser BIGINT REFERENCES usuarios(id) NOT NULL UNIQUE PRIMARY KEY,
    role ROLES NOT NULL
);

CREATE INDEX role ON admins(role);