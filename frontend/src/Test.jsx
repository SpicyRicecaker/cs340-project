import { useState, useEffect, useMemo } from 'react';  // Importing useState for managing state in the component

function Test() {
    const [a1, setA1] = useState([])
    const [a2, setA2] = useState([])
    const [a3, setA3] = useState([])

    console.log('rerender triggered', a1, a2, a3)

    useEffect(() => {
        console.log('set a1 running')
        setA1([1, 2, 3, 4, 5, 6])
    }, [])

    useEffect(() => {
        console.log(`set a2 running, reading from a1: ${a1}`)
        setA2(a1.map((x) => x + 1))
    }, [a1])

    useEffect(() => {
        console.log(`set a3 running, reading from a2: ${a2}`)
        setA3(a2.map((x) => x + 1))
    }, [a2])

    useEffect(() => {
        console.log(`set a4 running, reading from a3 ${a3}`)
    }, [a3])

    return <div className="text-white">
        hello world
    </div>
}

export default Test