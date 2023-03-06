const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const NoteSchema = new Schema({
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
}, { timestamps: true, versionKey: false });

// add index for faster text search
NoteSchema.index({ content: "text" });

module.exports = mongoose.model('Note', NoteSchema);
