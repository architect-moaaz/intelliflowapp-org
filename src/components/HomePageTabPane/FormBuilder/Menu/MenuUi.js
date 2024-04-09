import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Menu } from "../../../../assets/NewIcon/menu.svg";

export default function MenuUi({ item }) {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-menu" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Menu />
            </span>
          </span>
          <p className="secondaryColor">{item.placeholder}</p>
        </Link>
      </Draggable>
    </li>
  );
}
