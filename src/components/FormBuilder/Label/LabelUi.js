import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import LabelIcon from "../../../assets/Icons/LabelIcon.svg";
import { ReactComponent as Label } from "../../../assets/NewIcon/Label.svg";
import { useTranslation } from "react-i18next";
// import IcomoonReact from "icomoon-react";

const LabelUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
{t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="labelUi-label-link" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Label />
            </span>
          </span>
          <p className="secondaryColor"> {t("Label")} </p>
        </Link>
      </Draggable>
    </li>
  );
};
export default LabelUi;
