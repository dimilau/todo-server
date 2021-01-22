import { Todo } from './model.js'
import pkg from 'pg';
const { Client } = pkg;
import yaml from 'js-yaml';
import fs from 'fs';

// mock DB
var mockDatabase = 
[
    { id: 'a', description: 'Buy milk.', done: false, },
    { id: 'b', description: 'Do the trash.', done: true, },
    { id: 'c', description: 'Wash the car', done: true, },
];

var getPgClient  = () => {
    const config = yaml.load(fs.readFileSync('./postgresrc.yml', 'utf8'));
    return new Client(config);
};

const resolver = {
    Todos: async () => {
        const client = getPgClient();
        const text = 'SELECT * FROM Todo;';

        await client.connect();
        const res = await client.query(text);
        client.end();
        return res.rows.map(row => new Todo(row.id,row));
        
    },
    Todo: async ({ id }) => {
        const client = getPgClient();
        const text = "SELECT * FROM Todo WHERE id = $1;"
        const values = [id];

        await client.connect();
        const res = await client.query(text, values);
        return new Todo(res.rows[0].id, res.rows[0]);
    },
    addTodo: async ({ input }) => {
        const client = getPgClient();
        const text = "INSERT INTO todo(description, done) VALUES ($1, $2) RETURNING id;";
        const values = [input.description, input.done];

        await client.connect();
        const res = await client.query(text ,values);
        return new Todo(res.rows[0].id, input);

    },
    updateTodo: async ({ id, input }) => {
        const client = getPgClient();
        const text = "UPDATE todo SET description = $1, done = $2 WHERE id = $3 RETURNING *";
        const values = [input.description, input.done, id];

        await client.connect();
        const res = await client.query(text, values);
        return new Todo(res.rows[0].id, input);
    },
    deleteTodo: async ({ id }) => {
        const client = getPgClient();
        const text = "DELETE FROM todo WHERE id = $1 RETURNING *";
        const values = [id];

        await client.connect();
        const res = await client.query(text, values);
        return new Todo(res.rows[0].id, res.rows[0]);
    }
};

export default resolver;