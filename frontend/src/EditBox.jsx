import React, { useEffect, useState } from "react"
import { backendURL } from "./constants"

function NativeSelectDropdown({ textCenterProps, phantomRowIEdit, phantomRowIEditHeader}) {
  // State to hold the currently selected value
  const [text, setText] = useState(phantomRowIEdit[phantomRowIEditHeader]) // Default to the placeholder

  // This function is called whenever the user changes the selection
  const handleChange = (event) => {
    setText(event.target.value)
    phantomRowIEdit[phantomRowIEditHeader] = event.target.value
    console.log("Selected:", event.target.value)
  }

  return (
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
                ${textCenterProps}
                `}
            onChange={handleChange}
            defaultValue={text}
            placeholder={`${phantomRowIEditHeader} here ...`}
    ></textarea> 
  )
}

export default NativeSelectDropdown
