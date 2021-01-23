import { Todo } from './model.js';
import db from './db/index.js';

const resolver = {
  Todos: async () => {
    const text = 'SELECT * FROM Todo;';
    const res = await db.query(text);
    return res.rows.map((row) => new Todo(row.id, row));
  },
  Todo: async ({ id }) => {
    const text = 'SELECT * FROM Todo WHERE id = $1;';
    const values = [id];
    const res = await db.query(text, values);
    return new Todo(res.rows[0].id, res.rows[0]);
  },
  addTodo: async ({ input }) => {
    const text =
      'INSERT INTO todo(description, done) VALUES ($1, $2) RETURNING id;';
    const values = [input.description, input.done];
    const res = await db.query(text, values);
    return new Todo(res.rows[0].id, input);
  },
  updateTodo: async ({ id, input }) => {
    const text =
      'UPDATE todo SET description = $1, done = $2 WHERE id = $3 RETURNING *';
    const values = [input.description, input.done, id];
    const res = await db.query(text, values);
    return new Todo(res.rows[0].id, input);
  },
  deleteTodo: async ({ id }) => {
    const text = 'DELETE FROM todo WHERE id = $1 RETURNING *';
    const values = [id];
    const res = await db.query(text, values);
    return new Todo(res.rows[0].id, res.rows[0]);
  },
};

export default resolver;
