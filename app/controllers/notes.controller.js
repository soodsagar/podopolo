const mongoose = require('mongoose');
const User = mongoose.model('User');
const Note = mongoose.model('Note');
const uuid = require('uuid');
const rateLimiter = require('../middleware/rateLimiter');

exports.createNote = async (req, res) => {
  try {
    const note = new Note();
    note.users = [req.user._id];
    note.content = req.body.note.content;

    const newNote = await Note.create(note);
    res.json({ note: [{ id: newNote._id }] });

  } catch (error) {
    console.log(error);
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ users: { $in: [req.user.id] }});
    res.json({ note: notes });
  } catch (error) {
    console.log(error);
  }
};

exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.json({ note: [ note ] });
  } catch (error) {
    console.log(error);
  }
};

exports.updateNoteById = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, {
      content: req.body.note.content,
    }, { new: true });
    if (note !== null) {
      res.status(204).end();
    } else {
      res.status(500).json({ message: 'Resource not updated' }).end()
    }
  } catch (error) {
    console.log(error);
  }
};

exports.deleteNoteById = async (req, res) => {
  try {
    const note = await Note.deleteOne({ _id: req.params.id });
    res.status(204).end();
  } catch (error) {
    console.log(error);
  }
};

exports.shareNote = async (req, res) => {
  try {
    const user = await User.findById(req.body.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' }).end();
    }
    const note = await Note.findByIdAndUpdate(req.params.id, { 
      $addToSet: { users: req.body.user.id  } 
    });

    if (note !== null) {
      res.status(204).end();
    } else {
      res.status(500).json({ message: 'Resource not updated' }).end()
    }
  } catch (error) {
    console.log(error);
  }
};

exports.searchNotes = async (req, res) => {
  try {
    const searchTerm = req.query.content;
    if (searchTerm === null || searchTerm === undefined) {
      return res.status(400).json({ message: "Missing 'content' field in query parameters"});
    }
    const notes = await Note.find({ 
      users: { $in: [req.user.id] }, 
      $text: { $search:  searchTerm }
    });
    res.json({ note: notes });
  } catch (error) {
    console.log(error);
  }
};