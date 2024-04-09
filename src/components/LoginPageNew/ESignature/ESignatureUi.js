import React from "react";
import { Link } from "react-router-dom";
import { Signature } from "../../../assets";
import { ReactComponent as ESignature } from "../../../assets/NewIcon/ESignature.svg";

import { Draggable } from "react-drag-and-drop";

const ESignatureUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="eSignatureUi-eSignature-link" to="#"> 
          <span className="secondaryColor">
            {/* <img src={Signature} alt="" /> */}
            <ESignature />
          </span>
          E Signature
        </Link>
      </Draggable>
    </li>
  );
};
export default ESignatureUi;
