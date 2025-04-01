const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId }]
});

module.exports = mongoose.model('Class', ClassSchema);
