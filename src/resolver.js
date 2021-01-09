import { TodoItem } from './model.js'
import crypto from 'crypto';

// mock DB
var mockDatabase = 
[
    { id: 'a', description: 'Buy milk.', done: false, },
    { id: 'b', description: 'Do the trash.', done: true, },
    { id: 'c', description: 'Wash the car', done: true, },
];

const resolver = {
    TodoItems: () => {
        console.log(mockDatabase);
        return mockDatabase;
    },
    TodoItem: ({ id }) => {
        let todoItemFound = mockDatabase.find(todoItem => todoItem.id === id);        
        if (!todoItemFound) {
            throw new Error('No item exist with id ' + id);
        }
        return new TodoItem(id, todoItemFound);
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