import React from "react";
import { Link } from "react-router-dom";
// import { DateTime } from "../../../assets";
import { ReactComponent as DateTime } from "../../../assets/NewIcon/Date&Time.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const DateTimeUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="dateTime-dateAndTime-link" to="#">
          <span className="secondaryColor">
            {/* <img src={DateTime} alt="" /> */}
            <DateTime />
          </span>
          <p className="secondaryColor">{t("Date & Time")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default DateTimeUi;
