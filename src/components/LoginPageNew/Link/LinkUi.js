import React from "react";
import { Link } from "react-router-dom";
// import { LinkIcon } from "../../../assets";
import { ReactComponent as LinkIcon } from "../../../assets/NewIcon/Link.svg";

import { Draggable } from "react-drag-and-drop";

const LinkUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="linkUi-link-link" to="#">
          <span className="secondaryColor">
            {/* <img src={LinkIcon} alt="" /> */}
            <LinkIcon />
          </span>
          Link
        </Link>
      </Draggable>
    </li>
  );
};
export default LinkUi;
