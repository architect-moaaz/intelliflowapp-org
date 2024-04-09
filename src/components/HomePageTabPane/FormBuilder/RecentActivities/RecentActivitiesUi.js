import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Todo } from "../../../../assets/NewIcon/todo.svg";
// import IcomoonReact from "icomoon-react";
import { useTranslation } from "react-i18next"

export default function RecentActivitiesUi({ item }) {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-recent-activity" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Todo />
            </span>
          </span>
          <p className="secondaryColor">{t("Recent Activity")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
