import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";

export default function RecentActivitiesUiMock({
  onClick,
  item,
  deleteItem,
  Orderkey,
}) {
  return (
    // <div
    //   className="bg-white"
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact iconSet={iconSet} color="#C4C4C4" size={20} icon="Number" />
      <span id="recent-act-tab" className="mockElementSpan secondaryColor">Recent Activities Tab</span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="recent-activity-delete-icon"
      />
    </div>
    // </div>
  );
}
