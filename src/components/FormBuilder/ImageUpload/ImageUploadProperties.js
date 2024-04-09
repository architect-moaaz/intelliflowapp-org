import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import StyleComponent from "../Label/StyleComponent";
import "./ImageUpload.css";
import AccessibilityMiniTable from "../../AccessibilityMiniTable/AccessibilityMiniTable";
import AccessibilityPopup from "../../AccessibilityPopup/AccessibilityPopup";
import { ReactComponent as ImageUpload } from "../../../assets/NewIcon/Image.svg";
import { useTranslation } from "react-i18next";
const ImageUploadProperties = ({
  element,
  layout,
  setLayout,
  handleShow,
  placeholderChange,
}) => {
  const [t, i18n] = useTranslation("common");
  const [showAccessibilityPopup, setShowAccessibilityPopup] = useState(false);
  const handleAccessibilityPopupClose = () => setShowAccessibilityPopup(false);
  const handleAccessibilityPopupShow = () => setShowAccessibilityPopup(true);

  const findIndex = () => {
    var index;
    for (let i = 0; i < layout.layout.length; i++) {
      if (layout.layout[i].edit == true) {
        index = i;
        break;
      }
    }
    return index;
  };

  const index = findIndex();

  const [accessibilityData, setAccessibilityData] = useState(
    layout.layout[index].accessibility
  );

  const displayAccessibility = () => {
    if (showAccessibilityPopup == true) {
      return (
        <AccessibilityPopup
          layout={layout}
          setLayout={setLayout}
          handleHidePopup={handleAccessibilityPopupClose}
          id="imageUploadProperties-handleAccessibilityPopupClose-AccessibilityPopup"
        />
      );
    }
  };

  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  
  useEffect(() => {
    if (!uploadedFile) {
      setUploadedFilePreview(undefined);
      return;
    }

    // console.log("uploadedfilemain", uploadedFile);
    const objectUrl = URL.createObjectURL(uploadedFile);
    // console.log("objecturll", objectUrl);

    setUploadedFilePreview(objectUrl);
    // console.log("ufpmain", uploadedFilePreview);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  const handleFileChange = (e) => {
    handleImageChange(e.target.files[0]);
    placeholderChange(null, "imageReload", "Reload");
    setIsUploaded(true);
  };

  const handleImageChange = (newImage) => {
    var layoutTemp = layout;
    // console.log("newimg", newImage);

    // layoutTemp.layout.forEach((e) => {
    //   if (e.edit == true) {
    //     if (e.stack.length) {
    //     } else {
    //       e.imageUrl = newImage;
    //       e.isUrlAvailable = false;
    //       e.imageDataTemp = newImage;
    //       setUploadedFile(newImage);
    //       // console.log("newimg", newImage);
    //       placeholderChange(null, "imageDataTemp", newImage);
    //       placeholderChange(null, "isUrlAvailable", false);
    //       placeholderChange(null, "imageUrl", newImage);
    //     }
    //   }
    // });

    layoutTemp.layout.forEach((lay) => {
      if (lay.edit) {
        if (lay?.stack?.length) {
          lay.stack.forEach((stack) => {
            if (stack.edit) {
              stack.imageUrl = newImage;
              stack.isUrlAvailable = false;
              stack.imageDataTemp = newImage;
              setUploadedFile(newImage);
              // console.log("newimg", newImage);
              placeholderChange(null, "imageDataTemp", newImage);
              placeholderChange(null, "isUrlAvailable", false);
              placeholderChange(null, "imageUrl", newImage);
            }
          });
        } else {
          lay.imageUrl = newImage;
          lay.isUrlAvailable = false;
          lay.imageDataTemp = newImage;
          setUploadedFile(newImage);
          // console.log("newimg", newImage);
          placeholderChange(null, "imageDataTemp", newImage);
          placeholderChange(null, "isUrlAvailable", false);
          placeholderChange(null, "imageUrl", newImage);
        }
      }
    });

    setLayout(layoutTemp);
  };

  var [values, setValues] = useState("");

  const handleChange = (evt) => {
    setValues(evt.target.value);
    placeholderChange(evt, "fieldName", null);
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
                placeholder={element.fieldName}
                value={element.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                onChange={(e) => {
                  handleChange(e, "fieldName");
                }}
                id="imageUploadProperties-fieldName-input"
              />
            </div> */}
            {/* <div className="form-input">
              <label>Upload Image</label>
              <input type="text" />
            </div> */}

            <div className="form-input">
              <label className="secondaryColor">{t("uploadImage")}</label>
              <div
                className="ps-2 pt-1"
                style={{ border: "1px solid #E5E5E5" }}
              >
                <label
                  htmlhtmlFor="upload-img"
                  className="secondaryColor"
                  onChange={handleFileChange}
                  id="imageUploadProperties-uploadImg-label"
                >
                  <input type="file" class="file" id="upload-img" />
                  {uploadedFile == null ? (
                    <>
                      <ImageUpload
                        style={{ height: 30, width: 30 }}
                        
                      />
                    </>
                  ) : (
                    <div className="d-flex flex-row">
                      <img
                        height={30}
                        width={30}
                        style={{ borderRadius: 5 }}
                        src={uploadedFilePreview}
                      />
                      <span className="secondaryColor">
                        {isUploaded && <div style= {{ color: "grey" , marginLeft:"12px", marginTop:"1px", fontSize:"12px"}}>Uploaded successfully!</div>}
                      </span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* <div className="form-input">
              <label>Select Shape</label>
              <select>
                <option></option>
              </select>
            </div>
            <div className="form-input">
              <label>Select Boldness</label>
              <select>
                <option></option>
              </select>
            </div>
            <div className="form-input">
              <div className="col-6 form-input">
                <label>Alignment</label>
                <select>
                  <option></option>
                </select>
              </div>
              <div className="col-6 form-input">
                <label>Fit To</label>
                <select>
                  <option></option>
                </select>
              </div>
            </div> */}

            <div className="accessibility-wrap">
              <div className="accessibility-head-wrap">
                <h6 className="primaryColor">Accessibility</h6>
                <Link
                to="#"
                  id="imageUploadProperties-Accessibility-link"
                  onClick={handleAccessibilityPopupShow}
                >
                  {t("explore")}
                </Link>
              </div>

              <AccessibilityMiniTable
                tableData={layout.layout[index].accessibility}
              />
            </div>

            {displayAccessibility()}
            {/* <div className="text-btn-wrap">
              <Link  className="btn btn-blue-border">
                Calculate
              </Link>
              <Link  className="btn btn-blue-border" onClick={handleShow}>
                Pattern Validation/Save
              </Link>
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
            id="imageUploadProperties-handleChange-StyleComponent"
          />
        </div>
      </div>
    </>
  );
};

export default ImageUploadProperties;



