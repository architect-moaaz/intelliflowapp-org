import React, { useState } from "react";
import { Modal } from "react-responsive-modal";
import QRCode from "react-qr-code";
import { Rating } from "react-simple-star-rating";
import "bootstrap/dist/css/bootstrap.css";
import ReactTooltip from "react-tooltip";
import "../IFApp/Form/formPreview.css";
import { Icon } from "@iconify/react";
import Select from "react-select";
import parse from "html-react-parser";
import { useForm, Controller } from "react-hook-form";
import Table from "../DataTable/Table";
// import PreviewFormRight from "./PreviewFormRight";
import SignaturePad from "react-signature-canvas";
import Intellisheet from "../Intellisheet/Intellisheet";
import MathView, { MathViewRef } from "react-math-view";
import "./RenderLoginPage.css";
import PreviewFormRight from "./PreviewFormRight";

const LoginFormPreview = (props) => {
  const [formData, setformData] = useState({});
  const [isShown, setIsShown] = useState("");
  const [myEmail, setMyEmail] = useState(localStorage.getItem("username"));
  const [myGroup, setMyGroup] = useState("anime");
  const [datagridChanges, setdatagridChanges] = useState([]);
  const [renderFormPreviewData, setRenderFormPreviewData] = useState(
    props.layout
  );
  const [value, setValue] = useState("");

  var showDefaultSave = true;

  const handleInfo = (e) => {
    setIsShown(e);
  };

  const taskFormDetail = (e) => {
    setRenderFormPreviewData(e.formData);
  };

  const currentFormOpen = (e) => {
    setRenderFormPreviewData(props.layout);

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
              <p>{e.fieldName && parse(e.fieldName)}</p>
            </div>
          );
        } else if (e.elementType == "text") {
          if (e.fieldType == "Email") {
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
                    <span style={{ color: "red" }}>*</span>
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
          } else if (e.fieldType == "Password") {
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
              <label className="fieldLable">
                {e.fieldName && parse(e.fieldName)}
                {String(e.required) == "true" && (
                  <spam style={{ color: "red" }}>*</spam>
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
                {e.fieldName &&
                  typeof e.fieldName === "string" &&
                  parse(
                    e?.fieldName?.charAt(0).toUpperCase() +
                      e?.fieldName?.slice(1)
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
                <a>
                  <p
                    style={{
                      color: "#0D3C84",
                    }}
                  >
                    {parse(e.fieldName)}
                  </p>
                </a>
              )}
            </div>
          );
        } else if (e.elementType == "image") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                marginTop:"0px",
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
        }
      }
    });
  }

  const onCloseModalOne = () => {
    props.closeModelOne(false);
    setRenderFormPreviewData(props.layout);
  };

  return (
    <div className="RenderFormPreview loginPreview">
      <Modal
        open={props.openModelOne}
        onClose={onCloseModalOne}
        classNames={{
          overlay: "customOverlayFormPreview",
          modal: "customModalFormPreviews",
        }}
      >
        <div style={{ display: "flex", width: "100vw" }}>
          <div className="customScrollBar FormPreview">
            <div
              className="login-FormPreviewContainer customScrollBar"
              id="renderFormPreview-container"
            >
              <form className="" style={{ color: "#494c4fbd" }}>
                {renderFormElement(renderFormPreviewData)}
              </form>
            </div>
          </div>
          <PreviewFormRight currentFormOpen={currentFormOpen} />
        </div>
      </Modal>
    </div>
  );
};

export default LoginFormPreview;
