import React from "react";
import { Link } from "react-router-dom";
import { LocationIcon } from "../../../../assets";
import { Draggable } from "react-drag-and-drop";
import { useTranslation } from "react-i18next"

const LocationUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}

  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="drag-location" to="#">
          <span className="secondaryColor">
            <img src={LocationIcon} alt="" />
          </span>
          <p className="secondaryColor">{t("Location")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default LocationUi;
