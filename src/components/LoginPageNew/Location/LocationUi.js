import React from "react";
import { Link } from "react-router-dom";
import { LocationIcon } from "../../../assets";
import { Draggable } from "react-drag-and-drop";

const LocationUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="locationUi-location-link" to="#">
          <span className="secondaryColor">
            <img src={LocationIcon} alt="" />
          </span>
          Location
        </Link>
      </Draggable>
    </li>
  );
};
export default LocationUi;
