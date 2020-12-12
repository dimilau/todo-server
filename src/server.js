import express from 'express';
import { graphqlHTTP } from 'express-graphql';

import { schema, resolver } from './schema.js';

// Express
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
  })
);

export default app;