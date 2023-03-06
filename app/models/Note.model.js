const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const NoteSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: true
  },
  users: [{
    type: Schema.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
  }],
  content: {
    type: String,
    required: true,
    index: true
  },
}, { timestamps: true });

NoteSchema.index({ content: "text" });

module.exports = mongoose.model('Note', NoteSchema);
