import { TodoItem } from './model.js'
import crypto from 'crypto';
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
    TodoItems: async () => {
        const client = getPgClient();
        const text = 'SELECT * FROM todoitem;';

        await client.connect();
        const res = await client.query(text);
        client.end();
        return res.rows;
        
    },
    TodoItem: async ({ id }) => {
        const client = getPgClient();
        const text = "SELECT * FROM todoitem WHERE id = $1;"
        const values = [id];

        await client.connect();
        const res = await client.query(text, values);
        return res.rows[0];
    },
    addTodoItem: ({ input }) => {
        let id = crypto.randomBytes(10).toString('hex');
        mockDatabase.push({id, ...input});
        return new TodoItem(id, input);
    },
    updateTodoItem: ({ id, input }) => {
        let foundIndex = mockDatabase.findIndex(x => x.id === id);        
        mockDatabase[foundIndex] = {id, ...input};
        return new TodoItem(id, input);
    },
    deleteTodoItem: ({ id, input }) => {
        let foundIndex = mockDatabase.findIndex(x => x.id === id);
        mockDatabase = [
            ...mockDatabase.slice(0, foundIndex), 
            ...mockDatabase.slice(foundIndex + 1)
        ];
        return new TodoItem(id, input);
    }
};

export default resolver;