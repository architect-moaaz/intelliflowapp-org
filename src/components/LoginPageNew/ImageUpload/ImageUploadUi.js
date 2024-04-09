import React from "react";
import { Link } from "react-router-dom";
import { ImgIcon } from "../../../assets";
import { ReactComponent as Image } from "../../../assets/NewIcon/Image.svg";

import { Draggable } from "react-drag-and-drop";

const ImageUploadUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="imageUploadUi-imageUpload-link" to="#">
          <span className="secondaryColor">
            <Image />
            {/* <img src={ImgIcon} alt="" /> */}
          </span>
          <p className="secondaryColor">Image upload</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default ImageUploadUi;
