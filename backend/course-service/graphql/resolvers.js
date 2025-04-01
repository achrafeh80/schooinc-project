const Course = require('../models/Course');

module.exports = {
  Query: {
    listCourses: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Course.find().sort({ title: 1 });
    },
    getCourse: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Course.findById(id);
    }
  },
  Mutation: {
    createCourse: async (_, { title, description }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors can create courses");
      return await Course.create({ title, description, instructorId: user.id });
    },
    updateCourse: async (_, { id, title, description }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Not authorized");
      const course = await Course.findById(id);
      if (!course) throw new Error("Course not found");
      if (course.instructorId.toString() !== user.id) throw new Error("Not your course");
      if (title !== undefined) course.title = title;
      if (description !== undefined) course.description = description;
      await course.save();
      return course;
    },
    deleteCourse: async (_, { id }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Not authorized");
      const course = await Course.findById(id);
      if (!course) return false;
      if (course.instructorId.toString() !== user.id) throw new Error("Not your course");
      await course.deleteOne();
      return true;
    }
  }
};
