import React from "react";
import { Link } from "react-router-dom";
// import { QrCode } from "../../../assets";
import { ReactComponent as QRCode } from "../../../assets/NewIcon/QRCode.svg";

import { Draggable } from "react-drag-and-drop";

const QRCodeUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="qrCodeUi-qrCode-link" to="#">
          <span className="secondaryColor">
            {/* <img src={QrCode} alt="" /> */}
            <QRCode />
          </span>
          QR Code
        </Link>
      </Draggable>
    </li>
  );
};
export default QRCodeUi;
