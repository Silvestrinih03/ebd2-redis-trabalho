import mysql, { ConnectionOptions } from 'mysql2';
import dotenv from 'dotenv';
import { createClient } from 'redis';
dotenv.config();

const access: ConnectionOptions = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

export const conn = mysql.createConnection(access);

conn.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
    } else {
        console.log('Conectado ao MySQL');
    }
});

// Conexão com Redis
const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

(async () => {
    try {
        await redisClient.connect();
        console.log('Conectado ao Redis');
    } catch (err) {
        console.error('Erro ao conectar ao Redis:', err);
    }
})();

// Lidar com erros de conexão do Redis
redisClient.on('error', (err) => console.error('Redis Client Error:', err));

// Exportar redisClient para usar em outras partes da aplicação
export { redisClient };