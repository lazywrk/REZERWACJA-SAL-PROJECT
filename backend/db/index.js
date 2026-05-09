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
        trustServerCertificate: true
    },

    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

async function connectDB(retries = 5) {

    try {

        if (pool) {
            return pool;
        }

        console.log('Łączenie z Azure SQL...');

        pool = await sql.connect(config);

        // REAL CONNECTION TEST
        await pool.request().query('SELECT 1');

        console.log('Połączono z Azure SQL');

        return pool;

    } catch (err) {

        console.error(
            'Błąd połączenia z bazą danych:',
            err.message
        );

        if (retries > 0) {

            console.log(
                `Ponowna próba połączenia... (${retries} pozostało)`
            );

            await new Promise(resolve =>
                setTimeout(resolve, 5000)
            );

            return connectDB(retries - 1);
        }

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