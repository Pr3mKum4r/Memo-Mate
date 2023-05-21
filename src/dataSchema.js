const mongoose = require('mongoose');

const NoteDataSchema = new mongoose.Schema({
   UserId: {
      type: String,
   },
   UserData:
   {
      NoteDataId: {
         type: String,
      },
      NoteDataText: {
         type: String,
      },
      NoteDataDate: {
         type: String,
      }
   }
});

const Note = mongoose.model('Note', NoteDataSchema);
module.exports = Note;