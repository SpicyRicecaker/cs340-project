import './App.scss';
import { useState, useEffect } from 'react';  // Importing useState for managing state in the component

const backendURL =  `${import.meta.env.MODE == 'production' ? "http://localhost" : "http://classwork.engr.oregonstate.edu" }:${import.meta.env.VITE_BACKEND_PORT}/`;

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
        <div>
            <table className='table1 m-0 p-0'>
                <thead className='header1'>
                        <tr className='tr1'>
                            {
                                Object.keys(message[0]).map((header) => (
                                    <th className='th1 p-4' key={header}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            message.map((row, index) => (
                                <tr className='tr2 [&>*:first-child]:(rounded-l-lg border-l-solid) [&>*:last-child]:(rounded-r-lg border-r-solid)' key={index}>
                                    {
                                        Object.keys(row).map((header, index) => (
                                            <td className='td1 text-center border-t-solid border-b-solid p-t-4 p-b-4' key={index}>{row[header]}</td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
            </table>
        </div>
    </>
  );

} export default App;