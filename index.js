const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');

// mock DB
var mockDatabase = {
    'a':{
        id: 'a',
        description: "Buy milk.",
        done: false,
    },
    'b': {
        id: 'b',
        description: "Do the trash.",
        done: true,
    },
    'c': {
        id: 'c',
        description: "Wash the car",
        done: true,
    }
}

class ListItem {
    constructor(id, {description, done}) {
        this.id = id;
        this.description = description;
        this.done = done;
    }
}

var schema = buildSchema(`
    type ListItem {
        id: ID!,
        description: String!
        done: Boolean
    }
    type Query {
        listItem(id: ID!): ListItem!
    }
`);

var root= {
    listItem: ({id}) => {
        if (!mockDatabase[id]) {
            throw new Error('No item exist with id ' + id);
        }
        return new ListItem(id, mockDatabase[id]);

    }
}

// Express
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
})
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root, 
        graphiql: true,
    })
)
app.listen(4000);