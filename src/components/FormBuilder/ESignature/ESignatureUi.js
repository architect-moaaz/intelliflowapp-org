import React from "react";
import { Link } from "react-router-dom";
import { Signature } from "../../../assets";
import { ReactComponent as ESignature } from "../../../assets/NewIcon/ESignature.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const ESignatureUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="eSignatureUi-eSignature-link" to="#">
          <span className="secondaryColor">
            {/* <img src={Signature} alt="" /> */}
            <ESignature />
          </span>
          <p className="secondaryColor">{t("E Signature")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default ESignatureUi;
