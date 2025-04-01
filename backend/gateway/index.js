require('dotenv').config();
const { ApolloServer } = require('@apollo/server');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const express = require('express');
const cors = require('cors');
const { expressMiddleware } = require('@apollo/server/express4');
const { verifyToken } = require('../shared/auth');

const app = express();
app.use(cors());
app.use(express.json());



class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    if (context.token) {
      request.http.headers.set('authorization', `Bearer ${context.token}`);
    }
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001/graphql' },
    { name: 'classes', url: 'http://localhost:4002/graphql' },
    { name: 'courses', url: 'http://localhost:4003/graphql' },
    { name: 'grades', url: 'http://localhost:4004/graphql' }
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  }
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.start().then(() => {
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      const auth = req.headers.authorization || '';
      if (auth.startsWith('Bearer ')) {
        try {
          const rawToken = auth.replace('Bearer ', '');
          const decoded = verifyToken(rawToken);
          console.log(" decoded user from token", decoded);
          return {
            user: decoded,
            token: rawToken 
          };
        } catch (err) {
          console.error("Invalid token:", err.message);
        }
      }
      return {};
    }
  }));

  app.listen(4000, () => {
    console.log('Gateway running at http://localhost:4000/graphql');
  });
});
