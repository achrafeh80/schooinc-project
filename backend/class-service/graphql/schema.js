const { gql } = require('graphql-tag');

module.exports = gql`
  type Class @key(fields: "id"){
    id: ID!
    name: String!
    professorId: ID!
    studentIds: [ID!]!
  }

  type Query {
    listClasses: [Class!]!
    getClass(id: ID!): Class
  }

  type Mutation {
    createClass(name: String!): Class
    updateClass(id: ID!, name: String!): Class
    deleteClass(id: ID!): Boolean
    addStudentToClass(classId: ID!, studentId: ID!): Class
    removeStudentFromClass(classId: ID!, studentId: ID!): Class
  }
`;
