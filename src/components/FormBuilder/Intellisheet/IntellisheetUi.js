import React from "react";
import { Link } from "react-router-dom";
// import { LinkIcon } from "../../../assets";
import { ReactComponent as Todo } from "../../../assets/NewIcon/todo.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

export default function IntellisheetUi({ item }) {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="intellisheetUi-intellisheet-link" to="#">
          <span className="secondaryColor">
            {/* <img src={LinkIcon} alt="" /> */}
            <Todo />
          </span>
          <p className="secondaryColor">{t("Intellisheet")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
