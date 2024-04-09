import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";

export default function EmbedUiMock({ onClick, item, deleteItem, Orderkey }) {
  const type = item?.mediaType;
  const src = item?.mediaUrl;
  return (
    <div className="mockElement ">
      {item.mediaUrl ? (
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <embed type={type} src={src} width="90%" height="90%" />
        </div>
      ) : (
        <span className="mockElementSpan secondaryColor">{item.fieldName ?? "Embed"}</span>
      )}

      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="embed-delete-icon"
      />
    </div>
  );
}
