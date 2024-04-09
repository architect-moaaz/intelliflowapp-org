import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Todo } from "../../../../assets/NewIcon/todo.svg";
// import IcomoonReact from "icomoon-react";
import { useTranslation } from "react-i18next";

export default function ToDoUi({ item }) {
  const [t, i18n] = useTranslation("common");

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-todo" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Todo />
            </span>
          </span>
          <p className="secondaryColor">{t("To-Do List")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
