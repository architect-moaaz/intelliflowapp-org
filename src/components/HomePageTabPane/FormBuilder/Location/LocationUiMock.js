import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

export default function LocationUiMock({ onClick, item, deleteItem }) {
  const lat = parseFloat(item.lat);
  const lng = parseFloat(item.lng);
  const zoom = parseFloat(item.zoomLevel);

  return (
    // <div
    //   className="bg-white"
    //   key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      {/* <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="ImageIcon"
        /> */}
      <span className="mockElementSpan secondaryColor">
        {item.fieldName && <div>{parse(item.fieldName)}</div>}
        <div>
          <iframe
            id="location-iframe"
            src={`http://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
            height="100%"
            width="100%"
          ></iframe>
        </div>
      </span>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="location-delete-icon"
      />
    </div>
    // </div>
  );
}
