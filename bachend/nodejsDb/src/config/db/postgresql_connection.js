const Pool = require('pg').Pool;
const dotenv = require('dotenv');

// import { pg } from 'pg';
// const Pool = pg.Pool
dotenv.config();

const connect_postgresql = async () => {
    try {
        const client = new Client({
            user: process.env.PGUSER,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        });

        await client.connect();
        const res = await client.query('SELECT * FROM some_table');
        console.log(res);
        await client.end();
    } catch (error) {
        console.log(error);
    }
};

const pool = new Pool({
    user: 'react_fastapi',
    host: 'localhost',
    password: 'react_fastapi',
    database: 'ZATools',
    port: 5432,
});

module.exports = { pool };
