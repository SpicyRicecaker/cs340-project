const db = require('./db-connector');
const MY_ONID = "lishen";

// Express library used to create a web server that will listen and respond to API calls from the frontend
const express = require('express');

// Instantiate an express object to interact with the server
const app = express();

// Middleware to allow cross-origin requests
const cors = require('cors');

// Set a port in the range: 1024 < PORT < 65535
const PORT = 3976;


// If on FLIP or classwork, use cors() middleware to allow cross-origin requests from the frontend with your port number:
// EX (local): http://localhost:5173
// EX (FLIP/classwork) http://classwork.engr.oregonstate.edu:5173
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json()); // this is needed for post requests, good thing to know
            
// Route handler 
app.get('/', async (req, res) => {
    try {
        // Define queries
        const query1 = 'DROP TABLE IF EXISTS Pets;';
        const query2 = `
            CREATE TABLE Pets (
            petID INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(45) NULL,
            age INT NULL,
            sex VARCHAR(1) NULL,
            weightLB DECIMAL NULL,
            adopted TINYINT NULL DEFAULT 0,
            note VARCHAR(200) NULL,
            imageURL VARCHAR(2000) NULL,
            petRaceID INT NOT NULL,
            PRIMARY KEY (petID)
        );`;
        const query3 = `INSERT INTO Pets
(name, age, sex, weightLB, adopted, note, imageURL, petRaceID) 
VALUES
('Pikachu',3,'M',3,1,'Likes to sleep at 3PM.','https://drive.google.com/file/d/1nHQb6Ks9iYbQLdj-gq-h7M2kUwup4muN/view?usp=drive_link',3),
('Onix', 10, 'F', 90, 1,'Not potty trained! Might reck the house!','https://drive.google.com/file/d/1dJKwY3_rjGfvkLtim6qhdpNPY0yGUIE1/view?usp=drive_link',2),
('Staryu', 2,'F', 6, 0,'Likes to be rocked gently and twirled around.','https://drive.google.com/file/d/1xKdNWZediFfE8XNltg8huQItJ6prSrO_/view?usp=drive_link',2),
('Charmander', 5,'M', 5, 0,'Likes oran berries.','https://drive.google.com/file/d/13ppSKxj6nsk8MYiJ8nINfIqFNXU7Tvgv/view?usp=drive_link',1),
('Garchomp', 999,'M', 9999, 0,'Need to sand down his claws every few weeks!','https://drive.google.com/file/d/1jZ6zdch74HN5SXBnyDSHKw4WyIqOFLNc/view?usp=drive_link',1);`;
        const query4 = 'SELECT * FROM Pets;';

        // Execute the queries
        await db.query(query1);
        await db.query(query2);
        await db.query(query3);

        // Get the results
        const [rows] = await db.query(query4);

        // Send back the results in JSON
        res.status(200).json(rows)

    } catch (error) {
        console.error("Error executing queries:", error);
        // Send a generic error message to the browser
        res.status(500).send("An error occurred while executing the database queries.");
    }
});


// Tell express what port to listen on 
app.listen(PORT, function () {
    console.log('Express started on http://classwork.engr.oregonstate.edu:' + PORT + '; press Ctrl-C to terminate.');
});