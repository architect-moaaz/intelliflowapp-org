import LoginTabPane from "./LoginTabPane";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import LoginFormPreview from "./LoginFormPreview";
import { useRecoilState } from "recoil";
import {
  openFilesState,
  formbuilderErrorsState,
  loggedInUserState,
} from "../../state/atom";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as Preview } from "../../assets/NewIcon/Preview.svg";
import "./ForgotPasswordCustom.css";

const LoginTabPaneContainer = ({
  data,
  elements,
  renderElements,
  setheaderTitle,
}) => {
  // setheaderTitle("Login Page Customize");

  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );

  const [open, setOpen] = useState(false);
  const randomNum = Math.round(Math.random() * 999999999);
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const date = today.toISOString();

  const [layout, setLayout] = useState({
    layout: [
      {
        x: 0,
        y: 0,
        w: 8,
        h: 1,
        i: 1,
        id: 1,
        elementType: "text",
        fieldType: "Email",
        placeholder: "Enter Email Address",
        required: false,
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: "Email",
        date: date,
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
        ratingType: "star",
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: null,
        minLength: null,
        maxLength: null,
        dateRangeStart: date,
        dateRangeEnd: date,
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
        actionType: null,
        selectedDataModel: null,
        selectedDataField: null,
        bgColor: null,
        toolTip: null,
        useTime: false,
        timeFormat: "hh:mm",
        dateFormat: "dd MMMM yyyy",
      },
      {
        x: 0,
        y: 0,
        w: 8,
        h: 1,
        i: 2,
        id: 2,
        elementType: "text",
        fieldType: "Password",
        placeholder: "Enter Password",
        required: false,
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: "Password",
        date: date,
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
        ratingType: "star",
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: null,
        minLength: null,
        maxLength: null,
        dateRangeStart: date,
        dateRangeEnd: date,
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
        actionType: null,
        selectedDataModel: null,
        selectedDataField: null,
        bgColor: null,
        toolTip: null,
        useTime: false,
        timeFormat: "hh:mm",
        dateFormat: "dd MMMM yyyy",
      },
      {
        x: 0,
        y: 0,
        w: 5,
        h: 1,
        i: 3,
        id: 3,
        elementType: "button",
        fieldType: "text",
        placeholder: "",
        required: false,
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: "Login",
        date: date,
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
        ratingType: "star",
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: null,
        minLength: null,
        maxLength: null,
        dateRangeStart: date,
        dateRangeEnd: date,
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
        actionType: null,
        selectedDataModel: null,
        selectedDataField: null,
        bgColor: null,
        toolTip: null,
        useTime: false,
        timeFormat: "hh:mm",
        dateFormat: "dd MMMM yyyy",
      },
      {
        y: 1,
        x: 0,
        w: 2,
        h: 1,
        i: 326392322,
        id: 326392322,
        elementType: "link",
        fieldType: "text",
        placeholder: null,
        required: false,
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: "Forgot Password",
        date: date,
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
        ratingType: "star",
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: null,
        minLength: null,
        maxLength: null,
        dateRangeStart: date,
        dateRangeEnd: date,
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
        actionType: null,
        selectedDataModel: null,
        selectedDataField: null,
        bgColor: null,
        toolTip: null,
        useTime: false,
        timeFormat: "hh:mm",
        dateFormat: "dd MMMM yyyy",
        formula: "",
        moved: false,
        static: false,
        linkUrl: "/forgotPasswordCustom",
        stack: [],
      },
    ],
  });
  const [element, setElement] = useState(null);
  const [formPreviewData, setFormPreviewData] = useState([]);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const workspacename = localStorage.getItem("workspace");

  // console.log("workspacenamehjkl;", workspacename);
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const layoutTemp = layout?.layout?.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            setElement({ ...stackTemp[0] });
          } else {
            setElement({ ...item });
          }
        } else {
          setElement({ ...item });
        }
      }
    });
  }, [layout]);

  async function getData() {
    axios
      .get(
        `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/Login/customLogin/${workspacename}/login`
      )
      .then((res) => {
        console.log(res.data.loginpage[0].formData);

        if (res.data.loginpage[0].formData.length) {
          setLayout({ layout: [...res.data.loginpage[0].formData] });
        } else {
          setLayout({
            layout: [
              {
                x: 0,
                y: 0,
                w: 8,
                h: 1,
                i: 1,
                id: 1,
                elementType: "text",
                fieldType: "email",
                placeholder: "Enter Email Address",
                required: false,
                isWholeNumber: null,
                isDecimalNumber: null,
                edit: false,
                multiSelect: false,
                VAxis: false,
                minChoices: null,
                maxChoices: null,
                choices: [],
                fieldName: null,
                date: date,
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
                ratingType: "star",
                ratingScale: 5,
                rating: null,
                fileType: null,
                minFilesLimit: null,
                maxFilesLimit: null,
                minFileSize: null,
                maxFileSize: null,
                processVariableName: null,
                minLength: null,
                maxLength: null,
                dateRangeStart: date,
                dateRangeEnd: date,
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
                actionType: null,
                selectedDataModel: null,
                selectedDataField: null,
                bgColor: null,
                toolTip: null,
                useTime: false,
                timeFormat: "hh:mm",
                dateFormat: "dd MMMM yyyy",
              },
              {
                x: 0,
                y: 0,
                w: 8,
                h: 1,
                i: 2,
                id: 2,
                elementType: "text",
                fieldType: "password",
                placeholder: "Enter Password",
                required: false,
                isWholeNumber: null,
                isDecimalNumber: null,
                edit: false,
                multiSelect: false,
                VAxis: false,
                minChoices: null,
                maxChoices: null,
                choices: [],
                fieldName: null,
                date: date,
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
                ratingType: "star",
                ratingScale: 5,
                rating: null,
                fileType: null,
                minFilesLimit: null,
                maxFilesLimit: null,
                minFileSize: null,
                maxFileSize: null,
                processVariableName: null,
                minLength: null,
                maxLength: null,
                dateRangeStart: date,
                dateRangeEnd: date,
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
                actionType: null,
                selectedDataModel: null,
                selectedDataField: null,
                bgColor: null,
                toolTip: null,
                useTime: false,
                timeFormat: "hh:mm",
                dateFormat: "dd MMMM yyyy",
              },
              {
                x: 0,
                y: 0,
                w: 5,
                h: 1,
                i: 3,
                id: 3,
                elementType: "button",
                fieldType: "text",
                placeholder: "",
                required: false,
                isWholeNumber: null,
                isDecimalNumber: null,
                edit: false,
                multiSelect: false,
                VAxis: false,
                minChoices: null,
                maxChoices: null,
                choices: [],
                fieldName: "Login",
                date: date,
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
                ratingType: "star",
                ratingScale: 5,
                rating: null,
                fileType: null,
                minFilesLimit: null,
                maxFilesLimit: null,
                minFileSize: null,
                maxFileSize: null,
                processVariableName: null,
                minLength: null,
                maxLength: null,
                dateRangeStart: date,
                dateRangeEnd: date,
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
                actionType: null,
                selectedDataModel: null,
                selectedDataField: null,
                bgColor: null,
                toolTip: null,
                useTime: false,
                timeFormat: "hh:mm",
                dateFormat: "dd MMMM yyyy",
              },
              {
                y: 1,
                x: 0,
                w: 2,
                h: 1,
                i: 326392322,
                id: 326392322,
                elementType: "link",
                fieldType: "text",
                placeholder: null,
                required: false,
                isWholeNumber: null,
                isDecimalNumber: null,
                edit: false,
                multiSelect: false,
                VAxis: false,
                minChoices: null,
                maxChoices: null,
                choices: [],
                fieldName: "Forgot Password",
                date: date,
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
                ratingType: "star",
                ratingScale: 5,
                rating: null,
                fileType: null,
                minFilesLimit: null,
                maxFilesLimit: null,
                minFileSize: null,
                maxFileSize: null,
                processVariableName: null,
                minLength: null,
                maxLength: null,
                dateRangeStart: date,
                dateRangeEnd: date,
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
                actionType: null,
                selectedDataModel: null,
                selectedDataField: null,
                bgColor: null,
                toolTip: null,
                useTime: false,
                timeFormat: "hh:mm",
                dateFormat: "dd MMMM yyyy",
                formula: "",
                moved: false,
                static: false,
                linkUrl: "/forgotPasswordCustom",
                stack: [],
              },
            ],
          });
        }
      })
      .catch((e) => {
        console.log("Error ", e);
      });
  }

  // ****************************Form Preview******************************

  const onPreview = () => {
    const elementsWithoutPropFieldName = layout.layout.filter(
      (item) => item.elementType !== "image"
    );

    const elementsWithoutFieldName = elementsWithoutPropFieldName.filter(
      (item) => item.fieldName === "" || item.fieldName === null
    );

    const elementsWithPropDataVariable = layout.layout.filter(
      (item) =>
        item.elementType !== "label" &&
        item.elementType !== "section" &&
        item.elementType !== "list" &&
        item.elementType !== "image" &&
        item.elementType !== "location" &&
        item.elementType !== "qrcode" &&
        item.elementType !== "mathexp" &&
        item.elementType !== "link" &&
        item.elementType !== "intellisheet"
    );

    const elementsWithoutDataVariable = elementsWithPropDataVariable.filter(
      (item) =>
        item.processVariableName === null || item.processVariableName === ""
    );

    const elementsWithRating = layout.layout.filter(
      (item) => item.elementType === "rating"
    );

    const ratingElementsWithoutRatingType = elementsWithRating.filter(
      (item) => item.ratingType == null
    );

    const elementsWithActionType = layout.layout.filter(
      (item) => item.elementType === "button"
    );

    const buttonElementsWithoutActionType = elementsWithActionType.filter(
      (item) => item.actionType === null || item.actionType === ""
    );

    if (
      elementsWithoutDataVariable[0] ||
      elementsWithoutFieldName[0] ||
      ratingElementsWithoutRatingType[0] ||
      buttonElementsWithoutActionType[0]
    ) {
    } else {
      setFormbuilderErrors({
        ...formbuilderErrors,
        forms: {
          ...formbuilderErrors.forms,
          [data.resourceName]: {
            fieldNameErrors: [],
            dataVariableErrors: [],
            ratingFieldErrors: [],
            actionTypeErrors: [],
          },
        },
      });
    }
  };

  const [openModelOne, setOpenModelOne] = useState(false);

  const onOpenModalOne = () => {
    onPreview();
    setOpenModelOne(true);
    setFormPreviewData(layout.layout);
  };

  const oncloseModelOne = (e) => {
    setOpenModelOne(e);
  };

  // **************************************************************************

  //image uploader CDS starts here

  const imageUploader = async (item) => {
    const imageUploaderPromise = new Promise((resolve, reject) => {
      const appName = localStorage.getItem("appName");
      var bodyFormData = new FormData();
      bodyFormData.append("file", item.imageUrl);

      var config = {
        method: "post",
        url: `${
          process.env.REACT_APP_CDS_ENDPOINT + "app"
        }/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: bodyFormData,
      };

      axios(config)
        .then(function (response) {
          console.log("response.data", response.data);
          resolve(response.data);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });

    return imageUploaderPromise;
  };

  const allImagesUploader = async () => {
    for (let i = 0; i < layout.layout.length; i++) {
      if (
        layout.layout[i].elementType == "image" &&
        layout.layout[i].isUrlAvailable == false
      ) {
        const data = await imageUploader(layout.layout[i]);
        layout.layout[
          i
        ].imageUrl = `${data.file.bucketName}/image/${data.file.filename}`;
        layout.layout[i].isUrlAvailable = true;
        layout.layout[i].imageDataTemp = null;
      }
    }
    setLayout(layout);

    console.log("layout-login", layout);
  };

  //image uploader CDS ends here

  const onSaves = async () => {
    const elementsWithoutPropFieldName = layout.layout.filter(
      (item) => item.elementType !== "image"
    );

    const elementsWithoutFieldName = elementsWithoutPropFieldName.filter(
      (item) => item.fieldName === "" || item.fieldName === null
    );
    const axios = require("axios");
    let data = JSON.stringify([...layout.layout]);
    const id = toast.loading("Saving Custom Login Page....");
    await allImagesUploader();
    let config = {
      method: "post",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/misc/saveLoginPage/login",
      headers: {
        workspace: localStorage.getItem("workspace"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));

        toast.update(id, {
          render: "Custom Login Page Created Successfully!",
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="loginCustomContainer-body">
        <LoginTabPane
          layout={layout}
          setLayout={setLayout}
          element={element}
          setElement={setElement}
          elements={elements}
          renderElements={renderElements}
          open={open}
        />
        <div className="loginCustom-rightside-menu BodyColor">
          <ul className="appdesigner-rightside-menu-link">
            <li>
              <Link
              to="#"
                id="right-side-save-btn"
                onClick={() => {
                  onSaves();
                }}
                data-tip
                data-for="save"
              >
                <Save className="svg-stroke" />
              </Link>
              <ReactTooltip
                id="save"
                place="left"
                className="tooltipCustom"
                arrowColor="rgba(0, 0, 0, 0)"
                effect="solid"
              >
                Save
              </ReactTooltip>
            </li>
            <li>
              <Link
              to="#"
                id="right-side-preview-btn"
                onClick={onOpenModalOne}
                data-tip
                data-for="Preview"
              >
                <Preview className="svg-stroke" />
              </Link>
              <ReactTooltip
                id="Preview"
                place="left"
                className="tooltipCustom"
                arrowColor="rgba(0, 0, 0, 0)"
                effect="solid"
              >
                Preview
              </ReactTooltip>
              <LoginFormPreview
                openModelOne={openModelOne}
                closeModelOne={oncloseModelOne}
                layout={formPreviewData}
              />
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default LoginTabPaneContainer;
