const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, required: true },
  classId: { type: mongoose.Schema.Types.ObjectId },
  value: { type: Number, required: true }
});

module.exports = mongoose.model('Grade', GradeSchema);
