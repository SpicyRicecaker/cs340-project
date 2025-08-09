import React, { useEffect, useState } from "react"
import { backendURL } from "./constants"

function NativeSelectDropdown({ id, phantomRowIEdit, phantomRowIEditHeader}) {
  // State to hold the currently selected value
  const [selectedValue, setSelectedValue] = useState(id) // Default to the placeholder
  const [options, setOptions] = useState(['under-review', 'approved', 'rejected'])

  // This function is called whenever the user changes the selection
  const handleChange = (event) => {
    setSelectedValue(event.target.value)

    phantomRowIEdit[phantomRowIEditHeader] = event.target.value
    console.log('set dropdown value to ', phantomRowIEdit[phantomRowIEditHeader])
    
    console.log("Selected:", event.target.value)
  }

  return (
    // <div style={{ fontFamily: "Arial, sans-serif" }}>
    //   <label htmlFor="menu-select" style={{ marginRight: "10px" }}>
    //     {/* Menu: */}
    //   </label>

      <select
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
        `}
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

    //   {/* {selectedValue && (
    //     <p style={{ marginTop: "20px" }}>You selected: {selectedValue}</p>
    //   )} */}
    // </div>
  )
}

export default NativeSelectDropdown
