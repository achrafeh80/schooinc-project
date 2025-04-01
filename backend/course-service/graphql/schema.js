const { gql } = require('graphql-tag');

module.exports = gql`
  type Course @key(fields: "id"){
    id: ID!
    title: String!
    description: String
    instructorId: ID!
  }

  type Query {
    listCourses: [Course!]!
    getCourse(id: ID!): Course
  }

  type Mutation {
    createCourse(title: String!, description: String): Course
    updateCourse(id: ID!, title: String, description: String): Course
    deleteCourse(id: ID!): Boolean
  }
`;
