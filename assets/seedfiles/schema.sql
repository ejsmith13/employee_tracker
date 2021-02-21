DROP DATABASE IF EXISTS tracker_db;

CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
    id INT(10) AUTO_INCREMENT NOT NULL,
    department VARCHAR(30) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT(10) AUTO_INCREMENT NOT NULL,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10) NOT NULL,
    department_id INT(10) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE employee (
    id INT(10) AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id  INT(10) NOT NULL,
    manager_id INT(10) NULL,
    PRIMARY KEY(id)
);