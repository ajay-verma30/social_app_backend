-- Enable pgcrypto extension for encryption functions like pgp_sym_encrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the specific schema namespace your queries expect
CREATE SCHEMA IF NOT EXISTS socializer;

DROP TABLE IF EXISTS socializer.refresh_tokens CASCADE;
DROP TABLE IF EXISTS socializer.users CASCADE;

CREATE TABLE socializer.users (
    id SERIAL PRIMARY KEY,
    userName VARCHAR(255) UNIQUE NOT NULL,
    passwordHash VARCHAR(255) NOT NULL,
    email BYTEA NOT NULL, -- encrypted fields are stored as BYTEA/TEXT
    f_name BYTEA NOT NULL,
    l_name BYTEA NOT NULL,
    birthDate BYTEA NOT NULL,
    lastactive TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE socializer.refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES socializer.users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);