const { gql } = require('graphql-tag');

module.exports = gql`
  type Grade @key(fields: "id"){
    id: ID!
    studentId: ID!
    courseId: ID!
    classId: ID
    value: Float!
  }

  type GradeStats {
    min: Float!
    max: Float!
    median: Float!
  }

  type Query {
    myGrades(courseId: ID): [Grade!]!
    classGrades(classId: ID!): [Grade!]!
    courseGrades(courseId: ID!): [Grade!]!
    gradeStatsByStudent(studentId: ID!): GradeStats!
    gradeStatsByClass(classId: ID!): GradeStats!
    gradeStatsByCourse(courseId: ID!): GradeStats!
    listGradesByStudent(studentId: ID!): [Grade!]!
  }

  type Mutation {
    addGrade(studentId: ID!, courseId: ID!, classId: ID, value: Float!): Grade
    updateGrade(id: ID!, value: Float!): Grade
    deleteGrade(id: ID!): Boolean
  }
`;
