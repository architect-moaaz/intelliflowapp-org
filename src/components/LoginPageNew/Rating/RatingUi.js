import React from "react";
import { Link } from "react-router-dom";
// import { Rating } from "../../../assets";
import { ReactComponent as Rating } from "../../../assets/NewIcon/Rating.svg";

import { Draggable } from "react-drag-and-drop";

const RatingUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="ratingUi-rating-link" to="#">
          <span className="secondaryColor">
            {/* <img src={Rating} alt="" /> */}
            <Rating />
          </span>
          Rating
        </Link>
      </Draggable>
    </li>
  );
};
export default RatingUi;
