// app.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Logger middleware to log each request
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// In-memory data storage
let items = []; // Array to hold items (in place of a database)

// CREATE: POST /items - Add a new item
app.post('/items', (req, res) => {
    const { name, count } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    // Determine the count to add (default to 1 if not provided)
    const countToAdd = count ? parseInt(count, 10) : 1;
    
    // Check if item already exists
    let existingItem = items.find(item => item.name === name);
    
    if (existingItem) {
        // If item exists, increment its count by the specified amount
        existingItem.count += countToAdd;
        res.status(200).json(existingItem);
    } else {
        // If item doesn't exist, create a new one with the specified or default count
        const newItem = { id: items.length + 1, name, count: countToAdd };
        items.push(newItem);
        res.status(201).json(newItem);
    }
});


// READ: GET /items - Get all items
app.get('/items', (req, res) => {
    res.json(items);
});

// READ: GET /items/:id - Get a single item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(i => i.id === id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// UPDATE: PUT /items/:id - Update an item by ID
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const item = items.find(i => i.id === id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    item.name = name;
    res.json(item);
});

// DELETE: DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    const deletedItem = items.splice(itemIndex, 1);
    res.json(deletedItem[0]);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
