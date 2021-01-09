import { buildSchema } from 'graphql';
  
const schema = buildSchema(`
    input TodoItemInput {
        description: String!
        done: Boolean!
    },
    type TodoItem {
        id: ID!
        description: String!
        done: Boolean!
    }
    type Query {
        TodoItems: [TodoItem]!
        TodoItem(id: ID!): TodoItem!
    }
    type Mutation {
        addTodoItem(input: TodoItemInput): TodoItem
        updateTodoItem(id: ID! input: TodoItemInput): TodoItem
    }
`);

export default schema;