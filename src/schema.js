import { buildSchema } from 'graphql';
  
const schema = buildSchema(`
    type ListItem {
        id: ID!,
        description: String!
        done: Boolean
    }
    type Query {
        listItem(id: ID!): ListItem!
    }
`);



export default schema;