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
        // let id = crypto.randomBytes(10).toString('hex');
        // mockDatabase.push({id, ...input});
        // return new Todo(id, input);
        const client = getPgClient();
        const text = "INSERT INTO todo(description, done) VALUES ($1, $2) RETURNING id;"
        const values = [input.description, input.done];

        await client.connect();
        const res = await client.query(text ,values);
        return new Todo(res.rows[0].id, input);

    },
    updateTodo: ({ id, input }) => {
        let foundIndex = mockDatabase.findIndex(x => x.id === id);        
        mockDatabase[foundIndex] = {id, ...input};
        return new Todo(id, input);
    },
    deleteTodo: ({ id, input }) => {
        let foundIndex = mockDatabase.findIndex(x => x.id === id);
        mockDatabase = [
            ...mockDatabase.slice(0, foundIndex), 
            ...mockDatabase.slice(foundIndex + 1)
        ];
        return new Todo(id, input);
    }
};

export default resolver;