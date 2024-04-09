import React from "react";
import { Link } from "react-router-dom";
// import { QrCode } from "../../../assets";
import { ReactComponent as QRCode } from "../../../assets/NewIcon/QRCode.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const QRCodeUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
{t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="qrCodeUi-qrCode-link">
          <span className="secondaryColor">
            {/* <img src={QrCode} alt="" /> */}
            <QRCode />
          </span>
          <p className="secondaryColor">{t("QR Code")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default QRCodeUi;
