const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Use apiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});







// API Routes
// =============================================================

// GET /api/notes
  // Basic route that sends the user first to the AJAX Page

  app.get('/', (req, res) => {
    // "__dirname" is a global obj and gives you the path of the currently running file
      res.sendFile(path.join(__dirname,'public/index.html'));
  });
  
  app.get('/notes', (req, res) => {
      res.sendFile(path.join(__dirname,'public/notes.html'));
  });
  
  // Read the db.json file and displays all the saved notes
  app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname,'db/db.json'));
  });
  
  // Display a single note
  app.get("/api/notes/:note", function(req, res) {
    var noteSelect = req.params.note;
    console.log(noteSelect);
    res.json(noteSelect)      
  });
  
  // POST /api/notes
  
      app.post("/api/notes", (req, res) => {
        // Should receive a new note to save on the request body
        // Note: req.body hosts is equal to the JSON post sent from the user; this works because of our body parsing middleware
        const addedNote = req.body;
        // create a unique identifier with Date.now()
        addedNote.id = Date.now();
        // Add it to the db.json file, i.e. JSON database where we can send requests
        let noteData = fs.readFileSync('./db/db.json');
        // Create new notes - takes in JSON input and parses the data
        let noteTaker = JSON.parse(noteData);
        // Push addedNote to array
        noteTaker.push(req.body);
        // Write and stringify new array
        fs.writeFileSync('./db/db.json',JSON.stringify(noteTaker), (err, data) => {
          if (err) throw err;
          res.json(noteTaker)      
        }); 
        // send the new added note/response back to the client
        res.sendFile(path.join(__dirname,'public/notes.html'));
    });
  
  // DELETE /api/notes
    // DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. 
  
    app.delete("/api/notes/:id", (req, res) => {
       // Each note is given a unique id when it's saved
       // To delete a note, read all notes from the db.json file
       let noteData = fs.readFileSync('./db/db.json');
       let noteTaker = JSON.parse(noteData);
       // const notesSaved = noteTaker.filter(note => parseInt(note.id) !== parseInt(req.params.id));
       const notesSaved = noteTaker.find(n => n.id === parseInt(req.params.id));
       // select and delete selected note by removing the note with the given id property
       const notesIndex = noteTaker.indexOf(notesSaved);
       noteTaker.splice(notesIndex);
  
      // rewrite the notes to the db.json file
      fs.writeFile(__dirname + "/db/db.json", JSON.stringify(noteTaker), (err, data) => {
        if (err) throw err;
        //send response back to client
        res.json(noteTaker)    
      }); 
    });
  
  




