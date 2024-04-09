import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as RadioButton } from "../../../assets/NewIcon/RadioButton.svg";
import { Draggable } from "react-drag-and-drop";
import { useTranslation } from "react-i18next";

export default function ButtonUi({ item }) {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="buttonUi-radioButton-link" to="#">
          <span className="secondaryColor">
            {/* <img src={RadioBtn} alt="" /> */}
            <RadioButton />
          </span>
          <p className="secondaryColor">{item.placeholder}</p>
        </Link>
      </Draggable>
    </li>
  );
}
