import React from "react";
import { Link } from "react-router-dom";
import { RadioBtn } from "../../../assets";
import { ReactComponent as RadioButton } from "../../../assets/NewIcon/RadioButton.svg";

import { Draggable } from "react-drag-and-drop";

const RadioButtonUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="radioButtonUi-radioButton-link" to="#">
          <span className="secondaryColor">
            {/* <img src={RadioBtn} alt="" /> */}
            <RadioButton />
          </span>
          Radio Button
        </Link>
      </Draggable>
    </li>
  );
};
export default RadioButtonUi;
