import React from "react";
import { Link } from "react-router-dom";
// import { DateTime } from "../../../assets";
import { ReactComponent as DateTime } from "../../../../assets/NewIcon/Date&Time.svg";

import { Draggable } from "react-drag-and-drop";

export default function TimerUi({ item }) {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-timer" to="#">
          <span className="secondaryColor">
            {/* <img src={DateTime} alt="" /> */}
            <DateTime />
          </span>
          <p className="secondaryColor">{item.placeholder}</p>
        </Link>
      </Draggable>
    </li>
  );
}
