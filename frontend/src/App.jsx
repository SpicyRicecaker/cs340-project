import './App.css';
import { useState, useEffect } from 'react';  // Importing useState for managing state in the component

// Define the backend port and URL for API requests
const backendPort = 3976;  // Use the port you assigned to the backend server, this would normally go in .env file
// const backendURL = `http://classwork.engr.oregonstate.edu:${backendPort}/`;
const backendURL = `http://localhost:${backendPort}/`;

function App() {

    // Set up a state variable `message` to store and display the backend response
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState([]);

    // Get the data from the database
    const getData = async function () {
        setIsLoading(true);
        if (message.length > 0) return; // Skip if data is already fetched
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL);
            
            // Convert the response into JSON format
            const rows = await response.json();
            
            // Update the message state with the response data
            setMessage(rows);
        } catch (error) {
          // If the API call fails, print the error to the console
          console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const [length, setLength] = useState(0)

    // Load table on page load
    useEffect(() => {
        getData();
    }, []);

    if (isLoading) {
        return <div>Loading data, please wait...</div>;
    }

    // If not loading, and there's no data, show a message
    if (message.length === 0) {
        return <div>No data found.</div>
    }

  return (
    <>
        <table>
            <thead>
                <tr>
                    {
                        Object.keys(message[0]).map((header) => (
                            <th key={header}>{header}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    message.map((row, index) => (
                        <tr key={index}>
                            {
                                Object.keys(row).map((header, index) => (
                                    <td key={index}>{row[header]}</td>
                                ))
                            }
                        </tr>
                    ))
                }
            </tbody>
        </table>
    </>
  );

} export default App;