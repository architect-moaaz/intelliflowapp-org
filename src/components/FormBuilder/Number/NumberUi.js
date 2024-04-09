import React from "react";
import { Link } from "react-router-dom";
// import { Number } from "../../../assets";
import { ReactComponent as Number } from "../../../assets/NewIcon/Number.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const NumberUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="numberUi-number-link">
          <span className="secondaryColor">
            {/* <img src={Number} alt="" /> */}
            <Number />
          </span>
          <p className="secondaryColor">{t("Number")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default NumberUi;
