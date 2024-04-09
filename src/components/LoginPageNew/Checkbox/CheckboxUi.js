import React from "react";
import { Link } from "react-router-dom";
// import { CheckboxIcon } from "../../../assets";
import { ReactComponent as CheckBox } from "../../../assets/NewIcon/CheckBox.svg";

import { Draggable } from "react-drag-and-drop";

const CheckboxUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="checkBoxUi-checkbox-link" to="#">
          <span className="secondaryColor">
            {/* <img src={CheckboxIcon} alt="" /> */}
            <CheckBox />
          </span>
          Checkbox
        </Link>
      </Draggable>
    </li>
  );
};
export default CheckboxUi;
