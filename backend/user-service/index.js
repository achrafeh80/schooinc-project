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
  console.log(" MongoDB connected (user-service)");
});

const server = new ApolloServer({   schema: buildSubgraphSchema({ typeDefs, resolvers }) });

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      console.log("[user-service] Header reçu :", auth);
    
      if (auth.startsWith('Bearer ')) {
        try {
          const decoded = verifyToken(auth.replace('Bearer ', ''));
          console.log(" [user-service] JWT valide :", decoded);
          return { user: decoded };
        } catch (e) {
          console.error(" [user-service] JWT invalide");
        }
      }
    
      return {};
    }    
  }));

  const port = process.env.PORT || 4001;
  app.listen(port, () => {
    console.log(` User service ready at http://localhost:${port}/graphql`);
  });
});