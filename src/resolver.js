import { ListItem } from './model.js'

// mock DB
var mockDatabase = 
{
    a: {
        id: 'a',
        description: 'Buy milk.',
        done: false,
    },
    b: {
        id: 'b',
        description: 'Do the trash.',
        done: true,
    },
    c: {
        id: 'c',
        description: 'Wash the car',
        done: true,
    },
};

const resolver = {
    listItem: ({ id }) => {
        if (!mockDatabase[id]) {
        throw new Error('No item exist with id ' + id);
        }
        return new ListItem(id, mockDatabase[id]);
    },
};

export default resolver;