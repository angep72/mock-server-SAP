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
//Route t0 update user


app.put('/update-user/:id', (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Check for valid userId
  if (isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const updatedUser = req.body;

  // Check if the updatedUser contains necessary fields
  if (!updatedUser || !updatedUser.name) {  // Assuming 'name' is required
    return res.status(400).json({ message: 'Invalid user data' });
  }

  fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ message: 'Error reading data file' });
    }
    try {
      const jsonData = JSON.parse(data);
      const userIndex = jsonData.users.findIndex((user) => user.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Merge existing user data with the updated data
      jsonData.users[userIndex] = { ...jsonData.users[userIndex], ...updatedUser };

      // Write the updated data back to the file
      fs.writeFile(
        path.join(__dirname, 'data.json'),
        JSON.stringify(jsonData, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error('Error writing file:', writeErr);
            return res.status(500).json({ message: 'Error saving data' });
          }
          return res.json({ message: 'User updated successfully' });
        }
      );
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      return res.status(500).json({ message: 'Error parsing JSON data' });
    }
  });
});

    // Read the existing data from the JSON file
// Route to add a user to the JSON file (POST request)
app.post('/add-user', (req, res) => {
    const newUser = req.body;

    // Read the existing data from the JSON file
    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.status(500).json({ message: 'Error reading data file' });
            return;
        }

        try {
            const jsonData = JSON.parse(data);
            // Add the new user to the 'users' array
            jsonData.users.push(newUser);

            // Save the updated data back to the file
            fs.writeFile(
                path.join(__dirname, 'data.json'),
                JSON.stringify(jsonData, null, 2),
                (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing file:', writeErr);
                        res.status(500).json({ message: 'Error saving data' });
                        return;
                    }
                    res.status(201).json({ message: 'User added successfully' });
                }
            );
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            res.status(500).json({ message: 'Error parsing JSON data' });
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
app.delete('/delete-user/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);

    // Check for valid userId
    if (isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    fs.readFile(path.join(__dirname, 'data.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Error reading data file' });
        }
        try {
            const jsonData = JSON.parse(data);
            const userIndex = jsonData.users.findIndex((user) => user.id === userId);

            if (userIndex === -1) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Remove the user from the 'users' array
            jsonData.users.splice(userIndex, 1);

            // Write the updated data back to the file
            fs.writeFile(
                path.join(__dirname, 'data.json'),
                JSON.stringify(jsonData, null, 2),
                (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing file:', writeErr);
                        return res.status(500).json({ message: 'Error saving data' });
                    }
                    return res.json({ message: 'User deleted successfully' });
                }
            );
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).json({ message: 'Error parsing JSON data' });
        }
    });
}); 

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});