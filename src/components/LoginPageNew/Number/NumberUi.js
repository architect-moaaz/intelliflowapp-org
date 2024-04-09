import React from "react";
import { Link } from "react-router-dom";
// import { Number } from "../../../assets";
import { ReactComponent as Number } from "../../../assets/NewIcon/Number.svg";

import { Draggable } from "react-drag-and-drop";

const NumberUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="numberUi-number-link" to="#">
          <span className="secondaryColor">
            {/* <img src={Number} alt="" /> */}
            <Number />
          </span>
          Number
        </Link>
      </Draggable>
    </li>
  );
};
export default NumberUi;
