const User = require('../models/User');
const { signToken, verifyToken } = require('../../shared/auth');

module.exports = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    },
    listUsers: async (_, __, { user }) => {
      if (!user || user.role !== 'professor') throw new Error("Not authorized");
      return await User.find({ role: 'student' }, '_id pseudo');
    }    
  },
  Mutation: {
    register: async (_, { email, pseudo, password, role }) => {
      const user = new User({ email, pseudo, role });
      await User.register(user, password);
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const { user } = await User.authenticate()(email, password);
      const token = signToken(user);
      return { token, user };
    },
    updateUser: async (_, { pseudo }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findByIdAndUpdate(user.id, { pseudo }, { new: true });
    },
    deleteUser: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      await User.findByIdAndDelete(user.id);
      return true;
    }
  }
};
