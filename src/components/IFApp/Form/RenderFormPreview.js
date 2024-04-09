import React, { useState, useRef, useEffect } from "react";
import { Modal } from "react-responsive-modal";
import QRCode from "react-qr-code";
import { Rating } from "react-simple-star-rating";
import "bootstrap/dist/css/bootstrap.css";
import ReactTooltip from "react-tooltip";
import "./formPreview.css";
import { calculateSize, Icon } from "@iconify/react";
import Select from "react-select";
import parse from "html-react-parser";
import { useForm, Controller } from "react-hook-form";
import Table from "../../DataTable/Table";
import PreviewFormRight from "./PreviewFormRight";
import SignaturePad from "react-signature-canvas";
import Intellisheet from "../../Intellisheet/Intellisheet";
import MathView, { MathViewRef } from "react-math-view";

const RenderFormPreview = (props) => {
  const [formData, setformData] = useState({});
  const [formProperty, setFormProperty] = useState({});
  const [isShown, setIsShown] = useState("");
  const [myEmail, setMyEmail] = useState(localStorage.getItem("username"));
  const [myGroup, setMyGroup] = useState("anime");
  const [datagridChanges, setdatagridChanges] = useState([]);
  const [renderFormPreviewData, setRenderFormPreviewData] = useState(
    props.layout
  );
  const [value, setValue] = useState("");
  const keyboardRef = useRef();
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();
  var showDefaultSave = true;

  const handleInfo = (e) => {
    setIsShown(e);
  };

  useEffect(() => {
    const fetchImage = async () => {
      const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
        props?.formProp?.backgroundImage
      }?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch the image");
        }

        const AppImageBlob = await response.blob();
        const AppImageBlobImage = new File([AppImageBlob], "image.jpg", {
          type: "image/jpg",
        });
        setGenerateBackgroundImage(AppImageBlobImage);
      } catch (error) {
        console.error(error);
        setGenerateBackgroundImage(null);
      }
    };

    fetchImage();
  }, [props?.formProp?.backgroundImage]);

  const previewModalstyle = {
    // width: `calc(100% - 180px + ${zoomValue}px)`,
    // zoom: `${zoomValue}%`,
    height: "100%",
    position: "relative",
    fontFamily: `${props?.formProp?.fontFamily}`,
  };
  if (props?.formProp?.backgroundColor?.length > 0) {
    previewModalstyle.backgroundColor = props?.formProp.backgroundColor;
  } else if (
    props?.formProp?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  ) {
    previewModalstyle.backgroundImage = `url(${URL.createObjectURL(
      generateBackgroundImage
    )})`;
    previewModalstyle.backgroundRepeat = "no-repeat";
    previewModalstyle.backgroundSize = "cover ";
  }
  //  else {
  //   previewModalstyle.backgroundColor = "";
  //   previewModalstyle.backgroundImage = `url(${FormBug})`;
  //   previewModalstyle.backgroundRepeat = "repeat";
  //   previewModalstyle.backgroundSize = "25%";
  // }

  const taskFormDetail = (e) => {
    setRenderFormPreviewData(e.formData);
    setFormProperty({
      BackgroundColor: e?.formProperties?.backgroundColor,
      FontFamily: props?.formProp?.fontFamily,
    });
  };

  const currentFormOpen = (e) => {
    setRenderFormPreviewData(props.layout);
    setFormProperty({
      BackgroundColor: props?.formProp?.backgroundColor,
      FontFamily: props?.formProp?.fontFamily,
    });

    // e.preventDefault();
  };

  const captureValue = (elem, variable, prefix, suffix) => {
    var data = formData;

    if (elem.target?.value) {
      if (elem.target.value == "true") {
        elem.target.value = true;
      } else if (elem.target.value == "false") {
        elem.target.value = false;
      }

      data[variable] = elem.target.value;
    } else if (elem) {
      data[variable] = elem.map((e) => e.label);
    }
    if (elem.target?.files != null) {
      data[variable] = elem.target.files[0];
    }
    setformData(data);
  };

  const determineAccessibility = (accessibilityData) => {
    for (let i = 0; i < accessibilityData.hideUsers?.length; i++) {
      let tempUsername = accessibilityData.hideUsers[i].username;
      if (tempUsername === myEmail) {
        return "keepHidden";
      }
    }

    for (let i = 0; i < accessibilityData.readUsers?.length; i++) {
      let tempUsername = accessibilityData.readUsers[i].username;
      if (tempUsername === myEmail) {
        return "readOnly";
      }
    }

    for (let i = 0; i < accessibilityData.writeUsers?.length; i++) {
      let tempUsername = accessibilityData.writeUsers[i].username;
      if (tempUsername === myEmail) {
        return "writePermissions";
      }
    }
    return "writePermissions";
  };

  const groupAccessibility = (accessibilityData) => {
    for (let i = 0; i < accessibilityData.hideGroups?.length; i++) {
      let tempGroupname = accessibilityData.hideGroups[i].name;
      if (tempGroupname === myGroup) {
        return "keepHidden";
      }
    }

    for (let i = 0; i < accessibilityData.readGroups?.length; i++) {
      let tempGroupname = accessibilityData.readGroups[i].name;
      if (tempGroupname === myGroup) {
        return "readOnly";
      }
    }

    for (let i = 0; i < accessibilityData.writeGroups?.length; i++) {
      let tempGroupname = accessibilityData.writeGroups[i].name;
      if (tempGroupname === myGroup) {
        return "writePermissions";
      }
    }
    return "writePermissions";
  };

  const {
    register,
    control,
    formState: { errors },
  } = useForm();

  // useEffect(() => {
  //   var getData = axios.get(
  //     process.env.REACT_APP_IFAPP_API_ENDPOINT +
  //       "q/" +
  //       localStorage.getItem("workspace")+
  //       "/" +
  //       localStorage.getItem("appName") +
  //       "/" +
  //       path +
  //       "/" +
  //       appID.id +
  //       "/tasks?user=" +
  //       localStorage.getItem("username"),
  //     { headers: { "Content-Type": "application/json" } }
  //   );
  //   getData();
  // }, []);
  // var forlayoutData = formLayout.formData ? formLayout.formData : formLayout;

  const RenderIntellisheetPreview = ({ e }) => {
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
      <div
        className="form-group"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 100}%`,
          height: `${(e.h / 10) * 100}%`,
          width: `${(e.w / 24) * 100}%`,
        }}
      >
        <Intellisheet
          intellisheetState={dummyData}
          setIntellisheetState={setDummyData}
          selectedIntellisheetId={selectedId}
        />
      </div>
    );
  };

  function renderFormElement(renderFormPreviewData) {
    const RenderSection = ({ e }) => {
      return (
        <div
          className="form-group customScrollBar"
          key={e.id}
          style={{
            position: "absolute",
            paddingBottom: "30px",
            left: `${(e.x / 24) * 100}%`,
            top: `${(e.y / 10) * 100}%`,
            // height: `${(e.h / 10) * 100}%`,
            width: `${(e.w / 24) * 100}%`,
            overflow: "auto",
          }}
        >
          {e.fieldName && <label> {parse(e.fieldName)}</label>}
          <div className="section-container">{renderFormElement(e.stack)}</div>
        </div>
      );
    };

    const RenderList = ({ e }) => {
      return (
        <div
          className="form-group customScrollBar"
          key={e.id}
          style={{
            position: "absolute",
            paddingBottom: "30px",
            left: `${(e.x / 24) * 100}%`,
            top: `${(e.y / 10) * 100}%`,
            // height: `${(e.h / 10) * 100}%`,
            width: `${(e.w / 24) * 100}%`,
            overflow: "auto",
          }}
        >
          {e.fieldName && <label> {parse(e.fieldName)}</label>}
          <div className="section-container">{renderFormElement(e.stack)}</div>
        </div>
      );
    };

    return renderFormPreviewData?.map((e) => {
      if (e.elementType == "button") {
        showDefaultSave = false;
      }
      const previledges = determineAccessibility(e.accessibility);
      const adminPreviledges = groupAccessibility(e.accessibility);

      let disabledStatus = true;

      if (
        previledges === "writePermissions" ||
        adminPreviledges === "writePermissions"
      ) {
        disabledStatus = false;
      } else if (
        previledges === "readOnly" &&
        adminPreviledges === "readOnly"
      ) {
        disabledStatus = true;
      }

      if (previledges === "keepHidden" && adminPreviledges === "keepHidden") {
      } else {
        if (e.elementType == "label") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
                textAlign: "center",
              }}
            >
              <p className="secondaryColor">
                {e.fieldName && parse(e.fieldName)}
              </p>
            </div>
          );
        } else if (e.elementType == "text") {
          if (e.fieldType == "email") {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <span style={{ color: "red" }}>*</span>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
                <input
                  id="renderFormPreview-elementType-textEmail"
                  defaultValue={e.defaultValue}
                  type={e.fieldType}
                  className={
                    (errors[e.processVariableName] ? "is-invalid" : "",
                    "inputStyle")
                  }
                  placeholder={e.placeholder}
                  disabled={disabledStatus}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  data-tip
                  data-for={e.processVariableName}
                  value={formData[e.processVariableName]}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onChange={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                />
                {e.toolTip != "" && (
                  <ReactTooltip
                    id={e.processVariableName}
                    place="top"
                    effect="solid"
                  >
                    {e.toolTip}
                  </ReactTooltip>
                )}
              </div>
            );
          } else if (e.fieldType == "mathExp") {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
                <MathView
                  ref={keyboardRef}
                  data-tip
                  data-for={e.processVariableName}
                  value={formData[e.processVariableName]}
                  placeholder={e.placeholder}
                  onChange={(elem) => {
                    captureValue(elem, e.processVariableName, null, null);
                  }}
                  virtualKeyboardMode="manual"
                  className="border"
                  id="renderForm-mathView"
                />
              </div>
            );
          } else {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <span style={{ color: "red" }}>*</span>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>

                <input
                  id="renderFormPreview-elementType-text"
                  defaultValue={e.defaultValue}
                  type={e.elementType}
                  className={
                    (errors[e.processVariableName] ? "is-invalid" : "",
                    "inputStyle")
                  }
                  placeholder={e.placeholder}
                  disabled={disabledStatus}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  data-tip
                  data-for={e.processVariableName}
                  value={formData[e.processVariableName]}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onChange={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                />
                {e.toolTip != "" && (
                  <ReactTooltip
                    id={e.processVariableName}
                    place="top"
                    effect="solid"
                  >
                    {e.toolTip}
                  </ReactTooltip>
                )}
              </div>
            );
          }
        } else if (e.elementType == "number") {
          return (
            <div
              className={"form-group"}
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {e.fieldName && parse(e.fieldName)}
                {String(e.required) == "true" && (
                  <spam style={{ color: "red" }}>*</spam>
                )}
                {errors[e.processVariableName] && (
                  <span
                    class="badge secondaryColor"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <small className="requiredTextColor">
                    <b>
                      Please enter your{" "}
                      {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                    </b>
                  </small>
                )}
              </label>
              <input
                id="renderFormPreview-elementType-number"
                defaultValue={e.defaultValue}
                type={e.elementType}
                placeholder={e.placeholder}
                className={
                  (errors[e.processVariableName] ? "is-invalid" : "",
                  "inputStyle")
                }
                disabled={disabledStatus}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                data-tip
                data-for={e.processVariableName}
                value={formData[e.processVariableName]}
                // {...register(e.processVariableName, {
                //   required: JSON.parse(e.required),
                // })}
                onChange={(elem) => {
                  captureValue(elem, e.processVariableName, e.prefix, e.suffix);
                }}
              />
              {e.toolTip != "" && (
                <ReactTooltip
                  id={e.processVariableName}
                  place="top"
                  effect="solid"
                >
                  {e.toolTip}
                </ReactTooltip>
              )}
            </div>
          );
        } else if (e.elementType == "date") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {e.fieldName && parse(e.fieldName)}
                {String(e.required) == "true" && (
                  <spam style={{ color: "red" }}>*</spam>
                )}
                {errors[e.processVariableName] && (
                  <span
                    class="badge secondaryColor"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <small className="requiredTextColor">
                    <b>
                      Please select your{" "}
                      {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                    </b>
                  </small>
                )}
              </label>
              <input
                id="renderFormPreview-elementType-date"
                type={e.elementType}
                className={
                  (errors[e.processVariableName] ? "is-invalid" : "",
                  "inputStyle")
                }
                placeholder={e.placeholder}
                disabled={disabledStatus}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                value={formData[e.processVariableName]}
                // {...register(e.processVariableName, {
                //   required: JSON.parse(e.required),
                // })}
                onChange={(elem) => {
                  captureValue(elem, e.processVariableName, e.prefix, e.suffix);
                }}
              />
            </div>
          );
        } else if (e.elementType == "dropdown") {
          if (e.multiSelect == false || e.multiSelect == null) {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please select anyone option from{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
                <select
                  id="renderFormPreview-elementType-dropdown"
                  className={
                    (errors[e.processVariableName] ? "is-invalid" : "",
                    "inputStyle")
                  }
                  value={formData[e.processVariableName]}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onChange={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <option value="">Select</option>
                  {e.choices.map((option) => {
                    return (
                      <option value={option.value} key={option.id}>
                        {option.label}
                      </option>
                    );
                  })}
                </select>
              </div>
            );
          } else {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Select atleast one option from{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>

                <Controller
                  name={e.processVariableName}
                  control={control}
                  render={({ onChange, value, ref }) => (
                    <div
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Select
                        id="renderFormPreview-inputStyleSelect"
                        className="inputStyleSelect"
                        style={{
                          background: "white",
                        }}
                        options={e.choices}
                        onChange={(elem) => {
                          captureValue(
                            elem,
                            e.processVariableName,
                            e.prefix,
                            e.suffix
                          );
                        }}
                        isMulti={e.multiSelect}
                      />
                    </div>
                  )}
                />
              </div>
            );
          }
        } else if (e.elementType == "radio") {
          const buttonClick = (e, val) => {
            e.preventDefault();
            setValue(val);
          };

          return (
            <div
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <div>
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{
                        color: "red",
                        cursor: "pointer",
                        display: "flex",
                      }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Select your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
              </div>
              {e.VAxis ? (
                <>
                  {e.choices.map((option) => {
                    return (
                      <div style={{ display: "block" }}>
                        <input
                          className={
                            ("form-check-input",
                            errors[e.processVariableName] ? "is-invalid" : "")
                          }
                          type="radio"
                          id={e.id}
                          checked={value === option.key ? true : false}
                          onChange={(e) => buttonClick(e, option.key)}
                          style={{ marginRight: "5px" }}
                        />
                        <label
                          style={{ marginLeft: "10px" }}
                          className="form-check-label secondaryColor"
                        >
                          {option.choice}
                        </label>
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {e.choices.map((option) => {
                    return (
                      <span className="secondaryColor">
                        <label
                          style={{ marginLeft: "10px" }}
                          className="form-check-label secondaryColor"
                        >
                          <input
                            className={
                              ("form-check-input",
                              errors[e.processVariableName] ? "is-invalid" : "")
                            }
                            type="radio"
                            id={e.id}
                            checked={value === option.key ? true : false}
                            onChange={(e) => buttonClick(e, option.key)}
                            style={{ marginRight: "5px" }}
                          />

                          {option.choice}
                        </label>
                      </span>
                    );
                  })}
                </>
              )}
            </div>
          );
        } else if (e.elementType == "rating") {
          if (e.ratingType == "slider") {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
                <input
                  id="renderFormPreview-elementType-rating"
                  type={"range"}
                  min="0"
                  max={e.ratingScale}
                  className="form-control-range"
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  value={formData[e.processVariableName]}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onChange={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                />
              </div>
            );
          } else if (e.ratingType == "star") {
            return (
              <div
                className="form-group"
                key={e.id}
                style={{
                  position: "absolute",
                  paddingBottom: "30px",
                  left: `${(e.x / 24) * 100}%`,
                  top: `${(e.y / 10) * 100}%`,
                  height: `${(e.h / 10) * 100}%`,
                  width: `${(e.w / 24) * 100}%`,
                }}
              >
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
                <Rating
                  iconsCount={e.ratingScale}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onClick={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                  ratingValue={e.ratingScale}
                  id="renderFormPreview-rating"
                />
              </div>
            );
          }
        } else if (e.elementType == "file") {
          let allowedFileTypes = e.allowedFileTypes.map((type) => {
            return `.${type}`;
          });

          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {e.fieldName && parse(e.fieldName)}
                {String(e.required) == "true" && (
                  <span style={{ color: "red" }}>*</span>
                )}
                {errors[e.processVariableName] && (
                  <span
                    class="badge secondaryColor"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <small className="requiredTextColor">
                    <b>
                      Please enter your{" "}
                      {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                    </b>
                  </small>
                )}
              </label>
              <label class="custom-file-upload">
                <input
                  type={e.elementType}
                  accept={
                    allowedFileTypes?.length !== 0
                      ? allowedFileTypes.toString()
                      : ""
                  }
                  className={
                    ("form-control-file",
                    errors[e.processVariableName] ? "is-invalid" : "")
                  }
                  id={e.id}
                  style={{
                    height: "100%",
                    width: "100%",
                  }}
                  // {...register(e.processVariableName, {
                  //   required: JSON.parse(e.required),
                  // })}
                  onChange={(elem) => {
                    captureValue(
                      elem,
                      e.processVariableName,
                      e.prefix,
                      e.suffix
                    );
                  }}
                />
                {formData[e.processVariableName] ? (
                  <span
                    className="secondaryColor"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    File Uploaded Successfully{" "}
                    <button
                      style={{
                        color: "rgba(17, 169, 255, 0.5)",
                        background: "transparent",
                      }}
                    ></button>
                  </span>
                ) : (
                  "Drag & Drop to upload"
                )}
              </label>
            </div>
          );
        } else if (e.elementType == "image") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {e.fieldName && parse(e.fieldName)}
              </label>

              <img
                style={{ height: "100%", width: "100%" }}
                src={
                  process.env.REACT_APP_CDS_ENDPOINT +
                  e.imageUrl +
                  `?Authorization=${localStorage.getItem(
                    "token"
                  )}&workspace=${localStorage.getItem("workspace")}`
                }
                crossOrigin="anonymous"
              />
            </div>
          );
        } else if (e.elementType == "checkbox") {
          return (
            <div
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <div>
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
              </div>
              {e.choices.map((option) => {
                return (
                  <div
                    key={option.id}
                    className={
                      e.VAxis == true
                        ? "form-check"
                        : " form-check form-check-inline"
                    }
                    style={{ marginLeft: "5px" }}
                  >
                    <input
                      id="renderFormPreview-elementType-checkbox"
                      className={
                        ("form-check-input",
                        errors[e.processVariableName] ? "is-invalid" : "")
                      }
                      type="checkbox"
                      // name={option.key}
                      value={option.choice}
                      // {...register(e.processVariableName, {
                      //   required: JSON.parse(e.required),
                      // })}
                      onChange={(elem) => {
                        captureValue(
                          elem,
                          e.processVariableName,
                          e.prefix,
                          e.suffix
                        );
                      }}
                    />
                    <label
                      style={{ marginLeft: "5px" }}
                      className="form-check-label secondaryColor"
                    >
                      {option.choice}
                    </label>
                  </div>
                );
              })}
            </div>
          );
        } else if (e.elementType == "qrcode") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <div>
                <label className="fieldLable secondaryColor">
                  {e.fieldName && parse(e.fieldName)}
                  {String(e.required) == "true" ? (
                    <spam style={{ color: "red" }}>*</spam>
                  ) : (
                    " "
                  )}
                  {errors[e.processVariableName] && (
                    <span
                      class="badge secondaryColor"
                      style={{ color: "red", cursor: "pointer" }}
                    >
                      <Icon
                        icon="clarity:info-standard-line"
                        height="15"
                        alt="info"
                        onMouseEnter={() => handleInfo(e.id)}
                        onMouseLeave={() => handleInfo("")}
                      />
                    </span>
                  )}
                  {isShown == e.id && (
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  )}
                </label>
              </div>
              <QRCode value={e.fieldName} size={50} />
            </div>
          );
        } else if (e.elementType == "dataGrid") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <Table
                dataGridProperties={e.dataGridProperties}
                datagridChanges={datagridChanges}
                setdatagridChanges={setdatagridChanges}
                fieldName={e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                accessibilityprop={e.accessibility}
                // gridColumns={e.dataGridProperties.cols}
                disabledStatus={disabledStatus}
              />
            </div>
          );
        } else if (e.elementType == "esign") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <SignaturePad
                canvasProps={{
                  className: "sigPad",
                  width: e.eSignatureProperties.width ?? 200,
                  height: e.eSignatureProperties.height ?? 200,
                }}
                penColor={e.eSignatureProperties.penColor}
              />
              <button
                className="clear-button btn"
                onClick={() => console.log("cleared")}
                id="renderFormPreview-signaturePad"
              >
                X
              </button>
            </div>
          );
        } else if (e.elementType == "mathExp") {
          return (
            <div
              className="form-group disabled"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
                textAlign: "center",
              }}
            >
              <MathView value={e.fieldName} />
            </div>
          );
        } else if (e.elementType == "button") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
                textAlign: "center",
              }}
            >
              <button
                id="renderFormPreview-elementType-button"
                style={{
                  height: "100%",
                  width: "100%",
                  fontSize: "16px",
                  fontWeight: "bold",
                  borderRadius: "6px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                  backgroundColor: e?.bgColor ?? "#ff5711",
                }}
              >
                {parse(
                  e?.fieldName?.charAt(0).toUpperCase() + e?.fieldName?.slice(1)
                )}
              </button>
            </div>
          );
        } else if (e.elementType == "link") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              {e.fieldName && (
                <a href={e.linkUrl}>
                  <p
                    className="secondaryColor"
                    style={{
                      backgroundColor: "transparent",
                      color: "#0D3C84",
                      padding: "10px",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    {parse(e.fieldName)}
                  </p>
                </a>
              )}
            </div>
          );
        } else if (e.elementType == "location") {
          const lat = parseFloat(e.lat);
          const lng = parseFloat(e.lng);
          const zoom = parseFloat(e.zoomLevel);
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              {e.fieldName && <p> {parse(e.fieldName)}</p>}
              <iframe
                title={e.fieldName}
                src={`http://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
                height="80%"
                width="80%"
              ></iframe>
            </div>
          );
        } else if (e.elementType == "intellisheet") {
          return <RenderIntellisheetPreview e={e} />;
        } else if (e.elementType == "section") {
          return <RenderSection e={e} />;
        } else if (e.elementType == "list") {
          return <RenderList e={e} />;
        }
      }
    });
  }

  const onCloseModalOne = () => {
    props.closeModelOne(false);
    setRenderFormPreviewData(props.layout);
  };

  return (
    <div className="RenderFormPreview">
      <Modal
        open={props.openModelOne}
        onClose={onCloseModalOne}
        classNames={{
          overlay: "customOverlayFormPreview",
          modal: "customModalFormPreviews",
        }}
      >
        <div style={{ display: "flex", width: "100vw" }}>
          <div className="customScrollBar FormPreview BodyColor">
            <div
              // className={`FormPreviewContainer customScrollBar ${
              //   (previewModalstyle?.BackgroundColor || previewModalstyle?.backgroundImage)
              //   ? "" : "BodyColor"}`}
              className={`FormPreviewContainer customScrollBar ${
                previewModalstyle.backgroundColor ||
                previewModalstyle.backgroundImage
                  ? ""
                  : "BodyColor"
              }`}
              id="renderFormPreview-container"
              // style={{
              //   background: formProperty?.BackgroundColor,
              //   fontFamily: formProperty?.FontFamily
              // }}
              style={previewModalstyle}
            >
              {/* background: formProperty?.BackgroundColor, 
                to be applie in the above div an to be remoced 
                from below form
              */}
              <form
                className=""
                style={{
                  // background: formProperty?.BackgroundColor,
                  height: "100%",
                  width: "100%",
                  color: "#494c4fbd",
                }}
              >
                {renderFormElement(renderFormPreviewData)}
              </form>
            </div>
            <div className="groupBtnDiv BodyColor">
              {showDefaultSave == true && (
                <div className="RenderFormBtn">
                  <button
                    className="saveBtnForm primaryButtonColor"
                    id="renderFormPreview-defaultSave"
                  >
                    Save
                  </button>
                </div>
              )}
              {renderFormPreviewData.claim == true && (
                <div className="RenderFormBtn ">
                  <button
                    className="ClaimBtn secondaryButtonColor"
                    id="renderFormPreview-claim"
                  >
                    Claim
                  </button>
                </div>
              )}
            </div>
          </div>
          <PreviewFormRight
            taskFormDetail={taskFormDetail}
            currentFormOpen={currentFormOpen}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RenderFormPreview;
