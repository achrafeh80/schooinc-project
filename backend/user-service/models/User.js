const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  pseudo: String,
  role: { type: String, enum: ['student', 'professor'] }
});

UserSchema.plugin(plm, { usernameField: 'email' });

module.exports = mongoose.model('User', UserSchema);
