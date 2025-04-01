const Grade = require('../models/Grade');

const computeStats = (values) => {
  if (!values.length) return { min: 0, max: 0, median: 0 };
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];
  return { min, max, median };
};

module.exports = {
  Query: {
    myGrades: async (_, { courseId }, { user }) => {
      if (!user || user.role !== 'student') throw new Error("Only students can view their grades");
      const filter = { studentId: user.id };
      if (courseId) filter.courseId = courseId;
      return await Grade.find(filter);
    },
    classGrades: async (_, { classId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      return await Grade.find({ classId });
    },
    courseGrades: async (_, { courseId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      return await Grade.find({ courseId });
    },
    gradeStatsByStudent: async (_, { studentId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      const grades = await Grade.find({ studentId });
      const values = grades.map(g => g.value);
      return computeStats(values);
    },
    gradeStatsByClass: async (_, { classId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      const grades = await Grade.find({ classId });
      const values = grades.map(g => g.value);
      return computeStats(values);
    },
    gradeStatsByCourse: async (_, { courseId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      const grades = await Grade.find({ courseId });
      const values = grades.map(g => g.value);
      return computeStats(values);
    },
  },

  Mutation: {
    addGrade: async (_, { studentId, courseId, classId, value }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      return await Grade.create({ studentId, courseId, classId, value });
    },
    updateGrade: async (_, { id, value }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      const grade = await Grade.findById(id);
      if (!grade) throw new Error("Grade not found");
      grade.value = value;
      await grade.save();
      return grade;
    },
    deleteGrade: async (_, { id }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors");
      const grade = await Grade.findById(id);
      if (!grade) return false;
      await grade.deleteOne();
      return true;
    }
  }
};
