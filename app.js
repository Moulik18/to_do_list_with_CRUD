const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

let tasks = ['Task 1', 'Task 2', 'Task 3'];

// Log errors middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.get('/', (req, res) => {
  // Pass an optional error message to the view
  res.render('index', { tasks, error: req.query.error, success: req.query.success });
});

app.post('/add', (req, res) => {
    const newTask = req.body.newTask;
  
    // Check if the task already exists
    if (tasks.includes(newTask)) {
      // Task already exists, redirect to the main page with an error query parameter
      return res.redirect('/?error=Task already exists');
    }
  
    // Task is not a duplicate, proceed with adding it
    tasks.push(newTask);
  
    // Redirect to the main page with a success message
    res.redirect('/?success=Task added successfully');
  });
  

app.post('/edit', (req, res) => {
    const editTaskIndex = req.body.editTaskIndex;
    const newTask = req.body.editTask;
  
    // Check if the task index is a valid number
    if (!isNaN(editTaskIndex) && editTaskIndex >= 0 && editTaskIndex < tasks.length) {
      // Update the task at the specified index
      tasks[editTaskIndex] = newTask;
      // Redirect to the main page with a success message
      res.redirect('/?success=Task updated successfully');
    } else {
      // Task index is invalid, redirect to the main page with an error query parameter
      res.redirect('/?error=Invalid task index');
    }
  });
  

app.post('/delete', (req, res) => {
  const tasksToDelete = req.body.tasksToDelete;

  if (Array.isArray(tasksToDelete)) {
    tasks = tasks.filter(task => !tasksToDelete.includes(task));
  } else if (tasksToDelete) {
    tasks = tasks.filter(task => task !== tasksToDelete);
  }

  // Redirect to the main page with a success message
  res.redirect('/?success=Selected tasks deleted successfully');
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
