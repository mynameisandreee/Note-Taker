const notes = require('express').Router();
const { readAndAppend, readFromFile, writeToFile } = require('../helpers/fsUtils');
const unid = require('../helpers/unid');

// GET Route for retrieving notes
notes.get('/', (req, res) =>
  readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting notes
notes.post('/', (req, res) => {
  const { title, text} = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
      id: unid(),
    };

    readAndAppend(newNote, './db/notes.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

//DELETE route for deleting notes
// DELETE route for deleting notes
notes.delete('/:id', (req, res) => {
  const noteId = req.params.id;

  const deleteNote = (noteId) => {
    return readFromFile('./db/notes.json').then((data) => {
      const noteData = JSON.parse(data);
      const noteIndex = noteData.findIndex(note => note.id === noteId);
      
      if (noteIndex !== -1) {
        noteData.splice(noteIndex, 1);
        writeToFile('./db/notes.json', noteData);
        return true;
      } else {
        return false;
      }
    });
  };

  deleteNote(noteId).then((response) => {
    if (response) {
      res.json('note deleted');
    } else {
      res.json('Error in finding note');
    }
  });
});

module.exports = notes;