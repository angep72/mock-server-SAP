const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body data
app.use(express.json());

// Route to serve the JSON data
app.get('/data', (req, res) => {
  // Read the JSON file asynchronously
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading data file' });
      return;
    }

    try {
      // Parse the JSON string into an object
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ message: 'Error parsing JSON data' });
    }
  });
});

// Route to add a user to the JSON file (POST request)
app.post('/add-user', (req, res) => {
  const newUser = req.body;

  // Read the existing data from the JSON file
  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ message: 'Error reading data file' });
      return;
    }

    try {
      const jsonData = JSON.parse(data);
      // Add the new user to the 'users' array
      jsonData.users.push(newUser);

      // Save the updated data back to the file
      fs.writeFile(path.join(__dirname, 'data.json'), JSON.stringify(jsonData, null, 2), (writeErr) => {
        if (writeErr) {
          res.status(500).json({ message: 'Error saving data' });
          return;
        }
        res.status(201).json({ message: 'User added successfully' });
      });
    } catch (parseError) {
      res.status(500).json({ message: 'Error parsing JSON data' });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
