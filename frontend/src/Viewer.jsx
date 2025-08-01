import { useState, useEffect, useMemo } from 'react';  // Importing useState for managing state in the component
import { useParams } from 'react-router-dom'
import Link from './Link'

const production = import.meta.env.MODE == 'production'
const backendURL =  `${production ? "http://classwork.engr.oregonstate.edu" : "http://classwork.engr.oregonstate.edu"}:${import.meta.env.VITE_BACKEND_PORT}/`;

function Viewer() {
    const { table } = useParams();

    // Set up a state variable `message` to store and display the backend response
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);

    const [rowMetaData, setRowMetaData] = useState([])
    const [headerSize, setHeaderSize] = useState(20)
    const [iEdit, setIEdit] = useState(-1)

    useMemo(() => {
        if (isLoading === false) {
            let i = 0;
            for (const r of rows) {
                const a = []
                for (const k of Object.keys(r)) {
                    if (r[k]) {
                        a.push(r[k].toString().length)
                    } else {
                        a.push('')
                    }
                }
                rowMetaData.push(a)
                i++;
            }
        }
    }, [isLoading])

    useMemo(() => {
        if (rowMetaData.length > 0) {

            console.log('reduction result', rowMetaData[0].reduce((a, b) => a + b, 0))
            console.log('current header value', headerSize)
            setHeaderSize(rowMetaData.reduce((a, b) => a + b, 0))
            console.log('post header value', headerSize)
        }
    }, [rowMetaData])

    // Get the data from the database
    const getData = async function () {
        setIsLoading(true);
        if (rows.length > 0) return; // Skip if data is already fetched
        try {
            // Make a GET request to the backend
            const response = await fetch(`${backendURL}${table}`);
            
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

    return(
    <>
        <Link inGrid={false} url="/" label="Go Back" />
        <div className='overflow-x-auto'>
            <table 
                className={`table1 m-0 p-0 table-fixed w-full min-w-[${headerSize * 40}px]`}>
                <thead className='header1'>
                        <tr className='tr1'>
                            {
                                Object.keys(rows[0]).map((header) => (
                                    <th className='th1 p-4' key={header}>{header}</th>
                                ))
                            }
                            {(() => {
                                // if (iEdit === -1) {
                                    return <>
                                        <th className='th1 p-4'>&nbsp;</th>
                                        <th className='th1 p-4'>&nbsp;</th>
                                    </>
                                // } else {
                                //     return <>
                                //         <th className='th1 p-4'>&nbsp;</th>
                                //         <th className='th1 p-4'>&nbsp;</th>
                                //         <th className='th1 p-4'>&nbsp;</th>
                                //     </>
                                // }
                            })()}
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
                                                        h-[1px]
                                                        ${iEdit === i_r ? "bg-gray" : ''}
                                                        ${(() => {
                                                            const isSmall = rowMetaData[i_r][i_k] < 20

                                                            let a = ""
                                                            if (!row[k]) {
                                                                a = 'null'
                                                            } else {
                                                                a = row[k]
                                                            }

                                                            const isSentence = a.toString().trim().split(" ").length > 1

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
                                                    key={i_k}>{
                                                        (() => {
                                                            if (iEdit === i_r) {
                                                                // return <input size={!row[k] ? 1 : rowMetaData[i_r][i_k] <= 1 ? rowMetaData[i_r][i_k] : rowMetaData[i_r][i_k] - 1} type="text" className="border-none m-0 p-0 font-mono " value={row[k]}></input>
                                                                return <div className='flex w-full h-full'>
                                                                    <textarea className="flex-1 w-full h-[98%] m-0 p-0 border-none font-mono box-border resize-none" value={row[k]}></textarea>
                                                                </div>
                                                            } else {
                                                                return row[k] ? row[k] : <i><b>null</b></i>
                                                            }
                                                        })()
                                                    }</td>
                                            )
                                        }
                                    )
                                    }
                                    <td className='td1
                                                        border-t-solid
                                                        border-b-solid
                                                        p-t-4
                                                        p-b-4
                                                        p-l-2
                                                        p
                                                        p-r-2'>
                                        <div className='flex flex-col'>
                                            <button className="p-0" onClick={() => {
                                                setIEdit(i_r)
                                            }}>edit</button>
                                            <button onClick={() => {
                                                // if (window.confirm('are you sure you want to cancel')) {
                                                    setIEdit(-1)
                                                // }
                                            }}>cancel</button>
                                            <button onClick={() => {
                                                setIEdit(-1)
                                            }}>apply</button>
                                        </div>
                                    </td>
                                    <td className='td1
                                                    border-t-solid
                                                    border-b-solid
                                                    p-t-4
                                                    p-b-4
                                                    p-l-2
                                                    p
                                                    p-r-2'>
                                    <div className='flex flex-col'>
                                        <button className='flex-1'>delete</button>
                                    </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
            </table>
            <button>insert</button>
        </div>
    </>
    )
}

export default Viewer;