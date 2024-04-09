import React from "react";
import { Link } from "react-router-dom";
import { RadioBtn } from "../../../assets";
import { ReactComponent as RadioButton } from "../../../assets/NewIcon/RadioButton.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const RadioButtonUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="radioButtonUi-radioButton-link" to="#">
          <span className="secondaryColor">
            {/* <img src={RadioBtn} alt="" /> */}
            <RadioButton />
          </span>
          <p className="secondaryColor">{t("Radio Button")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default RadioButtonUi;
