import React from "react";
import { Link } from "react-router-dom";
// import { Grid } from "../../../assets";
import { ReactComponent as Grid } from "../../../../assets/NewIcon/Grid.svg";
import { useTranslation } from "react-i18next"
import { Draggable } from "react-drag-and-drop";

const DataGridUi = ({ item }) => {
  const [t, i18n] = useTranslation("common");
{t("mobile")}
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="drag-data-grid" to="#">
          <span className="secondaryColor">
            {/* <img src={Grid} alt="" /> */}
            <Grid />
          </span>
          <p className="secondaryColor">{t("Data Grid")}</p>
        </Link>
      </Draggable>
    </li>
  );
};
export default DataGridUi;