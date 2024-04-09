import React from "react";
import { Link } from "react-router-dom";
import { Draggable } from "react-drag-and-drop";
import { ReactComponent as Rating } from "../../../../assets/NewIcon/Rating.svg";
import { useTranslation } from "react-i18next";

export default function EmbedUi({ item }) {
  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.i}>
        <Link id="drag-embed" to="#">
          <span className="secondaryColor">
            <span className="secondaryColor">
              <Rating />
            </span>
          </span>
          <p className="secondaryColor">{t("Embed")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
