import { React, useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Modal } from "react-responsive-modal";
import { Row, Col } from "react-bootstrap";
import QRCode from "react-qr-code";
import fileDownload from "js-file-download";
// import data from "./data.json";
// import RichTextEditor from "react-rte";
import { Rating } from "react-simple-star-rating";
import newData from "./newData.json";
import "bootstrap/dist/css/bootstrap.css";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import "./form.css";
import { useHistory } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import parse from "html-react-parser";
import SignaturePad from "react-signature-canvas";
import Table from "../../DataTable/Table";
import MathView, { MathViewRef } from "react-math-view";
import { stringify } from "json5";

const RenderForm = (prop) => {
  const history = useHistory();
  const Location = useLocation();
  if (Location.state) {
    var endpoint = Location.state.endpoint_label;
    // var path = Location.state.path;
    var path = Location.state.path;
    var appID = Location.state.id;
    if (Location.state.appName) {
      localStorage.setItem("appName", Location.state.appName);
    }
  }
  const [formData, setformData] = useState({});
  const [showCode, setShowCode] = useState(false);
  const [formLayout, setFormLayout] = useState([]);
  const [taskID, setTaskID] = useState("");
  const [appPath, setappPath] = useState("");
  const [datagridChanges, setdatagridChanges] = useState([]);

  const [myEmail, setMyEmail] = useState(localStorage.getItem("username"));
  const [myGroups, setMyGroups] = useState(
    JSON.parse(localStorage.getItem("groups"))
  );
  const [sigPad, setSigPad] = useState({});
  const keyboardRef = useRef();

  const accessibilityCode = {
    write: "writePermission",
    read: "readOnlyPermission",
    hide: "hidePermission",
    notApplicable: "notApplicable",
  };

  const formElementType = {
    label: "label",
    text: "text",
    number: "number",
    date: "date",
    dropdown: "dropdown",
    radio: "radio",
    rating: "rating",
    file: "file",
    image: "image",
    checkbox: "checkbox",
    qrcode: "qrcode",
    dataGrid: "dataGrid",
    esign: "esign",
    mathExp: "mathexp",
  };

  const onCloseModal = () => {
    setShowCode(false);
    history.push("/applications");
  };
  const captureValue = (elem, variable, prefix = "", suffix = "", e) => {
    var data = formData;

    // console.log("elem", elem);
    if (elem?.target?.checked) {
      data[variable] = elem.target.value;
    } else if (elem?.target?.value) {
      if (elem.target.value == "true") {
        elem.target.value = true;
      } else if (elem.target.value == "false") {
        elem.target.value = false;
      }

      // data[variable] = prefix + elem.target.value + suffix;
      // data[variable] = elem.target.value;
      if (prefix === null && suffix === null) {
        data[variable] = elem.target.value;
      } else if (prefix === null && suffix !== null) {
        data[variable] = elem.target.value + suffix;
      } else if (prefix !== null && suffix === null) {
        data[variable] = prefix + elem.target.value;
      } else if (prefix !== null && suffix !== null) {
        data[variable] = prefix + elem.target.value + null;
      }
    } else if (!isNaN(elem)) {
      data[variable] = elem;
    } else if (elem?.value || elem?.map((e) => e.value)) {
      data[variable] = elem;
    }
    if (elem?.target?.files != null) {
      // console.log("data", data);
      data[variable] = elem.target.files[0];
    }

    // console.log(elem.target.value);

    setformData(data);
  };

  // CDS implementation starts

  const fileUploader = async (item) => {
    const appName = localStorage.getItem("appName");

    var bodyFormData = new FormData();
    bodyFormData.append("file", item);

    const response = await axios.post(
      `${
        process.env.REACT_APP_CDS_ENDPOINT + appName
      }/upload?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`,
      bodyFormData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response;
  };

  const filesUploaderHelper = async () => {
    for (const key in formData) {
      // console.log(`looping ${key}: ${formData[key]}`);

      if (
        typeof formData[key] == "object" &&
        !Array.isArray(formData[key]) &&
        formData[key] != null
      ) {
        // console.log(`if looping ${key}: ${typeof formData[key]}`);
        const data = await fileUploader(formData[key]);

        // console.log("dataallfileupload", data.data.file.filename);
        formData[key] = `${process.env.REACT_APP_CDS_ENDPOINT}${
          data.data.file.bucketName
        }/image/${data.data.file.filename}?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`;
      }
    }
  };

  const handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const eSignatureUploadHelper = async () => {
    let arrayOfFormdataKeys = Object.keys(formData);
    let eSignElements = formLayout.formData.filter(
      (item) =>
        item.elementType === "esign" &&
        !arrayOfFormdataKeys.includes(item.processVariableName)
    );
    let temp = {
      ...formData,
    };
    if (eSignElements) {
      eSignElements.map((element) => {
        const signData = sigPad.getTrimmedCanvas().toDataURL("image/png");
        var file = dataURLtoFile(signData, element.filename ?? "signature.txt");

        temp = {
          ...temp,
          [element.processVariableName]: file,
        };
      });
    }
    await filesUploaderHelper(temp);
  };

  const submitForm = async (e) => {
    await eSignatureUploadHelper();

    if (datagridChanges.length > 0) {
      for (let index = 0; index < datagridChanges.length; index++) {
        var element = datagridChanges[index];
        var DatatobePushed = element.data;
        if (DatatobePushed) {
          delete DatatobePushed._id;
        }
        if (element.type == "update") {
          var getDataGridDataAPI = await axios.patch(
            process.env.REACT_APP_DATA_ENDPOINT +
              "/query/" +
              localStorage.getItem("workspace") +
              "/" +
              localStorage.getItem("appName") +
              "/" +
              element.model +
              '("' +
              element.id +
              '")',
            element.data
          );
        } else if (element.type == "insert") {
          var getDataGridDataAPI = await axios.post(
            process.env.REACT_APP_DATA_ENDPOINT +
              "/query/" +
              localStorage.getItem("workspace") +
              "/" +
              localStorage.getItem("appName") +
              "/" +
              element.model,
            element.data
          );
        } else if (element.type == "Delete") {
          var getDataGridDataAPI = await axios.delete(
            process.env.REACT_APP_DATA_ENDPOINT +
              "/query/" +
              localStorage.getItem("workspace") +
              "/" +
              localStorage.getItem("appName") +
              "/" +
              element.model +
              '("' +
              element.id +
              '")'
          );
        }
      }
      setdatagridChanges([]);
    }
    var pathURL =
      process.env.REACT_APP_IFAPP_API_ENDPOINT +
      "q/" +
      localStorage.getItem("workspace") +
      "/" +
      localStorage.getItem("appName") +
      "/" +
      path +
      "?user=" +
      localStorage.getItem("username") +
      "&actionCategory=process";
    if (taskID != "") {
      pathURL =
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
        "q/" +
        localStorage.getItem("workspace") +
        "/" +
        localStorage.getItem("appName") +
        "/" +
        path +
        "/" +
        appID.id +
        "/" +
        appPath +
        "/" +
        taskID +
        "?user=" +
        localStorage.getItem("username") +
        "&actionCategory=task";
    }
    axios
      .post(pathURL, formData)
      .then((r) => {
        setShowCode(true);

        setFormLayout(JSON.parse(r.data.data.data));
      })
      .catch((e) => {
        console.log("error", e);
      });
  };
  useEffect(async () => {
    var type = "PT";
    if (appID) {
      if (Location.state.appName) {
        var getProcessData = await axios.get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "q/" +
            localStorage.getItem("workspace") +
            "/" +
            localStorage.getItem("appName") +
            "/" +
            path,
          { headers: { "Content-Type": "application/json" } }
        );
        var processes = getProcessData.data;
        let internalData = processes.filter((x) => x.id == appID.id)[0];
        if (internalData) {
          setformData(internalData);
        }
      } else {
        setformData(appID);
      }
      var getData = await axios.get(
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
          "q/" +
          localStorage.getItem("workspace") +
          "/" +
          localStorage.getItem("appName") +
          "/" +
          path +
          "/" +
          appID.id +
          "/tasks?user=" +
          localStorage.getItem("username"),
        { headers: { "Content-Type": "application/json" } }
      );
      // console.log("getData - 329", getData);
      // console.log("appid exists", getData?.data[0]?.name);
      // console.log(
      //   "URL - 331",
      //   process.env.REACT_APP_IFAPP_API_ENDPOINT +
      //     "q/" +
      //     localStorage.getItem("workspace")+
      //     "/" +
      //     localStorage.getItem("appName") +
      //     "/" +
      //     path +
      //     "/" +
      //     appID.id +
      //     "/tasks?user=" +
      //     localStorage.getItem("username")
      // );
      setTaskID(getData?.data[0]?.id);
      path = getData?.data[0]?.name;
      type = "UT";
      setappPath(path);
    }

    // console.log("path - 336", path);

    axios
      .get(
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
          "q/" +
          localStorage.getItem("workspace") +
          "/" +
          localStorage.getItem("appName") +
          "/service/form/content/" +
          path
      )
      .then((r) => {
        if (r.data) setFormLayout(JSON.parse(JSON.stringify(r.data)));
      })
      .catch((e) => {
        console.log("error", e);
      });
  }, [0]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const [isShown, setIsShown] = useState("");

  const handleInfo = (e) => {
    setIsShown(e);
  };

  const clear = () => {
    sigPad.clear();
  };

  const userAccessibility = (accessibilityData) => {
    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < accessibilityData.hideUsers.length; i++) {
      let tempUsername = accessibilityData.hideUsers[i].username;
      if (tempUsername === myEmail) {
        hasHideAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.readUsers.length; i++) {
      let tempUsername = accessibilityData.readUsers[i].username;
      if (tempUsername === myEmail) {
        hasReadAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.writeUsers.length; i++) {
      let tempUsername = accessibilityData.writeUsers[i].username;
      if (tempUsername === myEmail) {
        hasWriteAccess = true;
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.write;
  };

  const groupAccessibility = (accessibilityData) => {
    let tempMyGroups = myGroups.map((group) => {
      return group.name;
    });

    if (tempMyGroups.length == 0) {
      return accessibilityCode.notApplicable;
    }

    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < tempMyGroups.length; i++) {
      for (let j = 0; j < accessibilityData.hideGroups.length; j++) {
        let tempGroupname = accessibilityData.hideGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasHideAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.readGroups.length; j++) {
        let tempGroupname = accessibilityData.readGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasReadAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.writeGroups.length; j++) {
        let tempGroupname = accessibilityData.writeGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasWriteAccess = true;
        }
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.notApplicable;
  };

  function renderFormElement() {
    var forlayoutData = formLayout.formData ? formLayout.formData : formLayout;

    return forlayoutData?.map((e, index) => {
      const userPreviledges = userAccessibility(e.accessibility);
      const adminPreviledges = groupAccessibility(e.accessibility);

      let disabledStatus = true;

      if (adminPreviledges == accessibilityCode.notApplicable) {
        if (userPreviledges === accessibilityCode.write) {
          disabledStatus = false;
        } else if (userPreviledges == accessibilityCode.read) {
          disabledStatus = true;
        }
        if (userPreviledges === accessibilityCode.hide) {
        } else {
          return <>{renderAllElements(e, disabledStatus)}</>;
        }
      } else {
        if (
          userPreviledges === accessibilityCode.write ||
          adminPreviledges === accessibilityCode.write
        ) {
          disabledStatus = false;
        } else if (
          userPreviledges === accessibilityCode.read &&
          adminPreviledges === accessibilityCode.read
        ) {
          disabledStatus = true;
        }
        if (
          userPreviledges === accessibilityCode.hide &&
          adminPreviledges === accessibilityCode.hide
        ) {
        } else {
          return <>{renderAllElements(e, disabledStatus)}</>;
        }
      }
    });
  }
  // console.log("formData - 507", formData);

  useEffect(() => {
    if (path == undefined) {
      history.push("/Dashboard");
    }
    // console.log("path - 512", path);
  }, [path]);

  var datadata = formData;
  const handleClick = (option, limit, processVariableName) => {
    if (datadata[processVariableName] == null) {
      datadata[processVariableName] = [];
    }
    if (datadata[processVariableName].length < limit) {
      if (datadata[processVariableName].includes(option.id)) {
        datadata[processVariableName] = datadata[processVariableName].filter(
          (item) => item !== option.id
        );
      } else {
        let tempArray = [...datadata[processVariableName]];
        tempArray.push(option.id);
        datadata[processVariableName] = [...tempArray];
      }
    } else {
      if (datadata[processVariableName].includes(option.id)) {
        datadata[processVariableName] = datadata[processVariableName].filter(
          (item) => item !== option.id
        );
      } else {
        let tempArray = [...datadata[processVariableName]];
        tempArray.shift();
        tempArray.push(option.id);
        datadata[processVariableName] = [...tempArray];
      }
    }
  };

  const renderAllElements = (e, disabledStatus) => {
    switch (e.elementType) {
      case "label":
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
              textAlign: "center",
            }}
          >
            {e.fieldName && <p> {parse(e.fieldName)}</p>}
          </div>
        );
        break;

      case formElementType.text:
        if (e.fieldType == "email") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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
                id="renderFormTest-fileType"
                type={e.fieldType}
                className={
                  (errors[e.processVariableName] ? "is-invalid" : "",
                  "inputStyle")
                }
                placeholder={e.placeholder}
                disabled={disabledStatus}
                // name={e.processVariableName}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                data-tip
                data-for={e.processVariableName}
                value={formData[e.processVariableName]}
                // defaultValue={formData[e.processVariableName]}
                {...register(e.processVariableName, {
                  required: JSON.parse(e.required),
                })}
                onChange={(elem) => {
                  captureValue(elem, e.processVariableName, e.prefix, e.suffix);
                }}
                // value={formData[e.processVariableName]}
              />
              <ReactTooltip
                id={e.processVariableName}
                place="top"
                effect="solid"
              >
                {e.toolTip}
              </ReactTooltip>
            </div>
          );
        } else if (e.fieldType == "mathExp") {
          let arrayOfFormdataKeys = Object.keys(formData);
          let exist = arrayOfFormdataKeys.includes(e.processVariableName);

          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
                {String(e.required) == "true" ? (
                  <spam style={{ color: "red" }}>*</spam>
                ) : (
                  // <spam style={{ color: "red" }}>*</spam>
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
              {exist ? (
                <div className="disabled">
                  <MathView value={formData[e.processVariableName]} />
                </div>
              ) : (
                <div className={disabledStatus ? "disabled" : ""}>
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
                    id="renderFormTest-mathView"
                  />
                </div>
              )}
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
        } else if (e.fieldType == null || e.fieldType == "text") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
                {String(e.required) == "true" ? (
                  <spam style={{ color: "red" }}>*</spam>
                ) : (
                  // <spam style={{ color: "red" }}>*</spam>
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
                    {e.patternValidationEnabled &&
                    formData[e.processVariableName] &&
                    formData[e.processVariableName] !== "" ? (
                      <b>Invalid {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}</b>
                    ) : (
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    )}
                  </small>
                )}
              </label>

              <input
                id="renderFormTest-elementType"
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
                // defaultValue={formData[e.processVariableName]}
                {...register(e.processVariableName, {
                  required: JSON.parse(e.required),
                  pattern:
                    e.patternValidationEnabled && !e.patternCaseSensitivity
                      ? new RegExp(e.pattern, "i")
                      : e.patternValidationEnabled
                      ? new RegExp(e.pattern)
                      : new RegExp(),
                })}
                onChange={(elem) => {
                  captureValue(
                    elem,
                    e.processVariableName,
                    e.prefix,
                    e.suffix,
                    e
                  );
                }}
              />
              {e.toolTip && e.toolTip != "" && (
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

      case formElementType.number:
        return (
          <div
            className={"form-group"}
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {parse(e.fieldName)}
              {String(e.required) == "true" && (
                <spam style={{ color: "red" }}>*</spam>
              )}
              {errors[e.processVariableName] && (
                <span class="badge secondaryColor" style={{ color: "red", cursor: "pointer" }}>
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
              // defaultValue={formData[e.processVariableName]}
              {...register(e.processVariableName, {
                required: JSON.parse(e.required),
              })}
              onChange={(elem) => {
                captureValue(elem, e.processVariableName, e.prefix, e.suffix);
              }}
            />
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          </div>
        );

      case formElementType.date:
        let minDate = e.dateRangeStart.split("T");
        let maxDate = e.dateRangeEnd.split("T");
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {parse(e.fieldName)}
              {String(e.required) == "true" && (
                <spam style={{ color: "red" }}>*</spam>
              )}
              {errors[e.processVariableName] && (
                <span class="badge secondaryColor" style={{ color: "red", cursor: "pointer" }}>
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
              min={minDate[0]}
              max={maxDate[0]}
              value={formData[e.processVariableName]}
              // defaultValue={formData[e.processVariableName]}
              {...register(e.processVariableName, {
                required: JSON.parse(e.required),
              })}
              onChange={(elem) => {
                captureValue(elem, e.processVariableName, e.prefix, e.suffix);
              }}
            />
          </div>
        );

      case formElementType.dropdown:
        if (e.multiSelect == false || e.multiSelect == null) {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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
              {/* <div
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <Select
                  className="inputStyleSelect"
                  style={{
                    background: "white",
                  }}
                  value={formData[e.processVariableName]}
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
              </div> */}
              <select
                className={
                  (errors[e.processVariableName] ? "is-invalid" : "",
                  "inputStyle")
                }
                value={formData[e.processVariableName]}
                // defaultValue={formData[e.processVariableName]}
                {...register(e.processVariableName, {
                  required: JSON.parse(e.required),
                })}
                onChange={(elem) => {
                  captureValue(elem, e.processVariableName, e.prefix, e.suffix);
                }}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                id="renderFormTest-processName"
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
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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

              {/* <Controller
                name={e.processVariableName}
                control={control}
                render={({ onChange, value, ref }) => ( */}
              <div
                style={{
                  height: "100%",
                  width: "100%",
                }}
              >
                <Controller
                  control={control}
                  // defaultValue={formData[e.processVariableName]}
                  name={e.processVariableName}
                  rules={{ required: JSON.parse(e.required) }}
                  render={({ field }) => {
                    const { onChange } = field;
                    return (
                      <Select
                        id="renderFormTest-selectProcessName"
                        name={e.processVariableName}
                        className="inputStyleSelect"
                        style={{
                          background: "white",
                        }}
                        onChange={(elem) =>
                          onChange(() =>
                            captureValue(
                              elem,
                              e.processVariableName,
                              e.prefix,
                              e.suffix
                            )
                          )
                        }
                        value={formData[e.processVariableName]}
                        options={e.choices}
                        isMulti={e.multiSelect}
                      />
                    );
                  }}
                />
              </div>
              {/* )}
              /> */}
            </div>
          );
        }

      case formElementType.radio:
        return (
          <div
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <div>
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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
                      Select your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
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
                    e.VAxis == "true"
                      ? " form-check "
                      : " form-check form-check-inline"
                  }
                >
                  <input
                    className={
                      ("form-check-input",
                      errors[e.processVariableName] ? "is-invalid" : "")
                    }
                    type="radio"
                    name={option.key}
                    id={e.id}
                    value={option.key}
                    defaultChecked={
                      formData[e.processVariableName] == option.key
                    }
                    // value={formData[e.processVariableName]}
                    // defaultValue={formData[e.processVariableName]}
                    {...register(e.processVariableName, {
                      required: JSON.parse(e.required),
                    })}
                    onChange={(elem) => {
                      captureValue(
                        elem,
                        e.processVariableName,
                        e.prefix,
                        e.suffix
                      );
                    }}
                  />
                  <label className="form-check-label secondaryColor">{option.choice}</label>
                </div>
              );
            })}
          </div>
        );

      case formElementType.rating:
        if (e.ratingType == "slider") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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
                id="renderFormTest-captureValue"
                type={"range"}
                min="0"
                max={e.ratingScale}
                className="form-control-range"
                style={{
                  height: "100%",
                  width: "100%",
                }}
                value={formData[e.processVariableName]}
                // defaultValue={formData[e.processVariableName]}
                {...register(e.processVariableName, {
                  required: JSON.parse(e.required),
                })}
                onChange={(elem) => {
                  captureValue(elem, e.processVariableName, e.prefix, e.suffix);
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
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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

              <Controller
                control={control}
                name={e.processVariableName}
                rules={{ required: JSON.parse(e.required) }}
                render={({ field }) => {
                  const { onChange, value } = field;
                  // console.log(
                  //   "formData[e.processVariableName] * 10",
                  //   formData[e.processVariableName] * 20
                  // );
                  return (
                    <Rating
                      id="renderFormTest-rating"
                      allowHalfIcon
                      transition
                      iconsCount={e.ratingScale}
                      onClick={(elem) => {
                        onChange(() =>
                          captureValue(
                            elem,
                            e.processVariableName,
                            e.prefix,
                            e.suffix
                          )
                        );
                        // )
                      }}
                      initialValue={Number(formData[e.processVariableName])}
                      // ratingValue={Number(formData[e.processVariableName] * 20)}
                    />
                  );
                }}
              />
            </div>
          );
        }

      case formElementType.file:
        // console.log("filetype", e.allowedFileTypes);

        var allowedFileTypes;

        if (e.allowedFileTypes && e.allowedFileTypes.length == 0) {
          let allowedFileTypesArr = e.allowedFileTypes.map((type) => {
            return `.${type}`;
          });
          allowedFileTypes = allowedFileTypesArr.toString();
        } else {
          allowedFileTypes =
            "file_extension|audio/*|video/*|image/*|media_type";
        }

        // console.log("allowedtypes", allowedFileTypes);

        const determineFileErrors = (elem, e) => {
          //middleware for fileupload Dyanamic errors, currently its dummy

          captureValue(elem, e.processVariableName, e.prefix, e.suffix);
        };
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {parse(e.fieldName)}
              {String(e.required) == "true" && (
                <spam style={{ color: "red" }}>*</spam>
              )}
              {errors[e.processVariableName] && (
                <span class="badge secondaryColor" style={{ color: "red", cursor: "pointer" }}>
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
            <label class="custom-file-upload secondaryColor">
              <input
                type={e.elementType}
                accept={allowedFileTypes}
                className={
                  ("form-control-file",
                  errors[e.processVariableName] ? "is-invalid" : "")
                }
                id={e.id}
                style={{
                  height: "100%",
                  width: "100%",
                }}
                // value={formData[e.processVariableName]}
                // defaultValue={formData[e.processVariableName]}
                {...register(e.processVariableName, {
                  required: JSON.parse(e.required),
                })}
                onChange={(elem) => {
                  determineFileErrors(elem, e);
                }}
              />
              {formData[e.processVariableName] ? (
                <span className="secondaryColor" style={{ display: "flex", alignItems: "center" }}>
                  File Uploaded Successfully{" "}
                  <button
                    style={{
                      color: "rgba(17, 169, 255, 0.5)",
                      background: "transparent",
                    }}
                    id="renderFormTest-uploadSucessfully"
                  >
                    <Icon
                      onClick={() =>
                        handleDownload(
                          formData[e.processVariableName],
                          formData[e.processVariableName]
                            ?.split("/")
                            .pop()
                            .split("#")[0]
                            .split("?")[0]
                        )
                      }
                      style={{
                        marginLeft: "10px",
                        cursor: "pointer",
                        height: "20px",
                        width: "20px",
                      }}
                      icon="el:download"
                      id="renderFormTest-downloadIcon"
                    />
                  </button>
                </span>
              ) : (
                "Drag & Drop to upload"
              )}
            </label>
          </div>
        );

      case formElementType.image:
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {parse(e.fieldName)}
              {/* {String(e.required) == "true" && (
                <spam style={{ color: "red" }}>*</spam>
              )} */}
              {/* {errors[e.processVariableName] && (
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
              )} */}
              {/* {isShown == e.id && (
                <small className="requiredTextColor">
                  <b>
                    Please enter your{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                  </b>
                </small>
              )} */}
            </label>
            {/* <input
              type="file"
              accept="image/*"
              className={
                ("form-control-file",
                errors[e.processVariableName] ? "is-invalid" : "")
              }
              // required={e.required}
              style={{
                height: "100%",
                width: "100%",
              }}
              value={formData[e.processVariableName]}
              // defaultValue={formData[e.processVariableName]}
              {...register(e.processVariableName, {
                required: JSON.parse(e.required),
              })}
              onChange={(elem) => {
                captureValue(elem, e.processVariableName, e.prefix, e.suffix);
              }}
            /> */}

            <img
              src={
                process.env.REACT_APP_CDS_ENDPOINT +
                e.imageUrl +
                `?Authorization=${localStorage.getItem(
                  "token"
                )}&workspace=${localStorage.getItem("workspace")}`
              }
              style={{ height: "100%", width: "100%" }}
              alt=""
            />
          </div>
        );

      case formElementType.checkbox:
        return (
          <div
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <div>
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
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
                >
                  {/* <input
                    className={
                      ("form-check-input",
                      errors[e.processVariableName] ? "is-invalid" : "")
                    }
                    type="checkbox"
                    // name={option.key}
                    value={option.choice}
                    // value={formData[e.processVariableName]}
                    // defaultValue={formData[e.processVariableName]}
                    defaultChecked={
                      formData[e.processVariableName] == option.choice
                    }
                    {...register(e.processVariableName, {
                      required: JSON.parse(e.required),
                    })}
                    onChange={(elem) => {
                      captureValue(
                        elem,
                        e.processVariableName,
                        e.prefix,
                        e.suffix
                      );
                    }}
                  /> */}
                  <input
                    id={option.id}
                    key={option.id}
                    type="checkbox"
                    onChange={() =>
                      handleClick(option, e.maxChoices, e.processVariableName)
                    }
                    checked={formData[e.processVariableName]?.includes(
                      option.id
                    )}
                  />
                  <label className="form-check-label secondaryColor">{option.choice}</label>
                </div>
              );
            })}
          </div>
        );

      case formElementType.qrcode:
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <div>
              <label className="fieldLable secondaryColor">
                {parse(e.fieldName)}
                {/* {String(e.required) == "true" ? (
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
                )} */}
              </label>
            </div>

            <QRCode
              style={{ height: "100%", width: "auto" }}
              value={e.fieldName}
              viewBox={`0 0 256 256`}
            />
          </div>
        );

      case formElementType.dataGrid:
        // console.log("datagrid");
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
            }}
          >
            <Table
              dataGridProperties={e.dataGridProperties}
              datagridChanges={datagridChanges}
              setdatagridChanges={setdatagridChanges}
              fieldName={e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
              accessibilityprop={e.accessibility}
              gridColumns={e.dataGridProperties.cols}
            />
          </div>
        );

      case formElementType.esign:
        let arrayOfFormdataKeys = Object.keys(formData);
        if (arrayOfFormdataKeys.includes(e.processVariableName)) {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 12) * 100}%`,
                top: `${(e.y / 10) * 100}%`,
                height: `${(e.h / 10) * 100}%`,
                width: `${(e.w / 12) * 100}%`,
              }}
            >
              <img
                src={formData[e.processVariableName]}
                alt="This signature has been captured"
                style={{
                  border: "1px solid black",
                  width: e.eSignatureProperties.width ?? 200,
                  height: e.eSignatureProperties.height ?? 200,
                }}
              />
            </div>
          );
        }
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
            }}
          >
            <SignaturePad
              canvasProps={{
                className: "sigPad",
                width: e.eSignatureProperties.width ?? 200,
                height: e.eSignatureProperties.height ?? 200,
              }}
              ref={(ref) => {
                setSigPad(ref);
              }}
              penColor={e.eSignatureProperties.penColor}
            />
            <button
              className="clear-button btn"
              // style={{ left: e.e.eSignatureProperties.width ?? 200 }}
              onClick={clear}
              id="renderFormTest-clear-btn"
            >
              X
            </button>
          </div>
        );

      case formElementType.mathExp:
        return (
          <div
            className="form-group disabled"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 12) * 100}%`,
              top: `${(e.y / 10) * 100}%`,
              height: `${(e.h / 10) * 100}%`,
              width: `${(e.w / 12) * 100}%`,
              textAlign: "center",
            }}
          >
            <MathView value={e.fieldName} />
          </div>
        );

      default:
        break;
    }
  };
  return (
    <>
      <div className="RenderFormTest-Body">
        <div className="container RenderFormTest-Content">
          {/* <h3>{endpoint}</h3> */}

          {renderFormElement()}
          {/* <div
            style={{
              marginLeft: "43%",
              // marginTop: "30px",
              top: "64vh",
              width: "auto",
              position: "absolute",
            }}
          >
            <button type="submit">Submit</button>
          </div> */}
          {/* <div className="groupBtnDiv">
            <div>
              <button className="AbortBtn">Abort</button>
              <button className="ReleaseBtn">Release</button>
            </div>
            <div>
              <button className="ClaimBtn">Claim</button> 
              <button className="CompleteBtn">Complete</button>
            </div>
          </div> */}
          <div className="groupBtnDiv">
            <div className="RenderFormBtn">
              <button
                onClick={handleSubmit(submitForm)}
                className="saveBtnForm primaryButtonColor"
                id="renderFormTest-saveForm"
              >
                Save
              </button>
            </div>
            {formLayout.claim == true && (
              <div className="RenderFormBtn">
                <button className="ClaimBtn secondaryButtonColor" id="renderFormTest-claim">
                  Claim
                </button>
              </div>
            )}
          </div>
          {/* <div
            style={{
              marginLeft: "35%",
              // marginTop: "30px",
              top: "68vh",
              width: "38%",
              position: "absolute",
            }}
            className="saveBtn"
          >
            <button onClick={handleSubmit(submitForm)} className="btn saveBtn">
              Save
            </button>
          </div> */}
        </div>
      </div>
      <Modal open={showCode} onClose={onCloseModal} center>
        <Row>
          <div class="thank-you-pop">
            <img
              src="http://goactionstations.co.uk/wp-content/uploads/2017/03/Green-Round-Tick.png"
              alt=""
            />
            <h1>{endpoint}</h1>
            <p>Application submitted successfully</p>
          </div>
        </Row>
      </Modal>
    </>
  );
};

export default RenderForm;
