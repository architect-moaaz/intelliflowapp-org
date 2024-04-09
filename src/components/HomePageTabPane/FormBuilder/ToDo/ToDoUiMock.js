import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { useTranslation } from "react-i18next";

export default function ToDoUiMock({ onClick, item, deleteItem, Orderkey }) {
  const [t, i18n] = useTranslation("common");

  return (
    // <div
    //   className="bg-white"
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact iconSet={iconSet} color="#C4C4C4" size={20} icon="Number" />
      <span className="mockElementSpan secondaryColor">{t("To-Do List")}</span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="todo-delete-icon"
      />
    </div>
    // </div>
  );
}
