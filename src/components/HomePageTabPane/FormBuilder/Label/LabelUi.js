import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import LabelIcon from "../../../../assets/Icons/LabelIcon.svg";
import { ReactComponent as Label } from "../../../../assets/NewIcon/Label.svg";
// import IcomoonReact from "icomoon-react";
import { useTranslation } from "react-i18next"

export default function LabelUi({ item }) {
  const [t, i18n] = useTranslation("common");
{t("mobile")}

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-label" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Label />
            </span>
          </span>
          <p className="secondaryColor">{t("Label")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
