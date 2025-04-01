const { gql } = require('graphql-tag');

module.exports = gql`
  type User @key(fields: "id"){
    id: ID!
    email: String!
    pseudo: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    listUsers: [User!]!
  }

  type Mutation {
    register(email: String!, pseudo: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateUser(pseudo: String!): User
    deleteUser: Boolean
  }
`;
