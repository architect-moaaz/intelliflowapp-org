import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RadioButton } from "../../../assets/NewIcon/RadioButton.svg";
import { Draggable } from "react-drag-and-drop";

export default function ButtonUi({ item }) {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="buttonUi-radioButton-link" to="#">
          <span className="secondaryColor">
            {/* <img src={RadioBtn} alt="" /> */}
            <RadioButton />
          </span>
          {item.placeholder}
        </Link>
      </Draggable>
    </li>
  );
}
