CREATE TABLE usuarios (
    id BIGSERIAL UNIQUE PRIMARY KEY NOT NULL,
    full_nombre VARCHAR(50) NOT NULL,
    password1 VARCHAR(150) NOT NULL,
    password2 VARCHAR(150),
    telefono VARCHAR(25),
    habilidades VARCHAR(50),
    status_p2p VARCHAR(35) DEFAULT('Incompleto'),
    nombre_usuario VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    codigo_pais VARCHAR(5),
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