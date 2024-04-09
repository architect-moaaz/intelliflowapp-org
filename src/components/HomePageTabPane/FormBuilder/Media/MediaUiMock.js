import React, { useEffect } from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";

export default function MediaUiMock({ onClick, item, deleteItem }) {
  useEffect(() => {}, [item.mediaUrl]);

  const renderMedia = () => {
    const mediaType = getMediaType();

    switch (mediaType) {
      case "image":
        return (
          <img
            id="media-image"
            height="100%"
            width="100%"
            alt="uploaded"
            src={
              item.mediaUploaded
                ? process.env.REACT_APP_CDS_ENDPOINT +
                  item.mediaUrl +
                  `?Authorization=${localStorage.getItem(
                    "token"
                  )}&workspace=${localStorage.getItem("workspace")}`
                : URL.createObjectURL(item?.mediaUrl)
            }
            crossOrigin="anonymous"
          />
        );

      case "audio":
        return (
          <div>
            <audio
              id="media-audio"
              src={
                item.mediaUploaded
                  ? process.env.REACT_APP_CDS_ENDPOINT +
                    item.mediaUrl +
                    `?Authorization=${localStorage.getItem(
                      "token"
                    )}&workspace=${localStorage.getItem("workspace")}`
                  : URL.createObjectURL(item?.mediaUrl)
              }
              controls
              autoPlay={item.autoPlay}
            />
          </div>
        );

      case "video":
        return (
          <video
            id="meida-video"
            width="100%"
            height="100%"
            controls
            autoPlay={item.autoPlay}
          >
            <source
              id="media-video-source"
              src={
                item.mediaUploaded
                  ? process.env.REACT_APP_CDS_ENDPOINT +
                    item.mediaUrl +
                    `?Authorization=${localStorage.getItem(
                      "token"
                    )}&workspace=${localStorage.getItem("workspace")}`
                  : URL.createObjectURL(item?.mediaUrl)
              }
              type={item.mediaType}
            />
          </video>
        );

      default:
        return (
          <h1 className="primaryColor" style={{ alignText: "center", fontSize: "14px" }}>
            Select Media
          </h1>
        );
    }
  };

  const getMediaType = () => {
    if (item.mediaType === "audio/mpeg") return "audio";

    if (item.mediaType === "image/png" || item.mediaType === "image/jpeg")
      return "image";

    if (item.mediaType === "video/mp4") return "video";

    return item.mediaType;
  };

  return (
    <div className="mockElement" style={{ flexDirection: "column" }}>
      <div
        style={{
          height: "90%",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        {renderMedia()}
      </div>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="media-delete-icon"
      />
    </div>
  );
}
