const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructorId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('Course', CourseSchema);
