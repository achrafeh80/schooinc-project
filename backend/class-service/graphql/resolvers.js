const Class = require('../models/Class');

module.exports = {
  Query: {
    listClasses: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Class.find().sort({ name: 1 });
    },
    getClass: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await Class.findById(id);
    }
  },
  Mutation: {
    createClass: async (_, { name }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors can create classes");
      return await Class.create({ name, professorId: user.id, studentIds: [] });
    },
    updateClass: async (_, { id, name }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const cls = await Class.findById(id);
      if (!cls) throw new Error("Class not found");
      if (cls.professorId.toString() !== user.id) throw new Error("Not your class");
      cls.name = name;
      await cls.save();
      return cls;
    },
    deleteClass: async (_, { id }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const cls = await Class.findById(id);
      if (!cls) return false;
      if (cls.professorId.toString() !== user.id) throw new Error("Not your class");
      if (cls.studentIds.length > 0) throw new Error("Class has students");
      await cls.deleteOne();
      return true;
    },
    addStudentToClass: async (_, { classId, studentId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors can modify classes");
      const cls = await Class.findById(classId);
      if (!cls) throw new Error("Class not found");
      if (cls.professorId.toString() !== user.id) throw new Error("Not your class");
      if (!cls.studentIds.includes(studentId)) {
        cls.studentIds.push(studentId);
        await cls.save();
      }
      return cls;
    },
    removeStudentFromClass: async (_, { classId, studentId }, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Only professors can modify classes");
      const cls = await Class.findById(classId);
      if (!cls) throw new Error("Class not found");
      if (cls.professorId.toString() !== user.id) throw new Error("Not your class");
      cls.studentIds = cls.studentIds.filter(id => id.toString() !== studentId);
      await cls.save();
      return cls;
    }
  }
};
