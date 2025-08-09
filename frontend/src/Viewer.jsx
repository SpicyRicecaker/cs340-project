import { useState, useEffect, useMemo } from 'react';  // Importing useState for managing state in the component
import { useParams } from 'react-router-dom'
import { backendURL } from './constants';
import Link from './Link'
import Dropdown from './Dropdown'
import Dropdown2 from './Dropdown2'
import DatePicker from './DatePicker'
import EditBox from './EditBox'


function Viewer() {
    console.log('rerender')
    const { table } = useParams();

    // Set up a state variable `message` to store and display the backend response
    const [isLoading, setIsLoading] = useState(true);
    const [headers, setHeaders] = useState([])
    const [rows, setRows] = useState([])
    const [iEdit, setIEdit] = useState(-1)
    const [isInsert, setIsInsert] = useState(false)

    
    let phantomRowIEdit = useMemo(() => {
        if (iEdit !== -1) {
            return JSON.parse(JSON.stringify(rows[iEdit]))
        } else {
            return {}
        }
    })

    const commitPhantomRow = async () => {
        if (isInsert) {
            console.log('current phantomRowIEdit', phantomRowIEdit)
            const res = await fetch(`${backendURL}/add/${table}`, { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(phantomRowIEdit)
            })
            if (res.ok) {
                await getData()
            } else {
                // check if we're in the middle of insert
                setRows(rows.filter((l, i) => i !== rows.length - 1))
                setIsInsert(false)
            }
            setIsInsert(false)
        } else {
            const res = await fetch(`${backendURL}/edit/${table}`, { 
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(phantomRowIEdit)
            })
            if (res.ok) {
                await getData()
            } else {
                // check if we're in the middle of insert
                if (isInsert) {
                    setRows(rows.filter((l, i) => i !== rows.length - 1))
                    setIsInsert(false)
                }
            }
        }
        
        setIEdit(-1)
    }

    const disabled = table !== 'Applications'
    console.log(disabled)
    const disabledClassList = "opacity-50 hover:cursor-not-allowed pointer-events-none"
    // ${disabled ? disabledClassList : ''}

    const [rowMetaData, columnNumber] = useMemo(() => {
        if (!isLoading) {
            const newColumnWidth = headers.length
            if (rows.length === 0) return [[], newColumnWidth]

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

            return [newRowMetaData, newColumnWidth]
        } else {
            return [[], 0]
        }
    }, [rows])

    // Get the data from the database
    const getData = async function () {
        setIsLoading(true);
        try {
            let responses = (await Promise.allSettled([fetch(`${backendURL}/${table}/description`), fetch(`${backendURL}/${table}/contents`)])).map((p) => p.value)
            responses = (await Promise.allSettled(responses.map((r) => {
                if (!r.ok) {
                    return []
                } else {
                    return r.json()
                }
            }))).map((p) => p.value)

            if (responses[0].length > 0) {
                const tHeaders = responses[0][0].map((s) => s.Field)
                setHeaders(tHeaders)
            } else {
                setHeaders([])
            }
            console.log(responses[1]);

            setRows(responses[1]);
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

    const delId = async (i_r, id) => {
        if (isInsert) {
            // console.log('woooooooo')
            setRows(rows.filter((l, i) => i !== rows.length - 1))
            setIsInsert(false)
            setIEdit(-1)
            return
        }
        console.log(`sending request ${backendURL}/delete/${table}/${id}`)
        // console.log(`fetching ${backendURL}reset`)
        const res = await fetch(`${backendURL}/delete/${table}/${id}`, {
            method: 'PUT'
        })
        if (!res.ok) {
            console.log("error, couldn't reset")
            return
        }
        setIEdit(-1)
        setRows(rows.filter((_, i) => i !== i_r))
    }

    // Load table on page load
    useEffect(() => {
        getData();
    }, [])

    // if (isLoading) {
    //     return <div>Loading data, please wait...</div>;
    // }

    // If not loading, and there's no data, show a message
    // if (rows.length === 0) {
    //     return <div className='text-white font-mono text-lg'>No data found.</div>
    // }

    return(
    <>
        <Link inGrid={false} url="/" label="Go Back" />
        <br></br>
        <h2 className='text-6xl rounded-lg p-4 font-sans border-2 border-solid shadow-md text-center text-lg m-0 p-0'>
            <span className=''>{table}</span>
        </h2>
        <div className='p-b-3 overflow-x-auto'>
            <table 
                style={{gridTemplateColumns: `repeat(${columnNumber + 2}, minmax(min-content, 1fr))`}}
                className={`table1 m-0 p-0 table-fixed w-full`}>
                <thead className='header1'>
                        <tr className='tr1'>
                            {
                                headers.map((header) => (
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
                                                            {row[k] ? <span className={`${iEdit === i_r ? 'invisible': ''}`}>{row[k]}</span> : <i><b>null</b></i>}
                                                            {
                                                                (() => {
                                                                    if (iEdit === i_r) {
                                                                        // if we're the note field
                                                                        if (headers[i_k] === 'note') {
                                                                            return <EditBox textCenterProps={textCenterProps(i_r, i_k, row, k)} phantomRowIEdit={phantomRowIEdit} phantomRowIEditHeader={headers[i_k]}/> 
                                                                        } else if (headers[i_k] === 'applicationID') {
                                                                            return <span>{!isInsert ? row[k] : '(will be auto-set)'}</span>
                                                                        } else if (headers[i_k] === 'contactID') {
                                                                           return <Dropdown table={'Contacts'} id={row[k]} phantomRowIEdit={phantomRowIEdit} phantomRowIEditHeader="contactID"></Dropdown>
                                                                        } else if (headers[i_k] === 'petID') {
                                                                           return <Dropdown table={'Pets'} id={row[k]} phantomRowIEdit={phantomRowIEdit} phantomRowIEditHeader="petID"></Dropdown>
                                                                        } else if (headers[i_k] === 'approvalState') {
                                                                           return <Dropdown2 id={row[k]} phantomRowIEdit={phantomRowIEdit} phantomRowIEditHeader="approvalState"></Dropdown2>
                                                                        } else if (headers[i_k] === 'applicationDate') {
                                                                            return <DatePicker phantomRowIEdit={phantomRowIEdit} phantomRowIEditHeader="applicationDate"></DatePicker>
                                                                        }
                                                                    }   
                                                                })()
                                                                
                                                            }
                                                    </td>
                                            )
                                        }
                                    )
                                    }
                                    <td className='td1
                                                        border-t-solid
                                                        border-b-solid
                                                        grid
                                                        grid-rows-3
                                                        gap-1
                                                        p-2'>
                                            <button className={`${iEdit === i_r ? 'opacity-50 pointer-events-none' : ''} ${disabled ? disabledClassList : ''}`} onClick={() => {
                                                setIEdit(i_r)
                                            }}>edit</button>
                                            <button className={`${iEdit === i_r ? '' : 'opacity-50 pointer-events-none'}`} onClick={() => {
                                                // if (window.confirm('are you sure you want to cancel')) {
                                                if (isInsert) {
                                                    setRows(rows.filter((l, i) => i !== rows.length - 1))
                                                    setIsInsert(false)
                                                }
                                                    setIEdit(-1)
                                                // }
                                            }}>cancel</button>
                                            <button className={`${iEdit === i_r ? '' : 'opacity-50 pointer-events-none'}`} onClick={async () => {
                                                await commitPhantomRow();
                                            }}>apply</button>
                                    </td>
                                    <td className='td1
                                                    border-t-solid
                                                    border-b-solid
                                                    p-2'>
                                        <button className={`flex-1 ${disabled ? disabledClassList : ''}`} onClick={(e) => delId(i_r, row[headers[0]])}>delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
            </table>
        </div>
            <button 
                className={`p-2 w-full m-t-[0.5rem] rounded-lg border-2 border-solid ${disabled ? disabledClassList : ''}`}
                onClick={() => {
                    const obj = {}
                    for (const header of headers) {
                        obj[header] = ""
                        if (header === 'applicationDate') {
                            obj[header] = ((dateObj) => {
                                // .toISOString() returns 'YYYY-MM-DDTHH:mm:ss.sssZ'
                                // We just need the first 10 characters.
                                return dateObj.toISOString().slice(0, 10);
                            })(new Date())
                        }
                    }
                    setRows([...rows, obj])
                    setIsInsert(true)
                    setIEdit(rows.length)
            }}>insert</button>
    </>
    )
}

export default Viewer;