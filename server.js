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

const express = require('express')

const { tasks } = require('./Develop/db/db.json')
const PORT = process.env.PORT || 3001;
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function filterByQuery(query, taskArray) {
    let filteredResults = taskArray;
    if (query.title) {
       filteredResults = filteredResults.filter(task => task.title === query.title);
    }

    if (query.text) {
        filteredResults = filteredResults.filter(task => task.text === query.text);
    }

    if (query.id) {
        filteredResults = filteredResults.filter(task => task.id = query.id)
    }
    return filteredResults;
}

app.get('/api/tasks', (req, res) => {
    let results = tasks;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
});




