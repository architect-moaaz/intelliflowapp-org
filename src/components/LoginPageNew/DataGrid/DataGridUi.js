import React from "react";
import { Link } from "react-router-dom";
// import { Grid } from "../../../assets";
import { ReactComponent as Grid } from "../../../assets/NewIcon/Grid.svg";

import { Draggable } from "react-drag-and-drop";

const DataGridUi = ({ item }) => {
  return (
    <li>
      <Draggable type="element" data={JSON.stringify(item)} key={item.id}>
        <Link id="dataGridUi-dataGrid-link" to="#">
          <span className="secondaryColor">
            {/* <img src={Grid} alt="" /> */}
            <Grid />
          </span>
          Data Grid
        </Link>
      </Draggable>
    </li>
  );
};
export default DataGridUi;
