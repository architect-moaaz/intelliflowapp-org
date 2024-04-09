import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { Rating } from "react-simple-star-rating";
import parse from "html-react-parser";
import { Slider } from "../../../assets";

const RatingUiMock = ({ onClick, item, deleteItem, layout, setLayout }) => {
  return (
    <div key={item.id} className="mockElement">
      {item.ratingType == "star" ? (
        <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="Rating"
          id="ratingUiMock-rating-IcomoonReact"
        />
      ) : (
        <img src={Slider} alt="slider" />
      )}
      <span className="mockElementSpan secondaryColor">
        {item.fieldName !== ""
          ? item.fieldName
          : "Please add a field name for rating"}
      </span>
      {/* )} */}
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="ratingUiMock-delete-IcomoonReact"
      />
    </div>
  );
};

export default RatingUiMock;
