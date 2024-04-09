import React from "react";
import { Link } from "react-router-dom";
// import { Section } from "../../../assets";
import { ReactComponent as Section } from "../../../assets/NewIcon/Section.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const SectionUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="sectionUi-section-link" to="#">
          <span className="secondaryColor">
            {/* <img src={Section} alt="" /> */}
            <Section />
          </span>
          <p className="secondaryColor">{t("Section")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default SectionUi;
