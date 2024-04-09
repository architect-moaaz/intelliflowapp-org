import React from "react";
import { Link } from "react-router-dom";
// import { CheckboxIcon } from "../../../assets";
import { ReactComponent as CheckBox } from "../../../assets/NewIcon/CheckBox.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const CheckboxUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="checkBoxUi-checkbox-link" to="#">
          <span className="secondaryColor">
            {/* <img src={CheckboxIcon} alt="" /> */}
            <CheckBox />
          </span>
          <p className="secondaryColor">{t("Checkbox")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default CheckboxUi;
