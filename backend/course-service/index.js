require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const mongoose = require('mongoose');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const { verifyToken } = require('../shared/auth');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log(" MongoDB connected (course-service)");
});

const server = new ApolloServer({   schema: buildSubgraphSchema({ typeDefs, resolvers }) });

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) {
        try {
          const decoded = verifyToken(auth.replace('Bearer ', ''));
          return { user: decoded };
        } catch {}
      }
      return {};
    }
  }));

  const port = process.env.PORT || 4003;
  app.listen(port, () => {
    console.log(` Course service ready at http://localhost:${port}/graphql`);
  });
});