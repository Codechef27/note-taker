// GIVEN a note-taking application
// WHEN I open the Note Taker
// THEN I am presented with a landing page with a link to a notes page
// WHEN I click on the link to the notes page
// THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// WHEN I enter a new note title and the note’s text
// THEN a Save icon appears in the navigation at the top of the page
// WHEN I click on the Save icon
// THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// WHEN I click on an existing note in the list in the left-hand column
// THEN that note appears in the right-hand column
// WHEN I click on the Write icon in the navigation at the top of the page
// THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

const express = require('express');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
const app = express();
const notes = require('./Develop/db/db.json');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// function findById(id, noteArray) {
//     const result = noteArray.filter(note => note.id === id)[0];
//     return result;
// }

function createNewNote(body, noteArray){
    const note = body;
    noteArray.push(note);
    fs.writeFileSync(
        path.join(__dirname,'./Develop/db/db.json'),JSON.stringify(notes, null, 2)
        );
    return note;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false; 
    }
    return true;
}


app.get('/api/notes', (req, res) => {
    let results = notes;
    res.json(results);
    return results;
});


app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});


app.post('/api/notes', (req, res) => {
    req.body.id = notes.length.toString();

    if (!validateNote(req.body)) {
        res.status(400).send('The note is not properly formatted.');
    } else {

        const note = createNewNote(req.body, notes);

        res.json(note);
    }

});

app.delete('/api/notes/:id', (req, res) => {
  
  let id = req.params.id;
  let noteArray =  notes ;
  for (i = 0; i < noteArray.length; i++) {
    if (noteArray[i].id === id) {
        noteArray.splice(i, 1);
        fs.writeFileSync(path.join(__dirname,'./Develop/db/db.json'),JSON.stringify(noteArray, null, 2));
    }
  }
   res.json(noteArray);
});    

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
});




