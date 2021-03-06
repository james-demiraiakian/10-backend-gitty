-- Use this file to define your SQL tables
-- The SQL in this file will be executed when you run `npm run setup-db`
DROP TABLE IF EXISTS github_users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

CREATE TABLE github_users (
    id INT GENERATED ALWAYS AS IDENTITY,
    username TEXT NOT NULL PRIMARY KEY,
    email TEXT,
    avatar TEXT
);

CREATE TABLE posts (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    text varchar(255) NOT NULL,
    username TEXT REFERENCES github_users(username)
);