import React from "react";
import { Link } from "react-router-dom";
import { DropdownIcon } from "../../../assets";
import { ReactComponent as Dropdown } from "../../../assets/NewIcon/Dropdown.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const DropdownUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="dropdownUi-dropdown-link" to="#">
          <span className="secondaryColor">
            {/* <img src={DropdownIcon} alt="" /> */}
            <Dropdown />
          </span>
          <p className="secondaryColor">{t("Dropdown")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default DropdownUi;
