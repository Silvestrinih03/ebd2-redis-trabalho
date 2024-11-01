// Criado apenas para testar a conexão com MySQL > O que está sendo utilizado para criar a conexão é o arquivo db.ts
import mysql, { ConnectionOptions } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const access: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

const conn = mysql.createConnection(access);

conn.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
    // Encerra a conexão após o teste
    conn.end();
});
