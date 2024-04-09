import "bootstrap/dist/css/bootstrap.css";
import { React, useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import MathView, { MathViewRef } from "react-math-view";
import { selector, useRecoilValue } from "recoil";
import "./form.css";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-datepicker";
import CommonModelContainer from "../../CommonModel/CommonModelContainer";
import RenderList from "./formComponent/RenderList";
import RenderNumberInput from "./formComponent/RenderNumberInput";
import RenderTextInput from "./formComponent/RenderTextInput";
// import data from "./data.json";
// import RichTextEditor from "react-rte";
import { Icon } from "@iconify/react";
import axios from "axios";
import parse from "html-react-parser";
import fileDownload from "js-file-download";
import { async } from "q";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";
import { Modal } from "react-responsive-modal";
import { useHistory, useLocation } from "react-router-dom";
import Select from "react-select";
import SignaturePad from "react-signature-canvas";
import { Rating } from "react-simple-star-rating";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../state/atom";
import Table from "../../DataTable/Table";
import Intellisheetv2 from "../../Intellisheet/Intellisheetv2";
// import Intellisheet from "./../../Intellisheet/Intellisheet";
// import newData from "./newData.json";

const RenderForm = () => {
  const history = useHistory();
  const Location = useLocation();
  var dot = require("dot-object");
  var appID = null;

  if (Location.state) {
    var endpoint = Location.state.endpoint_label;
    var path = Location.state.path;
    appID = Location.state.id;
    if (Location.state.appName) {
      localStorage.setItem("appName", Location.state.appName);
    }
  }
  const [t, i18n] = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const [formData, setformData] = useState({});
  const [showCode, setShowCode] = useState(false);
  var showDefaultSave = true;
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
  const [loading, setLoading] = useState(false);
  const [secondAppID, setSecondAppID] = useState(null);
  const [isShown, setIsShown] = useState("");
  const [firstRender, setFirstRender] = useState(true);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [formulas, setformulas] = useState([]);
  const [formulainputs, setformulainputs] = useState([]);
  const [processDataVariables, setProcessDataVariables] = useState("");
  const [intellisheetData, setIntellisheetData] = useState({});

  const [currentElement, setCurrentElement] = useState("");
  const [onLoadVariables, setOnLoadVariables] = useState([]);
  const [customLoader, setCustomLoader] = useState({});

  const handleClose = () => {
    setIsOpen(false);
  };

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
    button: "button",
    link: "link",
    location: "location",
    intellisheet: "intellisheet",
    section: "section",
    list: "list",
  };

  useEffect(() => {
    const formulaLayout = formLayout?.formData
      ?.filter(
        (item) =>
          item?.formula !== null &&
          item?.formula !== undefined &&
          item?.formula !== ""
      )
      ?.map((e) => e?.formula)
      ?.flat(Infinity);

    const pattern = /@(\w+)/g;
    const output = formulaLayout?.map((obj) => {
      const newFormula = obj?.formula?.replace(
        pattern,
        (match, group) => group
      );
      const newInput = obj?.input?.map((str) =>
        str?.replace(pattern, (match, group) => group)
      );
      return {
        ...obj,
        formula: newFormula,
        input: newInput,
      };
    });
    setformulas(output);
  }, [formLayout]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleInfo = (e) => {
    setIsShown(e);
  };

  const clear = () => {
    sigPad.clear();
  };

  useEffect(() => {
    loadForm(appID);
  }, []);

  useEffect(() => {
    loadForm(Location?.state?.id, null, true);
  }, [Location]);

  useEffect(() => {
    if (path == undefined) {
      history.push("/Dashboard");
    }
  }, [path]);

  async function onLoadData(receivedData) {
    let filter = { ...receivedData?.formProperties?.filter };
    let model = "";
    let mapConditions = [];
    if (Object.keys(receivedData?.formProperties).length) {
      model = receivedData?.formProperties?.selectedDataModal;
      mapConditions = [...receivedData?.formProperties?.mapDataConditions];
    }
    let tempFormLayout = [...receivedData?.formData];
    let tempFormData = {};
    let tempOnloadVariables = [];

    mapConditions?.map((item) => {
      tempOnloadVariables = [...tempOnloadVariables, item.operand1];
    });

    tempFormLayout.map((item) => {
      if (item?.formula?.length) {
        tempOnloadVariables = [
          ...tempOnloadVariables,
          item.processVariableName,
        ];
      }
    });

    setOnLoadVariables([...tempOnloadVariables]);

    if (filter.operand1 && model && mapConditions) {
      var getDataGridDataAPI = await getOdataFilteredValues(
        [
          {
            field: filter?.operand1,
            operator: "=",
            value: filter?.operand2,
            useSession: true,
            useProcessVariable: false,
          },
        ],
        model
      );

      mapConditions?.map((condition) => {
        tempFormData = {
          ...tempFormData,
          [condition?.operand1]: getDataGridDataAPI[0]?.[condition?.operand2],
        };
      });

      setformData((prev) => {
        return {
          ...prev,
          ...tempFormData,
        };
      });
    }
  }

  useEffect(() => {
    if (onLoadVariables?.length) {
      firstCalculationOnLoad();
    }
  }, [formData]);

  function firstCalculationOnLoad() {
    let data = { ...formData };
    let needCalculation = false;

    if (Object.keys(formulainputs).length > 0)
      if (Object.keys(data).length > 0) {
        Object.keys(data).map((key) => {
          formulainputs.map((input) => {
            if (key === input) {
              needCalculation = true;
            }
          });
        });
        if (needCalculation) calculateFormula(data);

        setOnLoadVariables([]);
      }
  }

  async function loadForm(receivedId, givenAppName, locationChanged) {
    var appName = givenAppName ?? localStorage.getItem("appName");
    var type = "PT";

    if (formData) setformData({});
    if (locationChanged) setLoading(true);

    if (receivedId) {
      if (appName) {
        var getProcessData = await axios.get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "q/" +
            localStorage.getItem("workspace") +
            "/" +
            appName +
            "/" +
            path,
          { headers: { "Content-Type": "application/json" } }
        );

        let internalData = getProcessData.data.filter(
          (x) => x.id == receivedId
        )[0];

        if (internalData) {
          formDataHelper(internalData);
        }
      } else {
        formDataHelper(receivedId);
      }

      await axios
        .get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "q/" +
            localStorage.getItem("workspace") +
            "/" +
            appName +
            "/" +
            path +
            "/" +
            receivedId +
            "/tasks?user=" +
            localStorage.getItem("username"),
          { headers: { "Content-Type": "application/json" } }
        )
        .then(async (res) => {
          if (res.status === 404) {
            setLoading(false);
            setShowCode(true);
          } else {
            setTaskID(res?.data[0]?.id);
            path = res?.data[0]?.name;
            type = "UT";
            setappPath(path);
            if (!firstRender) {
              if (res.data[0]?.id) {
                await axios
                  .get(
                    process.env.REACT_APP_IFAPP_API_ENDPOINT +
                      "q/" +
                      localStorage.getItem("workspace") +
                      "/" +
                      appName +
                      "/service/form/content/" +
                      path
                  )
                  .then((r) => {
                    if (r.data) {
                      setFormLayout(
                        checkSaveButtonInForm(
                          JSON.parse(JSON.stringify(r.data))
                        )
                      );
                      setCustomLoader({
                        ...r?.data?.formProperties?.customLoader,
                      });
                      onLoadData(JSON.parse(JSON.stringify(r.data)));
                      assignProcessInputVariableValue(
                        JSON.parse(JSON.stringify(r.data.formData))
                      );
                    }
                  })
                  .catch((e) => {
                    console.error("error", e);
                  });
              } else {
                setLoading(false);
                setShowCode(true);
              }
            }
            setLoading(false);
          }
        })
        .catch((e) => {
          if (!firstRender) {
            setLoading(false);
            setShowCode(true);
          }
        });
    }

    if (firstRender || locationChanged) {
      axios
        .get(
          process.env.REACT_APP_IFAPP_API_ENDPOINT +
            "q/" +
            localStorage.getItem("workspace") +
            "/" +
            appName +
            "/service/form/content/" +
            path
        )
        .then((r) => {
          if (r.data)
            setFormLayout(
              checkSaveButtonInForm(JSON.parse(JSON.stringify(r.data)))
            );
          setCustomLoader({
            ...r?.data?.formProperties?.customLoader,
          });
          onLoadData(JSON.parse(JSON.stringify(r.data)));
          setFirstRender(false);
          setLoading(false);
          assignProcessInputVariableValue(
            JSON.parse(JSON.stringify(r.data.formData))
          );
        })
        .catch((e) => {
          console.error("error", e);
        });
    }
    axios
      .get(process.env.REACT_APP_EXCELAPP_SERVICE + "EXCEL/excel/" + appName)
      .then((r) => {
        if (r.data) {
          setformulas(
            JSON?.parse(JSON?.stringify(r?.data?.luckysheet?.formula))
          );
          setIntellisheetData(
            JSON?.parse(JSON?.stringify(r?.data?.luckysheet?.luckyJson))
          );
        }
      })
      .catch((e) => {
        console.error("error", e);
      });
  }

  useEffect(() => {
    if (formulas) {
      const output = formulas.reduce((acc, curr) => {
        const data = curr.input;
        return [...acc, ...data];
      }, []);
      setformulainputs(output);
    }
  }, [formulas]);

  async function calculateFormula(receivedData) {
    formulas?.forEach(async (element) => {
      var body = {
        formula: element.formula,
        data: {},
      };

      element.input.forEach((input) => {
        var inputData = receivedData[input];

        if (
          typeof receivedData[input] === "string" ||
          receivedData[input] instanceof String
        ) {
          inputData = '"' + inputData + '"';
        }
        body.data[input] = inputData;
      });

      await axios
        .post(process.env.REACT_APP_FORMULA_ENDPOINT + "parseFormula", body)
        .then(async (r) => {
          if (r.data) {
            var resp = JSON.parse(JSON.stringify(r.data));

            if (resp.error == null) {
              setformData((prev) => {
                return {
                  ...prev,
                  [element?.output]: resp?.result,
                };
              });
            }
          }
        })
        .catch((e) => {
          console.error("error", e);
        });
    });
  }

  function assignProcessInputVariableValue(data) {
    let processInputVariableValues;
    const temp = data?.map((item) => {
      if (item?.processInputVariable) {
        const inputValue = getProcessInputVariableValue(
          item.processInputVariable
        );

        processInputVariableValues = {
          ...processInputVariableValues,

          [item.processVariableName]: inputValue,
        };
      }
    });
    setformData((prev) => {
      return {
        ...prev,
        ...processInputVariableValues,
      };
    });
  }

  function getProcessInputVariableValue(receivedValue) {
    let value = "";
    if (receivedValue === "_sessionEmployeeName") {
      value = loggedInUser?.username;
    } else if (receivedValue === "_sessionEmployeeID") {
      value = loggedInUser.id;
    } else {
      value = loggedInUser.email;
    }
    return value;
  }

  const onCloseModal = async () => {
    const appName = localStorage.getItem("appName");
    const useHomepage = await checkHopePageAvailable(appName);
    if (useHomepage) {
      setShowCode(false);
      history.push({
        pathname: `/homepage`,
        state: { appName },
      });
    } else {
      setShowCode(false);
      history.push({
        pathname: `/applications`,
        state: { appName },
      });
    }
  };

  const checkHopePageAvailable = async (appName) => {
    const json5 = require("json5");
    let useHomepage = false;
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: appName,
      fileName: `${appName}_HOMEPAGE.frm`,
      fileType: "form",
    };

    await axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((res) => {
        if (res.data.data) {
          const parseData = res.data.data;
          var dataInput = json5.parse(parseData);
          if (dataInput.useHomepage) {
            useHomepage = true;
          } else {
            useHomepage = false;
          }
        }
      })
      .catch((e) => {
        useHomepage = false;
      });

    return useHomepage;
  };

  const captureValue = (
    elem,
    variable,
    prefix = "",
    suffix = "",
    fieldMetaData = {},
    elementType,
    subElementType
  ) => {
    setCurrentElement(variable);
    let data = { ...formData };

    if (elem?.target?.checked) {
      data[variable] = elem.target.value;
    } else if (elem?.target?.value || elem?.target?.value !== null) {
      if (elem.target?.value == "true") {
        elem.target.value = true;
      } else if (elem.target?.value == "false") {
        elem.target.value = false;
      }
      if (
        (prefix === null || prefix === "") &&
        (suffix === null || suffix === "")
      ) {
        if (elem?.target?.attributes?.type?.value == "number") {
          data[variable] = parseFloat(elem.target.value);
        } else {
          data[variable] = elem.target?.value;
        }
      } else if (
        (prefix === null || prefix === "") &&
        (suffix !== null || suffix !== "")
      ) {
        data[variable] = elem.target.value + suffix;
      } else if (
        (prefix !== null || prefix !== "") &&
        (suffix === null || suffix === "")
      ) {
        data[variable] = prefix + elem.target.value;
      } else if (
        (prefix !== null || prefix !== "") &&
        (suffix !== null || suffix !== "")
      ) {
        data[variable] = prefix + elem.target.value + null;
      }
    } else if (!isNaN(elem)) {
      data[variable] = elem;
    } else if (elem?.value || elem?.map((e) => e?.value)) {
      data[variable] = elem;
    }
    if (elem?.target?.files != null) {
      data[variable] = elem.target.files[0];
    }
    if (elem.target?.type == "date") {
      const newData = new Date(elem?.target?.value).toISOString();
      data[variable] = newData;
    }

    if (elem?.target?.files != null) {
      data[variable] = elem.target.files[0];
      if (subElementType == "star") {
        data[variable] = elem;
      }
    }
    if (elem?.target?.type == "date") {
      const newData = new Date(elem?.target?.value).toISOString();
      data[variable] = newData;
    }

    if (formulainputs.includes(variable)) {
      calculateFormula({ ...data });
    }

    setformData({ ...data });
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

  const filesUploaderHelper = async (receivedData) => {
    let newData = dot.dot(receivedData);

    let dropdownElements = formLayout?.formData?.filter(
      (item) => item.elementType === "dropdown"
    );

    let dropdownElementsProcessVariableName = dropdownElements?.map(
      (item) => item.processVariableName
    );

    for (const key in newData) {
      if (
        typeof newData[key] == "object" &&
        !Array.isArray(newData[key]) &&
        !dropdownElementsProcessVariableName?.includes(key) &&
        newData[key] != null
      ) {
        const data = await fileUploader(newData[key]);

        newData[
          key
        ] = `${process.env.REACT_APP_CDS_ENDPOINT}${data.data.file.bucketName}/image/${data.data.file.filename}`;
      }
    }

    return newData;
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

  const stringToObj = function (path, value, obj) {
    var parts = path.split("."),
      part;
    var last = parts.pop();
    while ((part = parts.shift())) {
      if (typeof obj[part] != "object") obj[part] = {};
      obj = obj[part]; // update "pointer"
    }
    obj[last] = value;
  };

  const objValue = function (path) {
    var obj = formData;
    if (path) {
      var parts = path?.split("."),
        part;
      var last = parts?.pop();
      while ((part = parts.shift())) {
        if (typeof obj[part] != "object") obj[part] = {};
        obj = obj[part]; // update "pointer"
      }
      return obj[last];
    }
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

  const eSignatureUploadHelper = async (receivedData) => {
    let arrayOfFormdataKeys = Object.keys(receivedData);
    let eSignElements = formLayout.formData.filter(
      (item) =>
        item.elementType === "esign" &&
        !arrayOfFormdataKeys.includes(item.processVariableName)
    );
    let temp = {
      ...receivedData,
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

    let newData = await filesUploaderHelper(temp);

    return newData;
  };

  const submitForm = async (receivedData) => {
    let appId = appID ?? secondAppID;
    setLoading(true);

    let newData = await eSignatureUploadHelper(receivedData);

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
    var FormSubmitData = { ...newData };
    dot.object(FormSubmitData);
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
        appId +
        "/" +
        appPath +
        "/" +
        taskID +
        "?user=" +
        localStorage.getItem("username") +
        "&actionCategory=task";
    }

    await axios
      .post(pathURL, FormSubmitData)
      .then(async (res) => {
        if (appID) {
          loadForm(appID, null);
        } else {
          appID = res?.data?.id;
          setSecondAppID(res?.data?.id);
          loadForm(res?.data?.id, null);
        }
      })
      .catch((e) => {
        console.error("error", e);
      });
  };

  function checkSaveButtonInForm(formContent) {
    const found = formContent.formData.some(
      (el) => el.elementType === "button"
    );
    if (!found) {
      const maxElement = formContent.formData.reduce((prev, current) =>
        +prev.y > +current.y ? prev : current
      );
      formContent.formData.push({
        x: 11,
        y: maxElement.y + maxElement.h + 2,
        w: 4,
        h: 1,
        i: 486688149,
        id: 486688149,
        elementType: "button",
        fieldType: "text",
        placeholder: null,
        required: "true",
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: "Submit",
        date: "2022-12-13T09:15:27.268Z",
        accessibility: {
          writeUsers: [],
          readUsers: [],
          hideUsers: [],
          writeGroups: [],
          readGroups: [],
          hideGroups: [],
        },
        prefix: null,
        suffix: null,
        dateFormat: null,
        ratingType: null,
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: "appName",
        minLength: null,
        maxLength: null,
        dateRangeStart: "2022-12-13T09:15:27.268Z",
        dateRangeEnd: "2022-12-13T09:15:27.268Z",
        processInputVariable: null,
        dataGridProperties: {
          dataModelName: null,
          cols: [],
          filters: [],
        },
        eSignatureProperties: {
          penColor: null,
          width: null,
          height: null,
        },
        isMathExpression: false,
        actionType: localStorage.getItem("appName"),
        moved: false,
        static: false,
        toolTip: "",
      });
    }

    return formContent;
  }

  function formDataHelper(data) {
    let variablesWithoutArray = {};
    let variablesWithArray = {};
    Object.entries(data).map(([key, value]) => {
      if (value) {
        if (value.constructor === Array) {
          variablesWithArray = { ...variablesWithArray, [key]: value };
        } else {
          variablesWithoutArray = { ...variablesWithoutArray, [key]: value };
        }
      }
    });
    const result = dot.dot(variablesWithoutArray);
    const temp = { ...result, ...variablesWithArray };
    setformData({ ...temp });
  }

  const userAccessibility = (accessibilityData) => {
    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < accessibilityData?.hideUsers?.length; i++) {
      let tempUsername = accessibilityData?.hideUsers[i]?.username;
      if (tempUsername === myEmail) {
        hasHideAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData?.readUsers?.length; i++) {
      let tempUsername = accessibilityData?.readUsers[i]?.username;
      if (tempUsername === myEmail) {
        hasReadAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData?.writeUsers?.length; i++) {
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

    return accessibilityCode.notApplicable;
  };

  const groupAccessibility = (accessibilityData) => {
    let tempMyGroups = myGroups.map((group) => {
      return group.name;
    });

    if (tempMyGroups?.length == 0) {
      return accessibilityCode?.notApplicable;
    }

    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < tempMyGroups?.length; i++) {
      for (let j = 0; j < accessibilityData?.hideGroups?.length; j++) {
        let tempGroupname = accessibilityData?.hideGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasHideAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData?.readGroups?.length; j++) {
        let tempGroupname = accessibilityData.readGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasReadAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData?.writeGroups?.length; j++) {
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
      return accessibilityCode?.hide;
    }

    return accessibilityCode?.notApplicable;
  };

  function renderFormElement(receivedFormLayoutData) {
    var forlayoutData = receivedFormLayoutData ?? formLayout.formData;

    return forlayoutData?.map((e, index) => {
      if (e.elementType == "button") {
        showDefaultSave = false;
      }
      const userPreviledges = userAccessibility(e.accessibility);
      const groupPreviledges = groupAccessibility(e.accessibility);

      let disabledStatus = true;

      if (
        groupPreviledges == accessibilityCode.notApplicable &&
        userPreviledges == accessibilityCode.notApplicable
      ) {
        disabledStatus = false;
        return <>{renderAllElements(e, disabledStatus)}</>;
      } else if (
        groupPreviledges == accessibilityCode.notApplicable &&
        userPreviledges != accessibilityCode.notApplicable
      ) {
        if (userPreviledges === accessibilityCode.write) {
          disabledStatus = false;
        } else if (userPreviledges == accessibilityCode.read) {
          disabledStatus = true;
        }
        if (userPreviledges === accessibilityCode.hide) {
        } else {
          return <>{renderAllElements(e, disabledStatus)}</>;
        }
      } else if (
        groupPreviledges != accessibilityCode.notApplicable &&
        userPreviledges == accessibilityCode.notApplicable
      ) {
        if (groupPreviledges === accessibilityCode.write) {
          disabledStatus = false;
        } else if (groupPreviledges == accessibilityCode.read) {
          disabledStatus = true;
        }
        if (groupPreviledges === accessibilityCode.hide) {
        } else {
          return <>{renderAllElements(e, disabledStatus)}</>;
        }
      } else {
        if (
          userPreviledges === accessibilityCode.write ||
          groupPreviledges === accessibilityCode.write
        ) {
          disabledStatus = false;
        } else if (
          userPreviledges === accessibilityCode.read &&
          groupPreviledges === accessibilityCode.read
        ) {
          disabledStatus = true;
        }
        if (
          userPreviledges === accessibilityCode.hide &&
          groupPreviledges === accessibilityCode.hide
        ) {
        } else {
          return <>{renderAllElements(e, disabledStatus)}</>;
        }
      }
    });
  }

  const handleClick = (option, limit, processVariableName) => {
    if (!limit || formData[processVariableName]?.length < limit) {
      if (formData[processVariableName]?.includes(option.key)) {
        setformData({
          ...formData,
          [processVariableName]: formData[processVariableName]?.filter(
            (item) => item !== option.key
          ),
        });
      } else {
        let tempArray = formData[processVariableName]
          ? [...formData[processVariableName]]
          : [];
        tempArray.push(option.key);
        setformData({
          ...formData,
          [processVariableName]: [...tempArray],
        });
      }
    } else {
      if (formData[processVariableName]?.includes(option.key)) {
        setformData({
          ...formData,
          [processVariableName]: formData[processVariableName]?.filter(
            (item) => item !== option.key
          ),
        });
      } else {
        let tempArray = formData[processVariableName]
          ? [...formData[processVariableName]]
          : [];
        tempArray.shift();
        tempArray.push(option.key);
        setformData({
          ...formData,
          [processVariableName]: [...tempArray],
        });
      }
    }
  };

  const handleRadioButtonClick = (option, name) => {
    setformData({
      ...formData,
      [name]: option.key,
    });
  };

  const filterMaker = (field, operator, value) => {
    let operation;
    let queryFilter;
    switch (operator) {
      case "=":
        operation = "eq";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case ">":
        operation = "gt";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "<":
        operation = "lt";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case ">=":
        operation = "ge";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "<=":
        operation = "le";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "!=":
        operation = "ne";
        queryFilter = isNaN(value)
          ? `${field} ${operation} '${value}'`
          : `${field} ${operation} ${value}`;
        break;
      case "like":
        queryFilter = `substringof('${value}',${field})`;
        break;
      default:
        break;
    }

    return queryFilter;
  };

  async function getOdataFilteredValues(allFilters, receivedCollectionName) {
    const appName = localStorage.getItem("appName");
    const collectionName = receivedCollectionName?.replace(/\.[^/.]+$/, "");

    if (allFilters?.length === 0) {
      const allData = await axios.get(
        `${process.env.REACT_APP_DATA_ENDPOINT}/query/${localStorage.getItem(
          "workspace"
        )}/${appName}/${collectionName}`
      );
      return allData.data.value;
    }

    let filteredData = [];
    let filterArrayString = "";
    let first = true;

    for (let i = 0; i < allFilters?.length; i++) {
      let value = "";
      if (allFilters[i].useSession) {
        value = getSessionValue(allFilters[i].value);
      } else if (allFilters[i].useProcessVariable) {
        value = getProcessVariableValue(allFilters[i].value);
      } else {
        value = allFilters[i].value;
      }

      if (value !== "") {
        if (first) {
          let tempFilter = filterMaker(
            allFilters[i].field,
            allFilters[i].operator,
            value
          );

          filterArrayString = filterArrayString + tempFilter;
          first = false;
        } else {
          let tempFilter = filterMaker(
            allFilters[i].field,
            allFilters[i].operator,
            value
          );

          filterArrayString = filterArrayString + ` and ${tempFilter}`;
        }
      }
    }

    const queryUrl = `${
      process.env.REACT_APP_DATA_ENDPOINT
    }/query/${localStorage.getItem(
      "workspace"
    )}/${appName}/${collectionName}?$filter=${filterArrayString}`;

    await axios
      .get(queryUrl)
      .then((response) => {
        if (response?.data?.value?.length) {
          filteredData = [...response.data.value];
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return filteredData;
  }

  function getSessionValue(receivedValue) {
    let value = "";
    if (receivedValue === "_sessionEmployeeName") {
      value = loggedInUser?.username;
    } else if (receivedValue === "_sessionEmployeeID") {
      value = loggedInUser.id;
    } else {
      value = loggedInUser.email;
    }
    return value;
  }

  function getProcessVariableValue(receivedData) {
    let value = "";
    if (formData[receivedData]) value = formData[receivedData];
    return value;
  }

  const RenderIntellisheet = ({ e, disabledStatus }) => {
    return (
      <div
        className="form-group customScrollBar BodyColor"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          overflow: "auto",
        }}
      >
        {intellisheetData ? (
          <Intellisheetv2 intellisheetData={intellisheetData} />
        ) : null}
      </div>
    );
  };

  const RenderSection = ({ e, disabledStatus }) => {
    return (
      <div
        className="form-group customScrollBar BodyColor"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          // height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          overflow: "auto",
        }}
      >
        {e.fieldName && <label> {parse(e.fieldName)}</label>}
        <div className="section-container">{renderFormElement(e.stack)}</div>
      </div>
    );
  };

  const RenderDataModalDropDown = ({
    e,
    disabledStatus,
    processDataVariable,
  }) => {
    const [choices, setChoices] = useState([]);

    const dependencies = e?.filters?.map((dep) => {
      if (dep.useProcessVariable) {
        return dep.value;
      }
    });

    useEffect(() => {
      getData();
    }, []);

    useEffect(() => {
      if (dependencies?.includes(currentElement)) {
        getData();
      }
      // if(formulainputs?.includes)
    }, [formData]);

    async function getData() {
      try {
        var getDataGridDataAPI = await getOdataFilteredValues(
          e.filters,
          e.selectedDataModel
        );

        if (getDataGridDataAPI?.length) {
          let tempChoiceArray = [];
          getDataGridDataAPI.map((data) => {
            tempChoiceArray.push({
              _id: data._id,
              label: data[e.choices[0].label],
              value: data[e.choices[0].value],
            });
          });

          setChoices([...tempChoiceArray]);
        }
      } catch (e) {
        console.log(e);
      }
    }

    let selectedValue = choices?.filter(
      (choice) => choice.value === formData[e.processVariableName]
    );

    return (
      <div
        className="form-group"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
        }}
      >
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" ? (
            <span style={{ color: "red" }}>*</span>
          ) : (
            ""
          )}
          {errors[processDataVariable] && (
            <span
              class="badge"
              className="secondaryColor"
              style={{ color: "red", cursor: "pointer" }}
            >
              <Icon
                icon="clarity:info-standard-line"
                height="15"
                alt="info"
                data-tip
                data-for={String(e.id)}
                onMouseEnter={() => handleInfo(e.id)}
                onMouseLeave={() => handleInfo("")}
              />
            </span>
          )}
          {isShown == e.id && (
            <ReactTooltip id={String(e.id)} place="right" effect="solid">
              <small className="requiredTextColor">
                <b>
                  Please select any one option from{" "}
                  {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        <div
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <Controller
            control={control}
            defaultValue={selectedValue[0]}
            name={e.processVariableName}
            rules={{
              required: disabledStatus ? null : JSON.parse(e.required),
            }}
            render={({ field }) => {
              const { onChange } = field;
              return (
                <Select
                  id="renderForm-inputStyleSelect"
                  name={e.processVariableName}
                  className="inputStyleSelect"
                  style={{
                    background: "white",
                  }}
                  onChange={(elem) => {
                    // onChange((evt) => {
                    captureValue(
                      { target: { value: elem.value } },
                      e.processVariableName
                    );
                    // });
                  }}
                  value={selectedValue[0]}
                  options={choices}
                  isDisabled={disabledStatus}
                />
              );
            }}
          />
        </div>
      </div>
    );
  };

  const RenderDropdown = ({ e, disabledStatus }) => {
    const processDataVariable = e.processVariableName?.replace(".", "");
    const isAutoPopulateAvailableDropdown =
      e?.autopopulate?.autoPopulateFields?.length;
    const dependenciesDropdown = [e?.processVariableName];

    const RenderEffectsDropdown = () => {
      const [eleValue] = useState(formData[e?.processVariableName]);

      useEffect(() => {
        if (eleValue) {
          if (isAutoPopulateAvailableDropdown)
            if (dependenciesDropdown?.includes(currentElement)) getData();
        }
      }, [eleValue]);

      async function getData() {
        try {
          let field = e.processVariableName?.split(".")[1];
          setCurrentElement("");
          let tempFormData = {};
          var getDataGridDataAPI = await getOdataFilteredValues(
            [
              {
                field: field,
                operator: "=",
                value: e.processVariableName,
                useSession: false,
                useProcessVariable: true,
              },
            ],
            e.autopopulate?.selectedDataModel
          );
          if (getDataGridDataAPI?.length) {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              let tempVar = autoPopField?.value.split(".")[1];

              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: getDataGridDataAPI[0][tempVar],
              };
            });
          } else {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: "",
              };
            });
          }

          setformData((prev) => {
            return {
              ...prev,
              ...tempFormData,
            };
          });
        } catch (e) {
          console.log(e);
        }
      }

      return <></>;
    };

    if (e.multiSelect == false || e.multiSelect == null) {
      if (e.useDataModal) {
        return (
          <RenderDataModalDropDown
            e={e}
            disabledStatus={disabledStatus}
            processDataVariable={processDataVariable}
          />
        );
      } else {
        let selectedValue = e.choices?.filter(
          (choice) => choice.value === formData[e.processVariableName]
        );

        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            {RenderEffectsDropdown()}
            <label className="fieldLable secondaryColor">
              {parse(t(e.fieldName))}
              {String(e.required) == "true" ? (
                <span style={{ color: "red" }}>*</span>
              ) : (
                ""
              )}
              {errors[processDataVariable] && (
                <span
                  class="badge"
                  className="secondaryColor"
                  style={{ color: "red", cursor: "pointer" }}
                >
                  <Icon
                    icon="clarity:info-standard-line"
                    height="15"
                    alt="info"
                    data-tip
                    data-for={String(e.id)}
                    onMouseEnter={() => handleInfo(e.id)}
                    onMouseLeave={() => handleInfo("")}
                  />
                </span>
              )}
              {isShown == e.id && (
                <ReactTooltip id={String(e.id)} place="right" effect="solid">
                  <small className="requiredTextColor">
                    <b>
                      Please select any one option from{" "}
                      {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                    </b>
                  </small>
                </ReactTooltip>
              )}
            </label>
            <div
              style={{
                height: "100%",
                width: "100%",
              }}
            >
              <Controller
                control={control}
                defaultValue={selectedValue[0]}
                name={e.processVariableName}
                rules={{
                  required: disabledStatus ? null : JSON.parse(e.required),
                }}
                render={({ field }) => {
                  const { onChange } = field;
                  return (
                    <Select
                      id="renderForm-inputStyleSelect"
                      name={e.processVariableName}
                      className="inputStyleSelect"
                      style={{
                        background: "white",
                      }}
                      onChange={(elem) => {
                        // onChange(() =>
                        captureValue(
                          {
                            target: {
                              value: elem.value,
                            },
                          },
                          e.processVariableName,
                          e.prefix,
                          e.suffix
                        );
                        // );
                      }}
                      defaultValue={selectedValue[0]}
                      options={e.choices}
                      isDisabled={disabledStatus}
                    />
                  );
                }}
              />
            </div>
          </div>
        );
      }
    } else {
      return (
        <div
          className="form-group"
          key={e.id}
          style={{
            position: "absolute",
            paddingBottom: "30px",
            left: `${(e.x / 24) * 100}%`,
            top: `${(e.y / 10) * 1.2 * 100}%`,
            height: `${(e.h / 10) * 1.2 * 100}%`,
            width: `${(e.w / 24) * 100}%`,
          }}
        >
          {RenderEffectsDropdown()}
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" ? (
              <span style={{ color: "red" }}>*</span>
            ) : (
              ""
            )}
            {errors[processDataVariable] && (
              <span
                class="badge"
                className="secondaryColor"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>
                    Select atleast one option from{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                  </b>
                </small>
              </ReactTooltip>
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
              defaultValue={formData[e.processVariableName] || []}
              name={e.processVariableName}
              rules={{
                required: disabledStatus ? null : JSON.parse(e.required),
              }}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <Select
                    id="renderForm-processVariableName-choice"
                    name={e.processVariableName}
                    className="inputStyleSelect"
                    style={{
                      background: "white",
                    }}
                    onChange={(elem) => {
                      const tempVals = elem?.map((item) => item.value);
                      onChange(tempVals);
                    }}
                    defaultValue={value.map((selectedValue) => {
                      const selectedChoice = e.choices.find(
                        (choice) => choice.value === selectedValue
                      );
                      return {
                        value: selectedValue,
                        label: selectedChoice
                          ? selectedChoice.label
                          : selectedValue,
                      };
                    })}
                    options={e.choices}
                    isMulti={e.multiSelect}
                    isDisabled={disabledStatus}
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
  };

  const RenderDate = ({ e, disabledStatus }) => {
    const processDataVariable = e.processVariableName?.replace(".", "");

    // const RenderRange = () => {
    //   const [range, setRange] = useState(
    //     formData[e.processVariableName]
    //       ? [
    //           new Date(formData[e.processVariableName][0]),
    //           new Date(formData[e.processVariableName][1]),
    //         ]
    //       : [null, null]
    //   );
    //   const [start, end] = range;

    //   return (
    //     <DatePicker
    //       selectsRange
    //       minDate={new Date(e.dateRangeStart)}
    //       maxDate={new Date(e.dateRangeEnd)}
    //       startDate={start}
    //       endDate={end}
    //       onChange={(update) => {
    //         setRange(update);

    //         if (update[1]) {
    //           setformData((prev) => {
    //             return {
    //               ...prev,
    //               [e.processVariableName]: [
    //                 update[0] ? update[0].toISOString() : null,
    //                 update[1] ? update[1].toISOString() : null,
    //               ],
    //             };
    //           });
    //         }
    //       }}
    //       disabled={disabledStatus}
    //       dateFormat={e.useTime ? e.dateFormat + e.timeFormat : e.dateFormat}
    //       // todayButton={"Today"}
    //       popperPlacement={e.x > 4 ? "left" : "right"}
    //       locale="es"
    //       id="renderForm-formElementType-date"

    //       // timeClassName={(time) => "text-danger"}
    //     />
    //   );
    // };

    const RenderNormalDate = () => {
      const [initDate, setInitialDate] = useState(
        new Date(formData[e.processVariableName] ?? e.date)
      );

      const changeDate = (date) => {
        let localDate = new Date(date);
        localDate.setMinutes(
          localDate.getMinutes() - localDate.getTimezoneOffset()
        );
        localDate = localDate.toISOString();

        setInitialDate(date);
        setformData((prev) => {
          return {
            ...prev,
            [e.processVariableName]: localDate,
          };
        });
      };

      return (
        <DatePicker
          selected={initDate}
          onChange={changeDate}
          disabled={disabledStatus}
          showTimeSelect={e?.useTime}
          timeFormat={e.timeFormat}
          timeIntervals={15}
          timeCaption="Hour"
          dateFormat={e.useTime ? e.dateFormat + e.timeFormat : e.dateFormat}
          // todayButton={"Today"}
          popperPlacement={e.x > 4 ? "left" : "right"}
          locale="es"
          id="renderForm-formElementType-date"
          minDate={new Date(e.dateRangeStart)}
          maxDate={new Date(e.dateRangeEnd)}
          // timeClassName={(time) => "text-danger"}
          style={{ width: "100%", height: "80%" }}
        />
      );
    };

    return (
      <div
        className="form-group"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
        }}
      >
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" && (
            <span style={{ color: "red" }}>*</span>
          )}
          {errors[processDataVariable] && (
            <span
              class="badge"
              className="secondaryColor"
              style={{ color: "red", cursor: "pointer" }}
            >
              <Icon
                icon="clarity:info-standard-line"
                height="15"
                alt="info"
                data-tip
                data-for={String(e.id)}
                onMouseEnter={() => handleInfo(e.id)}
                onMouseLeave={() => handleInfo("")}
              />
            </span>
          )}
          {isShown == e.id && (
            <ReactTooltip id={String(e.id)} place="right" effect="solid">
              <small className="requiredTextColor">
                <b>
                  Please select your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        {/* {e.selectsRange ? <RenderRange /> :  */}
        <RenderNormalDate />
        {/* // } */}
      </div>
    );
  };

  function evaluateCondition(condition) {
    const operator = condition[0];
    const operand1 = condition[1];
    const operand2 = condition[2];

    switch (operator) {
      case "=":
        return operand1 === operand2;
      case ">":
        return operand1 > operand2;
      case "<":
        return operand1 < operand2;
      case ">=":
        return operand1 >= operand2;
      case "<=":
        return operand1 <= operand2;
      case "!=":
        return operand1 !== operand2;
      default:
        return false;
    }
  }

  const RenderText = (e, disabledStatus) => {
    const processDataVariable = e.processVariableName?.replace(".", "");
    const isAutoPopulateAvailable = e?.autopopulate?.autoPopulateFields?.length;
    const dependencies = [e?.processVariableName];

    let hideItem = e?.hidden ?? false;
    let elementDisabledStatus = e?.disabled || disabledStatus ? true : false;

    if (e?.conditions?.length) {
      e.conditions.forEach((ele) => {
        let res;
        if (ele?.useSession) {
          let operand1 = formData[ele.operand1];
          let operand2 = getProcessInputVariableValue(ele.operand2);

          res = operand1
            ? evaluateCondition([ele.operator, operand1, operand2])
            : false;
        } else if (ele?.useProcessVariable) {
          let operand1 = formData[ele.operand1];
          let operand2 = formData[ele?.operand2];

          res = operand1
            ? evaluateCondition([ele.operator, operand1, operand2])
            : false;
        } else if (ele?.useNullValue) {
          let operand1 = formData[ele.operand1];

          res = operand1 ? false : true;
        } else {
          let operand1 = formData[ele.operand1];

          res = operand1
            ? evaluateCondition([ele.operator, operand1, ele.operand2])
            : false;
        }

        if (res) {
          ele.result === "disable"
            ? (elementDisabledStatus = true)
            : (hideItem = true);
        }
      });
    }
    const RenderEffects = () => {
      const [eleValue] = useState(formData[e?.processVariableName]);

      useEffect(() => {
        if (eleValue) {
          if (isAutoPopulateAvailable)
            if (dependencies.includes(currentElement)) getData();
        }
      }, [eleValue]);

      async function getData() {
        try {
          let field = e.processVariableName?.split(".")[1];
          setCurrentElement("");
          let tempFormData = {};
          var getDataGridDataAPI = await getOdataFilteredValues(
            [
              {
                field: field,
                operator: "=",
                value: e.processVariableName,
                useSession: false,
                useProcessVariable: true,
              },
            ],
            e.autopopulate?.selectedDataModel
          );
          if (getDataGridDataAPI?.length) {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              let tempVar = autoPopField?.value.split(".")[1];

              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: getDataGridDataAPI[0][tempVar],
              };
            });
          } else {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: "",
              };
            });
          }

          setformData((prev) => {
            return {
              ...prev,
              ...tempFormData,
            };
          });
        } catch (e) {
          console.log(e);
        }
      }
      return <></>;
    };

    const renderEmail = () => {
      return (
        <>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" ? (
              <span style={{ color: "red" }}>*</span>
            ) : (
              ""
            )}
            {errors[processDataVariable] && (
              <span
                class="badge"
                className="secondaryColor"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>
                    Please enter your{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                  </b>
                </small>
              </ReactTooltip>
            )}
          </label>
          <input
            id="renderForm-formElementType-text"
            type={e.fieldType}
            className={
              (errors[processDataVariable] ? "is-invalid" : "", "inputStyle")
            }
            placeholder={e.placeholder}
            disabled={elementDisabledStatus}
            // name={e.processVariableName}
            style={{
              height: "100%",
              width: "100%",
            }}
            data-tip
            data-for={e.processVariableName}
            value={formData[e.processVariableName]}
            {...register(processDataVariable, {
              required: elementDisabledStatus ? null : JSON.parse(e.required),
            })}
            onChange={(elem) => {
              captureValue(elem, e.processVariableName, e.prefix, e.suffix);
            }}
            // value={formData[e.processVariableName]}
          />
          {e.toolTip && e.toolTip != "" && (
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          )}
        </>
      );
    };

    const renderTextMathExp = () => {
      let arrayOfFormdataKeys = Object.keys(formData);
      let exist = arrayOfFormdataKeys.includes(e.processVariableName);
      return (
        <>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" ? (
              <span style={{ color: "red" }}>*</span>
            ) : (
              // <span style={{ color: "red" }}>*</span>
              ""
            )}
            {errors[processDataVariable] && (
              <span
                className="secondaryColor"
                class="badge"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>
                    Please enter your{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                  </b>
                </small>
              </ReactTooltip>
            )}
          </label>
          {exist ? (
            <div className="disabled">
              <MathView value={formData[e.processVariableName]} />
            </div>
          ) : (
            <div className={elementDisabledStatus ? "disabled" : ""}>
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
          )}
          {e.toolTip && e.toolTip != "" && (
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          )}
        </>
      );
    };

    const renderNormalText = () => {
      let patternString = e.patternValidationEnabled ? e.pattern : "";
      if (patternString.charAt(patternString.length - 1) == "/") {
        patternString = patternString.substr(0, patternString.length - 1);
      }
      if (patternString.charAt(0) == "/") {
        patternString = patternString.substr(1, patternString.length);
      }
      var finalreg = new RegExp(patternString);

      return (
        <>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" ? (
              <span style={{ color: "red" }}>*</span>
            ) : (
              // <span style={{ color: "red" }}>*</span>
              ""
            )}
            {errors[processDataVariable] && (
              <span
                className="secondaryColor"
                class="badge"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}

            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
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
              </ReactTooltip>
            )}
          </label>

          <input
            id="renderForm-formElementType-fieldType"
            type={e.elementType}
            className={
              (errors[processDataVariable] ? "is-invalid" : "", "inputStyle")
            }
            placeholder={e.placeholder}
            disabled={elementDisabledStatus}
            style={{
              height: "100%",
              width: "100%",
            }}
            data-tip
            data-for={e.processVariableName}
            value={formData[e.processVariableName]}
            {...register(processDataVariable, {
              required: elementDisabledStatus ? null : JSON.parse(e.required),
              pattern:
                e.patternValidationEnabled && !e.patternCaseSensitivity
                  ? new RegExp(finalreg, "i")
                  : e.patternValidationEnabled
                  ? new RegExp(finalreg)
                  : new RegExp(),
            })}
            onChange={(elem) => {
              captureValue(elem, e.processVariableName, e.prefix, e.suffix, e);
            }}
          />
          {e.toolTip && e.toolTip != "" && (
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          )}
        </>
      );
    };

    return (
      <div
        className="form-group"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          display: hideItem ? "none" : null,
        }}
      >
        <RenderEffects />
        {e.fieldType === "email" ? renderEmail() : null}
        {e.fieldType === "mathExp" ? renderTextMathExp() : null}
        {e.fieldType === null || e.fieldType === "text"
          ? renderNormalText()
          : null}
      </div>
    );
  };

  const RenderNumber = (e, disabledStatus) => {
    const processDataVariable = e.processVariableName?.replace(".", "");
    const maxNumber = Number(e.maxLength);
    const minNumber = Number(e.minLength);
    const isAutoPopulateAvailableNumber =
      e?.autopopulate?.autoPopulateFields?.length;
    const dependenciesNumber = [e?.processVariableName];

    const RenderEffectsNumber = () => {
      const [eleValue] = useState(formData[e?.processVariableName]);

      useEffect(() => {
        if (eleValue) {
          if (isAutoPopulateAvailableNumber)
            if (dependenciesNumber?.includes(currentElement)) getData();
        }
      }, [eleValue]);

      async function getData() {
        try {
          let field = e.processVariableName?.split(".")[1];
          setCurrentElement("");
          let tempFormData = {};
          var getDataGridDataAPI = await getOdataFilteredValues(
            [
              {
                field: field,
                operator: "=",
                value: e.processVariableName,
                useSession: false,
                useProcessVariable: true,
              },
            ],
            e.autopopulate?.selectedDataModel
          );
          if (getDataGridDataAPI?.length) {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              let tempVar = autoPopField?.value.split(".")[1];

              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: getDataGridDataAPI[0][tempVar],
              };
            });
          } else {
            e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: "",
              };
            });
          }

          setformData((prev) => {
            return {
              ...prev,
              ...tempFormData,
            };
          });
        } catch (e) {
          console.log(e);
        }
      }

      return <></>;
    };

    const renderLimitNumber = () => {
      return (
        <>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" && (
              <span style={{ color: "red" }}>*</span>
            )}
            {errors[processDataVariable] && (
              <span
                className="secondaryColor"
                class="badge"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>
                    {/* Please enter your{" "}
                  {e.fieldName?.replace(/(<([^>]+)>)/gi, "")} */}
                    {errors[processDataVariable]?.message}
                  </b>
                </small>
              </ReactTooltip>
            )}
          </label>
          <input
            id="renderForm-formElementType-number"
            type={e.elementType}
            placeholder={e.placeholder}
            className={
              (errors[processDataVariable] ? "is-invalid" : "",
              "inputStyle inputNumber")
            }
            disabled={disabledStatus}
            style={{
              height: "100%",
              width: "100%",
            }}
            data-tip
            data-for={e.processVariableName}
            value={formData[e.processVariableName]}
            {...register(processDataVariable, {
              required: {
                value: disabledStatus ? null : JSON.parse(e.required),
                message: `Enter a number between ${minNumber} & ${maxNumber} `,
              },
              min: {
                value: e.minLength,
                message: `Enter a number greater than ${minNumber}`,
              },
              max: {
                value: e.maxLength,
                message: `Enter a number smaller than ${maxNumber}`,
              },
              valueAsNumber: true,

              // validate: (value) =>
              //   value >= e.minLength && value <= e.maxLength,
              // message: "Please Enter A number Between x and y",
            })}
            onChange={(elem) => {
              captureValue(elem, e.processVariableName, e.prefix, e.suffix);
            }}
          />
          {e.toolTip && e.toolTip != "" && (
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          )}
        </>
      );
    };

    const renderNormalNumber = () => {
      return (
        <>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" && (
              <span style={{ color: "red" }}>*</span>
            )}
            {errors[processDataVariable] && (
              <span
                className="secondaryColor"
                class="badge"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>
                    {/* Please enter your{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")} */}
                    {errors[processDataVariable]?.message}
                  </b>
                </small>
              </ReactTooltip>
            )}
          </label>
          <input
            id="renderForm-formElementType-number"
            type={e.elementType}
            placeholder={e.placeholder}
            className={
              (errors[processDataVariable] ? "is-invalid" : "",
              "inputStyle inputNumber")
            }
            disabled={disabledStatus}
            style={{
              height: "100%",
              width: "100%",
            }}
            data-tip
            data-for={e.processVariableName}
            value={formData[e.processVariableName]}
            {...register(processDataVariable, {
              required: {
                value: disabledStatus ? null : JSON.parse(e.required),
                // message: `Enter a number between ${minNumber} & ${maxNumber} `,
                message: `Enter a number `,
              },
              // min: {
              //   value: e.minLength,
              //   message: `Enter a number greater than ${minNumber}`,
              // },
              // max: {
              //   value: e.maxLength,
              //   message: `Enter a number smaller than ${maxNumber}`,
              // },
              valueAsNumber: true,

              // validate: (value) =>
              //   value >= e.minLength && value <= e.maxLength,
              // message: "Please Enter A number Between x and y",
            })}
            onChange={(elem) => {
              captureValue(elem, e.processVariableName, e.prefix, e.suffix);
            }}
          />
          {e.toolTip && e.toolTip != "" && (
            <ReactTooltip id={e.processVariableName} place="top" effect="solid">
              {e.toolTip}
            </ReactTooltip>
          )}
        </>
      );
    };

    return (
      <div
        className={"form-group"}
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
        }}
      >
        <RenderEffectsNumber />
        {e.maxLength?.length > 0 && e.minLength?.length > 0
          ? renderLimitNumber()
          : renderNormalNumber()}
      </div>
    );
  };

  const RenderDataGrid = (e, disabledStatus) => {
    return (
      <div
        className="form-group"
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
        }}
      >
        <Table
          dataGridProperties={e?.dataGridProperties}
          datagridChanges={datagridChanges}
          setdatagridChanges={setdatagridChanges}
          fieldName={e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
          accessibilityprop={e.accessibility}
          // gridColumns={e.dataGridProperties.cols}
          disabledStatus={disabledStatus}
          formData={formData}
          currentElement={currentElement}
          getODataFilteredValuesRenderForm={getOdataFilteredValues}
          processVariableName={e.processVariableName}
          captureValue={captureValue}
        />
      </div>
    );
  };

  const RenderRadioButton = ({
    e,
    disabledStatus,
    formData,
    setformData,
    currentElement,
    setCurrentElement,
  }) => {
    const processDataVariable = e.processVariableName?.replace(".", "");
    const isAutoPopulateAvailableDropdown =
      e?.autopopulate?.autoPopulateFields?.length;
    const selectedOptionKey = formData[e.processVariableName];
    const dependenciesDropdown = [e?.processVariableName];

    let hideItem = e?.hidden ?? false;
    let elementDisabledStatus = e?.disabled || disabledStatus ? true : false;

    if (e?.conditions?.length) {
      e.conditions.forEach((ele) => {
        let res;
        if (ele?.useSession) {
          let operand1 = formData[ele.operand1];
          let operand2 = getProcessInputVariableValue(ele.operand2);

          res = operand1
            ? evaluateCondition([ele.operator, operand1, operand2])
            : false;
        } else if (ele?.useProcessVariable) {
          let operand1 = formData[ele.operand1];
          let operand2 = formData[ele?.operand2];

          res = operand1
            ? evaluateCondition([ele.operator, operand1, operand2])
            : false;
        } else if (ele?.useNullValue) {
          let operand1 = formData[ele.operand1];

          res = operand1 ? false : true;
        } else {
          let operand1 = formData[ele.operand1];

          res = operand1
            ? evaluateCondition([ele.operator, operand1, ele.operand2])
            : false;
        }

        if (res) {
          ele.result === "disable"
            ? (elementDisabledStatus = true)
            : (hideItem = true);
        }
      });
    }

    const handleRadioButtonClick = (option) => {
      setformData((prevData) => ({
        ...prevData,
        [e.processVariableName]: option.key,
      }));
      setCurrentElement(e.processVariableName);
    };

    const RenderEffectRadioButton = () => {
      useEffect(() => {
        if (
          selectedOptionKey &&
          isAutoPopulateAvailableDropdown &&
          dependenciesDropdown?.includes(currentElement)
        ) {
          getData();
        }
      }, [selectedOptionKey, currentElement]);

      async function getData() {
        try {
          let field = e.processVariableName?.split(".")[1];
          setCurrentElement("");
          let tempFormData = {};

          var getDataGridDataAPI = await getOdataFilteredValues(
            [
              {
                field: field,
                operator: "=",
                value: e.processVariableName,
                useSession: false,
                useProcessVariable: true,
              },
            ],
            e.autopopulate?.selectedDataModel
          );

          if (getDataGridDataAPI?.length) {
            e.autopopulate?.autoPopulateFields?.forEach((autoPopField) => {
              let tempVar = autoPopField?.value.split(".")[1];

              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: getDataGridDataAPI[0][tempVar],
              };
            });
          } else {
            e.autopopulate?.autoPopulateFields?.forEach((autoPopField) => {
              tempFormData = {
                ...tempFormData,
                [autoPopField.value]: "",
              };
            });
          }

          setformData((prev) => ({
            ...prev,
            ...tempFormData,
          }));
        } catch (e) {
          console.log(e);
        }
      }
    };

    return (
      <div
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(e.x / 24) * 100}%`,
          top: `${(e.y / 10) * 1.2 * 100}%`,
          height: `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          display: hideItem ? "none" : null,
        }}
      >
        {RenderEffectRadioButton()}
        <div>
          <label className="fieldLable secondaryColor">
            {parse(t(e.fieldName))}
            {String(e.required) == "true" ? (
              <span style={{ color: "red" }}>*</span>
            ) : (
              ""
            )}
            {errors[processDataVariable] && (
              <span
                className="secondaryColor"
                class="badge"
                style={{ color: "red", cursor: "pointer" }}
              >
                <Icon
                  icon="clarity:info-standard-line"
                  height="15"
                  alt="info"
                  data-tip
                  data-for={String(e.id)}
                  onMouseEnter={() => handleInfo(e.id)}
                  onMouseLeave={() => handleInfo("")}
                />
              </span>
            )}
            {isShown == e.id && (
              <ReactTooltip id={String(e.id)} place="right" effect="solid">
                <small className="requiredTextColor">
                  <b>Select your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}</b>
                </small>
              </ReactTooltip>
            )}
          </label>
        </div>
        {e.choices.map((option) => (
          <div
            key={option.id}
            className={e.VAxis ? "form-check" : "form-check form-check-inline"}
          >
            <input
              className={
                ("form-check-input",
                errors[processDataVariable] ? "is-invalid" : "")
              }
              disabled={elementDisabledStatus}
              type="radio"
              name={processDataVariable}
              id={e.id}
              value={option.key}
              checked={option.key === selectedOptionKey}
              onChange={() => handleRadioButtonClick(option)}
            />
            <label
              style={{ marginLeft: "5px" }}
              className="form-check-label secondaryColor"
            >
              {t(option.choice)}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const renderAllElements = (e, disabledStatus) => {
    switch (e.elementType) {
      case formElementType.label: {
        let labelbgColor = parse(e.fieldName)?.props?.style?.backgroundColor;
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
              textAlign: "center",
              background: labelbgColor,
            }}
          >
            {e.fieldName && <label> {parse(e.fieldName)}</label>}
          </div>
        );
      }

      case formElementType.text: {
        return (
          <RenderTextInput
            e={e}
            processVariableName={e.processVariableName}
            captureValue={captureValue}
            errors={errors}
            isShown={isShown}
            formData={formData}
            disabledStatus={disabledStatus}
            register={register}
            isListComponent={false}
            topData={""}
            leftData={""}
            handleInfo={handleInfo}
            setformData={setformData}
            currentElement={currentElement}
            setCurrentElement={setCurrentElement}
            getOdataFilteredValues={getOdataFilteredValues}
          />
        );
      }

      case formElementType.number: {
        return (
          <RenderNumberInput
            e={e}
            processVariableName={e.processVariableName}
            captureValue={captureValue}
            errors={errors}
            isShown={isShown}
            formData={formData}
            disabledStatus={disabledStatus}
            register={register}
            isListComponent={false}
            topData={""}
            leftData={""}
            handleInfo={handleInfo}
            setformData={setformData}
            currentElement={currentElement}
            setCurrentElement={setCurrentElement}
            getOdataFilteredValues={getOdataFilteredValues}
          />
        );
      }

      case formElementType.date: {
        return <RenderDate e={e} disabledStatus={disabledStatus} />;
      }

      case formElementType.dropdown: {
        return <RenderDropdown e={e} disabledStatus={disabledStatus} />;
      }

      case formElementType.radio: {
        return (
          <RenderRadioButton
            e={e}
            disabledStatus={disabledStatus}
            setformData={setformData}
            formData={formData}
            setCurrentElement={setCurrentElement}
            currentElement={currentElement}
          />
        );
      }

      case formElementType.rating: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        if (e.ratingType == "slider") {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 1.2 * 100}%`,
                height: `${(e.h / 10) * 1.2 * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(t(e.fieldName))}
                {String(e.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {errors[processDataVariable] && (
                  <span
                    className="secondaryColor"
                    class="badge"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      data-tip
                      data-for={String(e.id)}
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <ReactTooltip id={String(e.id)} place="right" effect="solid">
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  </ReactTooltip>
                )}
              </label>
              <input
                id="renderForm-processVariableName"
                type={"range"}
                min="0"
                max={e.ratingScale}
                disabled={disabledStatus}
                className="form-control-range"
                style={{
                  height: "100%",
                  width: "100%",
                }}
                // value={formData[e.processVariableName]}
                defaultValue={formData[e.processVariableName]}
                {...register(processDataVariable, {
                  required: disabledStatus ? null : JSON.parse(e.required),
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
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 1.2 * 100}%`,
                height: `${(e.h / 10) * 1.2 * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(t(e.fieldName))}
                {String(e.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {errors[processDataVariable] && (
                  <span
                    className="secondaryColor"
                    class="badge"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      data-tip
                      data-for={String(e.id)}
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <ReactTooltip id={String(e.id)} place="right" effect="solid">
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  </ReactTooltip>
                )}
              </label>

              <Controller
                control={control}
                defaultValue={formData[e.processVariableName]}
                name={e.processVariableName}
                rules={{
                  required: disabledStatus ? null : JSON.parse(e.required),
                }}
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <Rating
                      allowHalfIcon
                      transition
                      iconsCount={e.ratingScale}
                      onClick={(elem) => {
                        onChange(() =>
                          captureValue(
                            elem,
                            e.processVariableName,
                            e.prefix,
                            e.suffix,
                            "",
                            formElementType.rating,
                            e.ratingType
                          )
                        );
                        // )
                      }}
                      initialValue={
                        Number(formData[e.processVariableName]) / 20 || 0
                      }
                      isDisabled={disabledStatus}
                      // ratingValue={Number(formData[e.processVariableName] * 20)}
                      id="renderForm-rating"
                    />
                  );
                }}
              />
            </div>
          );
        }
      }

      case formElementType.file: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        let allowedFileTypes;
        let allowedFileTypesArr;

        if (e.allowedFileTypes && e.allowedFileTypes.length != 0) {
          allowedFileTypesArr = e.allowedFileTypes.map((type) => {
            return `.${type}`;
          });
          allowedFileTypes = allowedFileTypesArr.toString();
        } else {
          const FileType = [
            ".jpg",
            ".png",
            ".jpeg",
            ".mp4",
            ".avi",
            ".pdf",
            ".doc",
            ".docx",
            ".xml",
          ];
          allowedFileTypesArr = FileType;
          allowedFileTypes = FileType.toString();
        }
        const determineFileErrors = (elem, e) => {
          //middleware for fileupload Dyanamic errors, currently its dummy
          const file = elem.target.files[0];
          const extension = file.name.split(".").pop();
          const isAllowed = allowedFileTypesArr.some((type) => {
            const allowedType = type.toLowerCase().replace(".", "");
            return allowedType === extension.toLowerCase();
          });

          if (!isAllowed) {
            const errorMessage = "Invalid file type";
            setError(errorMessage);
            setIsOpen(true);
            elem.target.value = null;
          } else {
            captureValue(elem, e.processVariableName, e.prefix, e.suffix);
            setError(null);
          }
          // captureValue(elem, e.processVariableName, e.prefix, e.suffix);
        };

        let arrFormdataKeys = Object.keys(formData);
        if (
          arrFormdataKeys.includes(e.processVariableName) &&
          (formData[e.processVariableName] != null ||
            formData[e.processVariableName] != undefined)
        ) {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 1.2 * 100}%`,
                height: `${(e.h / 10) * 1.2 * 100}%`,
                width: `${(e.w / 24) * 100}%`,
              }}
            >
              <label className="fieldLable secondaryColor">
                {parse(t(e.fieldName))}
                {String(e.required) == "true" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <label class="custom-file-upload secondaryColor">
                {formData[e.processVariableName] ? (
                  <span
                    className="secondaryColor"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Download File{" "}
                    <button
                      style={{
                        color: "rgba(17, 169, 255, 0.5)",
                        background: "transparent",
                      }}
                    >
                      <Icon
                        id="renderForm-iconDownload"
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
                      />
                    </button>
                  </span>
                ) : (
                  "Drag & Drop to upload"
                )}
              </label>
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
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {parse(t(e.fieldName))}
              {String(e.required) == "true" && (
                <span style={{ color: "red" }}>*</span>
              )}
              {errors[processDataVariable] && (
                <span
                  className="secondaryColor"
                  class="badge"
                  style={{ color: "red", cursor: "pointer" }}
                >
                  <Icon
                    icon="clarity:info-standard-line"
                    height="15"
                    alt="info"
                    data-tip
                    data-for={String(e.id)}
                    onMouseEnter={() => handleInfo(e.id)}
                    onMouseLeave={() => handleInfo("")}
                  />
                </span>
              )}
              {isShown == e.id && (
                <ReactTooltip id={String(e.id)} place="right" effect="solid">
                  <small className="requiredTextColor">
                    <b>
                      Please enter your{" "}
                      {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                    </b>
                  </small>
                </ReactTooltip>
              )}
            </label>

            <label class="custom-file-upload secondaryColor">
              <input
                type={e.elementType}
                accept={allowedFileTypes}
                disabled={disabledStatus}
                className={
                  // ("form-control-file",
                  // errors[processDataVariable] ? "is-invalid" : "")
                  "custom-file-input"
                }
                id={e.id}
                style={{
                  width: "auto",
                  textAlign: "center",
                }}
                // value={formData[e.processVariableName]}
                // defaultValue={formData[e.processVariableName]}
                {...register(processDataVariable, {
                  required: disabledStatus ? null : JSON.parse(e.required),
                })}
                onChange={(elem) => {
                  determineFileErrors(elem, e);
                }}
              />
            </label>
          </div>
        );
      }

      case formElementType.image: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            <label className="fieldLable secondaryColor">
              {/* {parse(e.fieldName)} */}
              {/* {String(e.required) == "true" && (
                <span style={{ color: "red" }}>*</span>
              )} */}
              {/* {errors[processDataVariable] && (
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
                errors[processDataVariable] ? "is-invalid" : "")
              }
              // required={e.required}
              style={{
                height: "100%",
                width: "100%",
              }}
              value={formData[e.processVariableName]}
              // defaultValue={formData[e.processVariableName]}
              {...register(processDataVariable, {
                required: disabledStatus ? null : JSON.parse(e.required),
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
              crossOrigin="anonymous"
            />
          </div>
        );
      }

      case formElementType.checkbox: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        return (
          <div
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            <div>
              <label className="fieldLable secondaryColor">
                {parse(t(e.fieldName))}
                {String(e.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {errors[processDataVariable] && (
                  <span
                    class="badge secondaryColor"
                    style={{ color: "red", cursor: "pointer" }}
                  >
                    <Icon
                      icon="clarity:info-standard-line"
                      height="15"
                      alt="info"
                      data-tip
                      data-for={String(e.id)}
                      onMouseEnter={() => handleInfo(e.id)}
                      onMouseLeave={() => handleInfo("")}
                    />
                  </span>
                )}
                {isShown == e.id && (
                  <ReactTooltip id={String(e.id)} place="right" effect="solid">
                    <small className="requiredTextColor">
                      <b>
                        Please enter your{" "}
                        {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                      </b>
                    </small>
                  </ReactTooltip>
                )}
              </label>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${e?.showDataCols}, auto)`,
              }}
            >
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
                      errors[processDataVariable] ? "is-invalid" : "")
                    }
                    type="checkbox"
                    // name={option.key}
                    value={option.choice}
                    // value={formData[e.processVariableName]}
                    // defaultValue={formData[e.processVariableName]}
                    defaultChecked={
                      formData[e.processVariableName] == option.choice
                    }
                    {...register(processDataVariable, {
                      required: disabledStatus ? null : JSON.parse(e.required),
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
                      disabled={disabledStatus}
                      type="checkbox"
                      className={
                        ("form-check-input",
                        errors[processDataVariable] ? "is-invalid" : "")
                      }
                      onClick={() =>
                        handleClick(option, e.maxChoices, e.processVariableName)
                      }
                      {...register(processDataVariable, {
                        required: disabledStatus
                          ? null
                          : JSON.parse(e.required),
                      })}
                      value={option.key}
                      checked={formData[e.processVariableName]?.includes(
                        option.key
                      )}
                    />
                    <label
                      style={{ marginLeft: "5px" }}
                      className="form-check-label secondaryColor"
                    >
                      {t(option.choice)}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case formElementType.qrcode: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            <div>
              <label className="fieldLable secondaryColor">
                {parse(t(e.fieldName))}
                {/* {String(e.required) == "true" ? (
                  <span style={{ color: "red" }}>*</span>
                ) : (
                  ""
                )}
                {errors[processDataVariable] && (
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
      }

      case formElementType.dataGrid: {
        return RenderDataGrid(e, disabledStatus);
      }

      case formElementType.esign: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        let arrayOfFormdataKeys = Object.keys(formData);
        if (arrayOfFormdataKeys.includes(e.processVariableName)) {
          return (
            <div
              className="form-group"
              key={e.id}
              style={{
                position: "absolute",
                paddingBottom: "30px",
                left: `${(e.x / 24) * 100}%`,
                top: `${(e.y / 10) * 1.2 * 100}%`,
                height: `${(e.h / 10) * 1.2 * 100}%`,
                width: `${(e.w / 24) * 100}%`,
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
                crossOrigin="anonymous"
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
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
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
              id="renderForm-clear-btn"
            >
              X
            </button>
          </div>
        );
      }

      case formElementType.mathExp: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        return (
          <div
            className="form-group disabled"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
              textAlign: "center",
            }}
          >
            <MathView value={e.fieldName} />
          </div>
        );
      }

      case formElementType.button: {
        const processDataVariable = e.processVariableName?.replace(".", "");
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
              textAlign: "center",
            }}
          >
            <button
              id="renderForm-formElementType-button"
              style={{
                height: "100%",
                width: "100%",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "6px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.25)",
                backgroundColor: e?.bgColor ?? "#ff5711",
              }}
              onClick={handleSubmit(() => {
                submitForm({
                  ...formData,
                  [e.processVariableName]: e.actionType,
                });
              })}
            >
              {parse(
                e?.fieldName?.charAt(0).toUpperCase() + e?.fieldName?.slice(1)
              )}
            </button>
          </div>
        );
      }

      case formElementType.link: {
        return (
          <div
            className="form-group"
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            {e.fieldName && (
              <a href={e.linkUrl}>
                <p
                  style={{
                    backgroundColor: "transparent",
                    color: "#0D3C84",
                    padding: "10px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  {parse(e.fieldName)}
                </p>
              </a>
            )}
          </div>
        );
      }

      case formElementType.location: {
        const processDataVariable = e.processVariableName?.replace(".", "");
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
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
              textAlign: "center",
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
      }

      case formElementType.intellisheet: {
        return <RenderIntellisheet e={e} disabledStatus={disabledStatus} />;
      }

      case formElementType.section: {
        return <RenderSection e={e} disabledStatus={disabledStatus} />;
      }

      case formElementType.list: {
        return (
          <div
            className={"form-group"}
            key={e.id}
            style={{
              position: "absolute",
              paddingBottom: "30px",
              left: `${(e.x / 24) * 100}%`,
              top: `${(e.y / 10) * 1.2 * 100}%`,
              height: `${(e.h / 10) * 1.2 * 100}%`,
              width: `${(e.w / 24) * 100}%`,
            }}
          >
            <RenderList
              listProperties={e}
              formData={formData}
              captureValue={captureValue}
              errors={errors}
              setformData={setformData}
              register={register}
            />
          </div>
        );
      }

      default:
        break;
    }
  };
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();

  const fetchImage = async () => {
    const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
      formLayout?.formProperties?.backgroundImage
    }?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const imageBlob = await response.blob();

      const imageFile = new File([imageBlob], "image.jpg", {
        type: "image/jpg",
      });

      setGenerateBackgroundImage(imageFile);
    } catch (error) {
      console.error(error);
      setGenerateBackgroundImage(null);
    }
  };

  useEffect(() => {
    if (formLayout?.formProperties?.backgroundImage?.length > 0) {
      fetchImage();
    }
  }, [formLayout]);

  const renderContainerStyle = {
    height: "100%",
    position: "relative",
    fontFamily: `${formLayout?.formProperties?.fontFamily}`,
  };

  if (formLayout?.formProperties?.backgroundColor?.length > 0) {
    renderContainerStyle.backgroundColor =
      formLayout?.formProperties?.backgroundColor;
  } else if (
    formLayout?.formProperties?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  ) {
    renderContainerStyle.backgroundImage = `url(${URL.createObjectURL(
      generateBackgroundImage
    )})`;
    renderContainerStyle.backgroundRepeat = "no-repeat";
    renderContainerStyle.backgroundSize = "cover ";
  }

  const renderNormalLoader = () => {
    return (
      <Modal open={loading} showCloseIcon={false} center>
        <Row>
          <div class="thank-you-pop">
            <div className="activity-indicator" />
            <h1 className="primaryColor">{endpoint}</h1>
            <p className="secondaryColor">Loading please wait...</p>
          </div>
        </Row>
      </Modal>
    );
  };

  const renderCustomLoader = () => {
    return (
      <Modal open={loading} showCloseIcon={false} center>
        <div
          class="thank-you-pop"
          style={{
            backgroundColor: customLoader?.modalBackgroundColor || "",
          }}
        >
          <div
            className="activity-indicator"
            style={{
              borderTopColor: customLoader?.loaderColor || "gray",
            }}
          />
          <h1
            className={customLoader?.headingTextColor ? "" : "primaryColor"}
            style={{
              color: customLoader?.headingTextColor || "",
            }}
          >
            {customLoader?.headingText || "endpoint"}
          </h1>
          <p
            className={
              customLoader?.descriptionTextColor ? "" : "secondaryColor"
            }
            style={{
              color: customLoader?.descriptionTextColor || "",
            }}
          >
            {customLoader?.descriptionText || "Loading please wait..."}
          </p>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {/* <div
        style={{
          height: "85vh",
          overflowY: "auto",
          position: "absolute",
          width: "calc((100vw - 300px) - 120px)",
        }}
        className="customScrollBar"
      > */}
      <div
        className="RenderForm-Container customScrollBar"
        style={renderContainerStyle}
      >
        {renderFormElement()}
      </div>
      <div className="groupBtnDiv">
        {showDefaultSave == true && (
          <div className="RenderFormBtn">
            <button
              onClick={handleSubmit(() => submitForm({ ...formData }))}
              className="saveBtnForm primaryButtonColor"
              id="renderForm-save-btn"
            >
              Save
            </button>
          </div>
        )}
        {formLayout.claim == true && (
          <div className="RenderFormBtn">
            <button
              className="ClaimBtn secondaryButtonColor"
              id="renderForm-claim-btn"
            >
              Claim
            </button>
          </div>
        )}
      </div>
      {/* </div> */}
      <CommonModelContainer
        modalTitle=""
        show={showCode}
        handleClose={onCloseModal}
        className="thank-you-pop blur"
      >
        <>
          <button className="close-button" onClick={onCloseModal}>
            X
          </button>
          <img
            src="http://goactionstations.co.uk/wp-content/uploads/2017/03/Green-Round-Tick.png"
            alt=""
          />
          <h1 className="primaryColor">{endpoint}</h1>
          <p className="secondaryColor">Application submitted successfully</p>
        </>
      </CommonModelContainer>

      {Object.keys(customLoader).length ? (
        customLoader?.showLoader ? (
          <>
            {customLoader?.useDefaultLoader
              ? renderNormalLoader()
              : renderCustomLoader()}
          </>
        ) : null
      ) : (
        renderNormalLoader()
      )}

      <CommonModelContainer
        modalTitle="Invalid File Type"
        show={isOpen}
        handleClose={handleClose}
        className="delete-modal"
        id="fileType-modal"
      >
        <h6 className="renderForm-fileType-body primaryColor">
          <div>
            <span className="renderForm-fileType-alertIcon secondaryColor">
              <Icon
                style={{ height: 30, width: 30 }}
                icon="solar:danger-triangle-linear"
              />
            </span>
            Please choose correct file type
          </div>
        </h6>
        <div className="renderForm-fileType-okbutton">
          <button
            className="deletednmprimaryButton primaryButtonColor"
            id="renderForm-fileType-button"
            onClick={handleClose}
          >
            OK
          </button>
        </div>
      </CommonModelContainer>
    </>
  );
};

export default RenderForm;
