import React, { useState } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";
import Intellisheet from "../../Intellisheet/Intellisheet";

export default function IntellisheetUiMock({ onClick, item, deleteItem }) {
  const [dummyData, setDummyData] = useState([
    {
      data: [
        [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
        [{ value: "" }, { value: "" }, { value: "" }, { value: "" }],
      ],
      _id: 1,
    },
  ]);
  const selectedId = dummyData[0]._id;

  return (
    <div className="mockElement ">
      <div>
        <div>{item.fieldName ? parse(item.fieldName) : "Intellisheet"}</div>
        <div>
          <Intellisheet
            intellisheetState={dummyData}
            setIntellisheetState={setDummyData}
            selectedIntellisheetId={selectedId}
          />
        </div>
      </div>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="intellisheetUiMock-delete-IcomoonReact"
      />
    </div>
  );
}
