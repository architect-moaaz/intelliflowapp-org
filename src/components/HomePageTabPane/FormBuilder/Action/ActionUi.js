import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Action } from "../../../../assets/NewIcon/action.svg";
import { useTranslation } from "react-i18next"

export default function ActionUi({ item }) {
  const [t, i18n] = useTranslation("common");
{t("mobile")}

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-action" to="#" >
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Action />
            </span>
          </span>
          <p className="secondaryColor">{t("Action")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
