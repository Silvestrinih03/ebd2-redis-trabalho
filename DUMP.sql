DROP DATABASE IF EXISTS mini_projeto_ebd2;
CREATE DATABASE mini_projeto_ebd2;

DROP TABLE IF EXISTS mini_projeto_ebd2.products;
CREATE TABLE mini_projeto_ebd2.products(
	ID INT not null primary key auto_increment,
    NAME varchar(50) not null,
    PRICE decimal(10,2) not null default 0,
    DESCRIPTION varchar(500) not null
);

INSERT INTO mini_projeto_ebd2.products (
	NAME,
    PRICE,
    DESCRIPTION
) VALUES (
	'ROLEX SUBMARINER',
    12000,
    'Descrição do relógio de pulso'
);

INSERT INTO mini_projeto_ebd2.products (
	NAME,
    PRICE,
    DESCRIPTION
) VALUES (
	'ROLEX DAYTONA',
    230000,
    'Descrição do relógio de pulso'
);

-- Comandos eventualmente úteis no MySQL
-- Criação de um usuário e permissão no schema
/*
CREATE USER IF NOT EXISTS 'ebd2'@'%' IDENTIFIED BY 'senhaqualquer';
GRANT ALL ON mini_projeto_ebd2.* TO 'ebd2'@'%';*/