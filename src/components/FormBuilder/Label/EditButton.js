import "./styles.css";
import React from "react";

export default function EditButton(props) {
  return (
    <div
      key={props.cmd}
      id="editButton-onMouseDown-div"
      onMouseDown={(evt) => {
        evt.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
    >
      {props.name || props.cmd}
    </div>
  );
}
