import React from "react";
import { Link } from "react-router-dom";
// import { Section } from "../../../assets";
import { ListIcon } from "../../../assets/index"; 

import { Draggable } from "react-drag-and-drop";

const ListUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="sectionUi-section-link" to="#">
          <span className="secondaryColor">
            <img src={ListIcon} alt="" />
            {/* <ListIcon /> */}
          </span>
         List
        </Link>
      </Draggable>
    </li>
  );
};
export default ListUi;
