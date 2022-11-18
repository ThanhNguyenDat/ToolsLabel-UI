// const path = require('path');
const express = require('express');
const morgan = require('morgan');
// const methodOverride = require('method-override');
// const { engine } = require('express-handlebars');
const cors = require('cors');

// const route = require('./routes');
// const db = require('./config/db');
const { pool } = require('./config/db/postgresql_connection');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// HTTP logger
app.use(morgan('combined'));

app.use(
    express.urlencoded({
        extended: true,
    }),
);

// get all todoTask
app.get('/getClassficationBlaBla', async (req, res) => {
    try {
        pool.connect();
        console.log('start');
        const allTodoTask = await pool.query('SELECT * FROM public."classficationBlaBla"');
        console.log('start');

        res.json(allTodoTask.rows);
        console.log('end');
    } catch (err) {
        console.log('error: ', err.mesage);
    } finally {
        pool.end();
    }
});

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`);
});
