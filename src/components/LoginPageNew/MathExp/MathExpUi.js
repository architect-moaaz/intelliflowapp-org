import React from "react";
import { Link } from "react-router-dom";
import { MathIcon } from "../../../assets";
import { Draggable } from "react-drag-and-drop";

const MathExpUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="mathExpUi-mathExp-link" to="#">
          <span className="mockElementSpan secondaryColor">
            <img src={MathIcon} alt="" />
          </span>
          Math Exp.
        </Link>
      </Draggable>
    </li>
  );
};
export default MathExpUi;
