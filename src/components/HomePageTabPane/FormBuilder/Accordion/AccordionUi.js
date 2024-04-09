import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Accordion } from "../../../../assets/NewIcon/accordion.svg";

export default function AccordionUi({ item }) {
  return (
    <li>
      <Draggable  type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-accordion" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Accordion />
            </span>
          </span>
          <p className="secondaryColor">{item.placeholder}</p>
        </Link>
      </Draggable>
    </li>
  );
}
