import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Tabs } from "../../../../assets/NewIcon/tabs.svg";

export default function TabUi({ item }) {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-tab" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Tabs />
            </span>
          </span>
          <p className="secondaryColor">{item.placeholder}</p>
        </Link>
      </Draggable>
    </li>
  );
}
