import { buildSchema } from 'graphql';
  
const schema = buildSchema(`
    input TodoInput {
        description: String!
        done: Boolean!
    },
    type Todo {
        id: ID!
        description: String!
        done: Boolean!
    }
    type Query {
        Todos: [Todo]!
        Todo(id: ID!): Todo!
    }
    type Mutation {
        addTodo(input: TodoInput): Todo
        updateTodo(id: ID! input: TodoInput): Todo
        deleteTodo(id: ID!): Todo
    }
`);

export default schema;