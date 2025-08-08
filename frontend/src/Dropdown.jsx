import React, { useEffect, useState } from "react"
import { backendURL } from "./constants"

function NativeSelectDropdown({ id, table, phantomRowIEdit, phantomRowIEditHeader}) {
  // State to hold the currently selected value
  const [selectedValue, setSelectedValue] = useState('') // Default to the placeholder
  const [options, setOptions] = useState([])

  const getData = async () => {
    const res = await fetch(`${backendURL}/${table}/friendly`)
    if (res.ok) {
      const rows = (await res.json())[0]
      // find the row corresponding to our current value
      const i = rows.findIndex((r, i) => Object.values(r)[0] == id)
      const newRows = rows.map((r, i) => Object.values(r).join(" "))
      setSelectedValue(newRows[i])
      setOptions(newRows)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  // This function is called whenever the user changes the selection
  const handleChange = (event) => {
    setSelectedValue(event.target.value)

    phantomRowIEdit[phantomRowIEditHeader] = parseInt(event.target.value.split(" ")[0])
    
    console.log("Selected:", event.target.value)
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <label htmlFor="menu-select" style={{ marginRight: "10px" }}>
        {/* Menu: */}
      </label>

      <select
        id="menu-select"
        value={selectedValue}
        onChange={handleChange}
        style={{ padding: "8px", fontSize: "16px" }}
      >
        {/* Placeholder Option */}
        <option value="" disabled>
          Select an option
        </option>

        {/* Map over your options array to create the <option> elements */}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* {selectedValue && (
        <p style={{ marginTop: "20px" }}>You selected: {selectedValue}</p>
      )} */}
    </div>
  )
}

export default NativeSelectDropdown
