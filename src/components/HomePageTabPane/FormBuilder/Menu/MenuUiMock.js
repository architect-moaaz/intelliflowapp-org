import React, { useState } from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { useTranslation } from "react-i18next";

export default function MenuUiMock({ onClick, item, deleteItem, Orderkey }) {
  const [t, i18n] = useTranslation("common");
  return (
    <div className="mockElement ">
      <h3 className="primaryColor" id="menu-field-name">{item.fieldName ?? t("menu")}</h3>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="menu-delete-icon"
      />
    </div>
  );
}
