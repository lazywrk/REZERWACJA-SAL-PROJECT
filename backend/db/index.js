require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),

    options: {
        encrypt: true,
        trustServerCertificate: false
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function connectDB() {
    try {
        if (pool) return pool;

        console.log('Łączenie z Azure SQL...');

        pool = await sql.connect(config);

        // FORCE REAL CONNECTION TEST
        await pool.request().query('SELECT 1');

        console.log('Połączono z Azure SQL');

        return pool;

    } catch (err) {
        console.error('Błąd połączenia z bazą danych:', err);
        throw err;
    }
}

function getPool() {
    if (!pool) {
        throw new Error('DB not initialized');
    }

    return pool;
}

module.exports = {
    sql,
    connectDB,
    getPool
};