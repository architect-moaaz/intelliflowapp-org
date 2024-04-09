import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Image } from "../../../../assets/NewIcon/Image.svg";
import {ReactComponent as MediaIcon} from "../../../../assets/Icons/Media.svg"
import { Draggable } from "react-drag-and-drop";
import { useTranslation } from "react-i18next"

export default function MediaUi({ item }) {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="drag-media" to="#">
          <span className="secondaryColor">
            <MediaIcon />
          </span>
          <p className="secondaryColor">{t("Media Upload")}</p>
        </Link>
      </Draggable>
    </li>
  );
}
