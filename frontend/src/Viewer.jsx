import { useState, useEffect, useMemo } from 'react';  // Importing useState for managing state in the component
import { useParams } from 'react-router-dom'
import Link from './Link'

const production = import.meta.env.MODE == 'production'
const backendURL =  `${production ? "http://classwork.engr.oregonstate.edu" : "http://classwork.engr.oregonstate.edu"}:${import.meta.env.VITE_BACKEND_PORT}/`;

function Viewer() {
    console.log('rerender')
    const { table } = useParams();

    // Set up a state variable `message` to store and display the backend response
    const [isLoading, setIsLoading] = useState(true);
    const [rows, setRows] = useState([]);
    const [iEdit, setIEdit] = useState(-1)

    const [rowMetaData, headerSize, columnNumber] = useMemo(() => {
        console.log('memo run')
        if (isLoading === false) {
            let i = 0;
            const newRowMetaData = []
            for (const r of rows) {
                const a = []
                for (const k of Object.keys(r)) {
                    if (r[k]) {
                        a.push(r[k].toString().length)
                    } else {
                        a.push('')
                    }
                }
                newRowMetaData.push(a)
                i++;
            }

            const headerSize = newRowMetaData.reduce((a, b) => a + b, 0)
            const columnWidth = newRowMetaData[0].length

            return [newRowMetaData, headerSize, columnWidth]
        } else {
            return [[], 20, 0]
        }
    }, [rows])

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
    }

    const textCenterProps = (i_r, i_k, row, k) => {
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

        return props.join(" ")
    }


    // Load table on page load
    useEffect(() => {
        getData();
    }, [])

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
        <br></br>
        <h2 className='text-6xl rounded-lg p-4 font-sans border-2 border-solid shadow-md text-center text-lg m-0 p-0'>
            <span className=''>{table}</span>
        </h2>
        <div className='overflow-x-auto'>
            <table 
                style={{gridTemplateColumns: `repeat(${columnNumber + 2}, minmax(min-content, 1fr))`}}
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
                                                        grid
                                                        text-sm
                                                        relative
                                                        ${iEdit === i_r ? "bg-gray" : ''}
                                                        ${textCenterProps(i_r, i_k, row, k)}`}
                                                    key={i_k}>
                                                            {row[k] ? row[k] : <i><b>null</b></i>}
                                                            {iEdit == i_r ? 
                                                                <textarea 
                                                                    className={`
                                                                        text-sm 
                                                                        place-self-center
                                                                        w-full
                                                                        h-full
                                                                        m-0
                                                                        p-inherit
                                                                        border-none
                                                                        font-mono
                                                                        box-border
                                                                        resize-none
                                                                        absolute
                                                                        ${textCenterProps(i_r, i_k, row, k)}
                                                                        `}
                                                                    defaultValue={row[k]}
                                                                    placeholder={`${Object.keys(rows[0])[i_k]} here ...`}
                                                                ></textarea> : <></>}
                                                    </td>
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
            <button onClick={() => {
                if (rows.length > 0) {
                    const obj = {}
                    for (const h of Object.keys(rows[0])) {
                        obj[h] = ""
                    }
                    setRows([...rows, obj])
                    setIEdit(rows.length)
                }
            }}>insert</button>
        </div>
    </>
    )
}

export default Viewer;