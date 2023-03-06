require('../app/models/Note.model');
const mockingoose = require('mockingoose');
const mongoose = require('mongoose');
const noteModel = mongoose.model('Note');

describe('Notes.model', () => {
  test('should return the note with findById', async () => {
    const mockNote = {
      _id: '507f191e810c19729de860ea',
      content: 'this is a fancy note',
    };

    mockingoose(noteModel).toReturn(mockNote, 'findOne');

    return noteModel.findById({ _id: '507f191e810c19729de860ea' }).then(doc => {
      expect(JSON.parse(JSON.stringify(doc))).toMatchObject(mockNote);
    });
  });

  test('should return the note with update', async () => {
    const mockNote = {
      _id: '607f191e810c19729de860ea',
      content: 'old note',
    };

    mockingoose(noteModel).toReturn(mockNote, 'update');

    return noteModel.findByIdAndUpdate('607f191e810c19729de860ea', { content: 'new content' })
      .then((nockNote) => {
        expect(JSON.parse(JSON.stringify(mockNote))).toMatchObject(mockNote);
      });
  });
});