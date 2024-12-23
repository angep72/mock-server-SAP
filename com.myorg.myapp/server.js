const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Don't forget to install cors: npm install cors

const app = express();
const PORT = 3000;
app.use(express.json());  // Middleware to parse JSON body
app.use(express.json());  // Middleware to parse JSON body


// CORS configuration
const corsOptions = {
    origin: '*', // In production, replace with specific origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    optionsSuccessStatus: 200
};

// Apply CORS middleware before other middlewares
app.use(cors(corsOptions));

// Middleware to parse JSON body data
app.use(express.json());

// Route to serve the JSON data
app.get('/data', (req, res) => {
    // Read the JSON file asynchronously
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });
            return;
        }

        try {
            // Parse the JSON string into an object
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Error parsing JSON data' });
        }
    });
});

//Route to get one user
app.get('/data/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10); // Get the ID from the URL parameter
    const filePath = path.join(__dirname, 'data.json'); // Path to your JSON file
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading file');
      }
  
      try {
        const jsonData = JSON.parse(data);
        
        const user = jsonData.users.find(u => u.id === userId);
        
        if (user) {
          res.json(user);
        } else {
          res.status(404).send('User not found');
        }
      } catch (err) {
        res.status(500).send('Error parsing JSON data');
      }
    });
  });



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});