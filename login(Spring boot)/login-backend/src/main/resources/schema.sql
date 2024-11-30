CREATE DATABASE loginapp;
USE loginapp;

CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (username, password) VALUES 
('admin', 'admin123'),
('user', 'user123');