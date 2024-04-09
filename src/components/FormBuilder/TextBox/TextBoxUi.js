import React from "react";
import { Link } from "react-router-dom";
import { TextBox } from "../../../assets";
import { ReactComponent as Text } from "../../../assets/NewIcon/Text.svg";
import { useTranslation } from "react-i18next";
import { Draggable } from "react-drag-and-drop";

const TextBoxUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
  {t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="textBoxUi-textBox-link" to="#">
          <span className="secondaryColor">
            {/* <img src={TextBox} alt="" /> */}
            <Text />
          </span>
          <p className="secondaryColor">{t("Text Box")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default TextBoxUi;
