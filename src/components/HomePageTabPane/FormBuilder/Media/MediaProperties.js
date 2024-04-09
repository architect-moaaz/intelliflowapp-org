import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import StyleComponent from "../Label/StyleComponent";
import "./Media.css";
import { toast } from "react-toastify";
import {ReactComponent as MediaIcon} from "../../../../assets/Icons/Media.svg"

export default function MediaProperties({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) {
  const [uploadedFile, setUploadedFile] = useState("");
  const [uploadedFilePreview, setUploadedFilePreview] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  var [values, setValues] = useState("");

  useEffect(() => {
    if (!uploadedFile) {
      setUploadedFilePreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(uploadedFile);
    setUploadedFilePreview(objectUrl);

    // free memory whenever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  const handleFileChange = (e) => {
    const newMedia = e.target.files[0];
    if (newMedia.size > 6000000) {
      toast.error(`File size exceeds 5MB`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      var layoutTemp1 = layout;
      layoutTemp1.layout.forEach((e) => {
        if (e.edit == true) {
          e.mediaUrl = null;
          e.mediaType = null;
          e.mediaUploaded = false;
        }
      });
      setLayout(layoutTemp1);

      return;
    }
    setUploadedFile(newMedia);

    var layoutTemp = layout;
    layoutTemp.layout.forEach((e) => {
      if (e.edit == true) {
        e.mediaUrl = newMedia;
        e.mediaType = newMedia.type;
        e.mediaUploaded = false;
      }
    });
    setLayout(layoutTemp);
    placeholderChange(null, "imageReload", "Reload");
    setIsUploaded(true);
  };

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, evt.target.id, null);
  };

  const handleAutoPlayChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, evt.target.id, evt.target.checked);
  };

  return (
    <>
      <ul class="nav nav-pills label-pills" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active propertiesPopup"
            id="pills-home-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-home"
            type="button"
            role="tab"
            aria-controls="pills-home"
            aria-selected="true"
          >
            Property
          </button>
        </li>
        {/* <li class="nav-item" role="presentation">
          <button
            class="nav-link propertiesPopup"
            id="pills-profile-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-profile"
            type="button"
            role="tab"
            aria-controls="pills-profile"
            aria-selected="false"
          >
            Style
          </button>
        </li> */}
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-home"
          role="tabpanel"
          aria-labelledby="pills-home-tab"
        >
          <form>
            {/* <div className="form-input">
              <label>Field Name</label>
              <input
                type="text"
                id="fieldName"
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={handleChange}
              />
            </div> */}
            <div className="form-input">
              <label className="secondaryColor">Select Media</label>
              <label className="custom-file-upload mediaProperties-upload secondaryColor">
                {/* <input
                type="file"
                class="file-upload-input"
                id="upload-img"
                onChange={handleFileChange}
              /> */}
                <div className="d-flex flex-row" onChange={handleFileChange}>
                  <input type="file" class="file" id="upload-img" />
                  <MediaIcon
                    style={{ height: 30, width: 30 }}
                    
                  />
                  <span className="secondaryColor">
                    {isUploaded && (
                      <div style={{ color: "grey" , marginLeft:"12px", marginTop:"1px", fontSize:"12px"}}>
                        Uploaded Successfully!
                      </div>
                    )}
                  </span>
                </div>
              </label>
            </div>
            <div className="form-input">
              <label className="secondaryColor"
                id="media-prop-auto-play"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <input
                  type="checkbox"
                  id="autoPlay"
                  checked={element.autoPlay}
                  style={{ height: "15px", width: "15px", marginRight: "5px" }}
                  onChange={handleAutoPlayChange}
                />
                <span className="secondaryColor">Auto Play</span>
              </label>
            </div>
            {/* <div className="text-btn-wrap">
              <button className="btn btn-blue-border">Calculate</button>
              <button className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </button>
            </div> */}
          </form>
        </div>
        <div
          class="tab-pane fade"
          id="pills-profile"
          role="tabpanel"
          aria-labelledby="pills-profile-tab"
        >
          <StyleComponent
            newValueLabel={values}
            handleChangeValue={handleChange}
            element={element}
          />
        </div>
      </div>
    </>
  );
}
