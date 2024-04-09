import React, { useState, useEffect } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const ImageUploadUiMock = ({ onClick, item, deleteItem }) => {
  const [imagepath, setImagepath] = useState(item.imageUrl);
  const [uploadedFile, setUploadedFile] = useState(item.imageDataTemp);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);

  //   useEffect(() => {
  //     if (uploadedFile == null) {
  //         setUploadedFilePreview(undefined)
  //         return
  //     }

  //     else if(uploadedFile !== null){
  //       console.log(typeof uploadedFile)
  //       console.log("uploadedfile",uploadedFile)

  //         const objectUrl = URL.createObjectURL(uploadedFile)
  //         console.log("objecturll",objectUrl)
  //         // uploadFileCDS()
  //         // handleSubmit()
  //         setUploadedFilePreview(objectUrl)

  //         console.log("ufp", uploadedFilePreview)

  //         // free memory when ever this component is unmounted
  //         return () => URL.revokeObjectURL(objectUrl)
  //     }

  // }, [uploadedFile])

  return (
    // <div
    //   className="bg-white"
    //   key={item.id}
    //   // onClick={() => onClick()}
    // >
    <div className="mockElement ">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="ImageIcon"
      />

      {item.isUrlAvailable == true ? (
        <span className="mockElementSpanImage secondaryColor">
          <img
            height="100%"
            width="100%"
            style={{ borderRadius: 5, pointerEvents: "none" }}
            alt="Image Missing"
            src={`${
              process.env.REACT_APP_CDS_ENDPOINT + item.imageUrl
            }?Authorization=${localStorage.getItem(
              "token"
            )}&workspace=${localStorage.getItem("workspace")}`}
            crossOrigin="anonymous"
          />
        </span>
      ) : item.isUrlAvailable == false && item.imageDataTemp?.name ? (
        <span className="mockElementSpanImage secondaryColor">
          <img
            height="100%"
            width="100%"
            alt="temp"
            src={URL.createObjectURL(item.imageDataTemp)}
            style={{ pointerEvents: "none" }}
          />
        </span>
      ) : (
        <span className="mockElementSpan secondaryColor">Image Upload</span>
      )}

      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={(e) => deleteItem(e, item.id)}
        id="imageUploadUiMock-delete-IcomoonReact"
      />
    </div>
    // </div>
  );
};

export default ImageUploadUiMock;
