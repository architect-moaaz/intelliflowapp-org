import React from "react";
import { Link } from "react-router-dom";
import { MathIcon } from "../../../assets";
import { Draggable } from "react-drag-and-drop";
import { useTranslation } from "react-i18next"

const MathExpUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
{t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="mathExpUi-mathExp-link" to="#">
          <span className="mockElementSpan secondaryColor">
            <img src={MathIcon} alt="" />
          </span>
          <p className="secondaryColor">{t("Math Exp.")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default MathExpUi;
