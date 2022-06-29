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
const { tasks } = require('./Develop/db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

function findById(id, taskArray) {
    const result = taskArray.filter(task => task.id === id)[0];
    return result;
}

function createNewTask(body, taskArray){
    const task = body;
    taskArray.push(task);
    fs.writeFileSync(
        path.join(__dirname,'./Develop/db/db.json'),JSON.stringify({ tasks: taskArray}, null, 2));
    return task;
}

function validateTask(task) {
    if (!task.title || typeof task.title !== 'string') {
        return false;
    }
    if (!task.text || typeof task.text !== 'string') {
        return false; 
    }
    return true;
}

app.get('/api/tasks', (req, res) => {

    res.json(tasks);
});

app.get('/api/tasks/:id', (req, res) => {
    const result = findById(req.params.id, tasks);
    res.json(result);
});

app.post('/api/tasks', (req, res) => {
    req.body.id = tasks.length.toString();

    if (!validateTask(req.body)) {
        res.status(400).send('The task is not properly formatted.');
    } else {

        const task = createNewTask(req.body, tasks);

        res.json(task);
    }

});

app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
});




