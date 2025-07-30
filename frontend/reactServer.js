// reactServer.cjs
// Uses common JavaScript to serve the React build folder (/dist)

require('dotenv').config({path: '../.env'})

const express = require('express');
const path = require('path');
const app = express();

// Serve the static files from the React app located in the build folder '/dist'
// React router will take over frontend routing
app.use(express.static(path.join(__dirname, 'dist')));

// Handles any requests that don't match the ones above to return the React app
// A request to '/nonExist' will redirect to the index.html where react router takes over at '/'
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(process.env.VITE_FRONTEND_PORT, () => {
    console.log(`Server running: http://classwork.engr.oregonstate.edu:${process.env.VITE_FRONTEND_PORT}...`);
});