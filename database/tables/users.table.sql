CREATE TABLE usuarios (
    id BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
    full_nombre VARCHAR(50) NOT NULL,
    password1 VARCHAR(150) NOT NULL,
    password2 VARCHAR(150),
    telefono VARCHAR(25),
    habilidades VARCHAR(200),
    status_p2p user_status_p2p NOT NULL DEFAULT('inactive'),
    nombre_usuario VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    codigo_pais VARCHAR(2),
    avatar VARCHAR(100000),
    is_email_verified BOOLEAN DEFAULT(false),
    is_phone_verified BOOLEAN DEFAULT(false),
    id_sponsor BIGINT,
    id_progenitor BIGINT,
    payment_methods JSON ARRAY,
    usd_direction VARCHAR(50),
    leal_direction VARCHAR(50)
);

CREATE INDEX nombre_usuario ON usuarios(nombre_usuario);
CREATE INDEX email ON usuarios(email);
CREATE INDEX phone ON usuarios(telefono);

-- main user
INSERT INTO usuarios(full_nombre, email, codigo_pais, nombre_usuario, password1) VALUES ("leal leals", "support@leals.app", "PE", "birthleals", "$2a$10$OL9mZiU7IITPuDvfVMw4ie.G.MHSvOmSkr.PkpNchq4tdmfV51LAa");

CREATE TYPE user_status_p2p AS ENUM ('active', 'inactive');

ALTER TABLE usuarios DROP TABLE status_p2p;

ALTER TABLE usuarios ADD COLUMN status_p2p user_status_p2p NOT NULL DEFAULT('inactive');