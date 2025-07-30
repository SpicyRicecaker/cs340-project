import './App.scss';
import { useState, useEffect, useMemo } from 'react';  // Importing useState for managing state in the component

const production = import.meta.env.MODE == 'production'
const backendURL =  `${production ? "http://classwork.engr.oregonstate.edu" : "http://classwork.engr.oregonstate.edu"}:${import.meta.env.VITE_BACKEND_PORT}/`;

function App() {
    // Set up a state variable `message` to store and display the backend response
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);

    const [rowMetaData, setRowMetaData] = useState([])

    useMemo(() => {
        if (isLoading === false) {
            let i = 0;
            for (const r of rows) {
                const a = []
                for (const k of Object.keys(r)) {
                    a.push(r[k].toString().length)
                }
                rowMetaData.push(a)
                i++;
            }
        }
    }, [isLoading])


    // Get the data from the database
    const getData = async function () {
        setIsLoading(true);
        if (rows.length > 0) return; // Skip if data is already fetched
        try {
            // Make a GET request to the backend
            const response = await fetch(backendURL);
            
            // Convert the response into JSON format
            const rows = await response.json();
            
            // Update the message state with the response data
            setRows(rows);
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
    if (rows.length === 0) {
        return <div>No data found.</div>
    }

  return (
    <>
        <div>
            {production ? <h1 className='text-1xl rounded-lg p-2 font-mono bg-white text-black border-2 border-solid shadow-md text-center text-2xl m-0 p-0'>Fury Finds! (Production)</h1> : <div></div>}
            <table className='table1 m-0 p-0 table-fixed'>
                <thead className='header1'>
                        <tr className='tr1'>
                            {
                                Object.keys(rows[0]).map((header) => (
                                    <th className='th1 p-4' key={header}>{header}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rows.map((row, i_r) => (
                                <tr className='tr2 [&>*:first-child]:(rounded-l-lg border-l-solid) [&>*:last-child]:(rounded-r-lg border-r-solid)' key={i_r}>
                                    {
                                        Object.keys(row).map((k, i_k) => {
                                            return (
                                                <td 
                                                    lang="en" 
                                                    className={`td1
                                                        border-t-solid
                                                        border-b-solid
                                                        p-t-4
                                                        p-b-4
                                                        p-l-2
                                                        p
                                                        p-r-2
                                                        ${(() => {
                                                            const isSmall = rowMetaData[i_r][i_k] < 20
                                                            const isSentence = row[k].toString().trim().split(" ").length > 1

                                                            const props = []

                                                            if (isSentence) {
                                                                if (isSmall) {
                                                                    props.push('text-center')
                                                                } else {
                                                                    props.push('text-left')
                                                                }
                                                                props.push('hyphen-auto')
                                                            } else {
                                                                if (isSmall) {
                                                                    props.push('text-center')
                                                                } else {
                                                                    props.push('text-left')
                                                                    props.push('break-all')
                                                                }
                                                            }

                                                            if (row[k] === 'Likes to sleep at 3PM.') {
                                                                console.log(isSentence)
                                                                console.log(props)
                                                            }

                                                            return props.join(" ")
                                                        })()}`}
                                                    key={i_k}>{row[k]}</td>
                                            )
                                        }
                                    )
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