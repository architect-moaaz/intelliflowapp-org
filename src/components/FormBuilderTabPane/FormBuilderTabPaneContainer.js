import { Icon } from "@iconify/react";
import { render } from "@testing-library/react";
import axios from "axios";
import imageCompression from "browser-image-compression";
import FontPicker from "font-picker-react";
import json5 from "json5";
import React, { useContext, useEffect, useRef, useState } from "react";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import rgbHex from "rgb-hex";
import {
  GroupIcon,
  LogoIcon,
  MapIcon,
  PlayIcon,
  downloadCs,
} from "../../assets";
import { ReactComponent as Delete } from "../../assets/NewIcon/Delete.svg";
import { ReactComponent as Download1 } from "../../assets/NewIcon/Download-1.svg";
import { ReactComponent as Duplicate } from "../../assets/NewIcon/Duplicate.svg";
import { ReactComponent as EditProperties } from "../../assets/NewIcon/EditProperties.svg";
import { ReactComponent as ImageUpload } from "../../assets/NewIcon/Image.svg";
import { ReactComponent as Mapping } from "../../assets/NewIcon/Mapping.svg";
import { ReactComponent as Overview } from "../../assets/NewIcon/Overview.svg";
import { ReactComponent as Preview } from "../../assets/NewIcon/Preview.svg";
import { ReactComponent as Redo } from "../../assets/NewIcon/Redo.svg";
import { ReactComponent as Remove } from "../../assets/NewIcon/Remove.svg";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as SaveAsADraft } from "../../assets/NewIcon/SaveAsADraft.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import { ReactComponent as UploadFormProp } from "../../assets/NewIcon/UploadFormProp.svg";
import {
  autoSave,
  formbuilderErrorsState,
  isSavingEnabledState,
  loggedInUserState,
  openFilesState,
} from "../../state/atom";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import FormMapping from "../FormMapping/FormMapping";
import RenderFormPreview from "../IFApp/Form/RenderFormPreview";
import FormBuilderTabPane from "./FormBuilderTabPane";
import "./FormBuilderTabPaneContainer.css";
import { v4 as uuidv4 } from "uuid";
import ImageLoader from "../ImageLoader/ImageLoader";

const FormBuilderTabPaneContainer = ({
  data,
  elements,
  isDisplayError,
  showErrors,
  templateElements,
  renderElements,
  doGetAllResources,
  closeFileInTab,
}) => {
  const [t, i18n] = useTranslation("common");
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );

  const [open, setOpen] = useState(false);
  const [save, setSave] = useState(false);
  const [formSaveDraft, setFormSaveDraft] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(
    data.resourceName.replace(/\.[^/.]+$/, "")
  );
  const [showFormProperties, setShowFromProperties] = useState(false);
  const [layout, setLayout] = useState({
    layout: [],
  });
  const [element, setElement] = useState(null);
  const [formPreviewData, setFormPreviewData] = useState([]);
  const [claim, setClaim] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateFormName, setDuplicateFormName] = useState("");
  const [err, setErr] = useState(false);
  const [formComment, setFormComment] = useState("");
  const [compactPicker, setCompactPicker] = useState("#00000");
  const [backcompactPicker, setBackCompactPicker] = useState("rgba(0,0,0,1)");
  const [formProp, setFormProperties] = useState({
    customLoader: { useDefaultLoader: true },
  });
  const [showBackColorPicker, setShowBackColorPicker] = useState(false);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const AutosaveFrequency = localStorage.getItem("AutoSaveFrequency");
  const AutoSavefeature =
    localStorage.getItem("AutoSavefeature") == "true" ? true : false;
  const [isSavingEnabled, setSavingEnabled] =
    useRecoilState(isSavingEnabledState);
  const [pageSaved, setPageSaved] = useState(1);
  const [uploadedBackImg, setUploadedBackImg] = useState(null);
  const [isBackImgUploaded, setIsBackImgUploaded] = useState(false);
  const [backPreview, setBackPreview] = useState("");
  const [selectFontFamily, setSelectFontFamily] = useState("Arial");
  const [dataModels, setDataModels] = useState(null);
  const [dataFields, setDataFields] = useState([]);
  const [dataFieldsOnLoad, setDataFieldsOnLoad] = useState([]);
  let { valueToHex } = useColorPicker(compactPicker, setCompactPicker);
  const [condition, setCondition] = useState({});
  const [conditionOnLoad, setConditionOnLoad] = useState({});
  const [useSession, setUseSession] = useState(false);
  const [useSessionOnLoad, setUseSessionOnLoad] = useState(false);
  const [placeholderChange, setPlaceholderChange] = useState([]);
  const [placeholderChangeOnLoad, setPlaceholderChangeOnLoad] = useState([]);

  const [undoArray, setUndoArray] = useState([]);
  const [redoArray, setRedoArray] = useState([]);
  const uniqueIndex = uuidv4();
  const [backGrounduniqueIndex, setBackGrounduniqueIndex] =
    useState(uniqueIndex);

  useEffect(() => {
    if (!uploadedBackImg) {
      setBackPreview(undefined);
      return;
    }
    const backObjectUrl = URL.createObjectURL(uploadedBackImg);
  }, []);

  // useEffect(() => {
  //   const hexString = `#${rgbHex(backcompactPicker)}`;
  //   const backColor = () => {
  //     document.execCommand("backColor", false, hexString)
  //   }
  //   backColor()
  // }, [backcompactPicker])

  useEffect(() => {
    loadForm();
  }, []);

  const loadForm = () => {
    const json5 = require("json5");
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName,
      fileType: "form",
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((res) => {
        const parseData = res.data.data;
        var dataInput = json5.parse(parseData);
        var formSavedData = dataInput?.formProperties;
        setClaim(dataInput.claim ? dataInput.claim : false);
        var dataInput = dataInput.formData ? dataInput.formData : dataInput;

        var filtered = dataInput.filter(function (el) {
          return el.fieldType != "serialVersionUID = 1L";
        });
        filtered.forEach((e) => {
          e.x = parseInt(e.x);
          e.y = parseInt(e.y);
          e.h = parseInt(e.h);
          e.w = parseInt(e.w);
          if (!e.toolTip) {
            e.toolTip = "";
          }
          if (e.required == "") {
            e.required = false;
          }
          e.accessibility = e.accessibility;
          if (e.elementType == "String") {
            e.elementType = "text";
            e.fieldType = "text";
          } else if (e.elementType == "Integer") {
            e.elementType = "number";
          } else if (e.elementType == "Object") {
            e.elementType = "date";
          }
        });
        setLayout({
          layout: [...filtered],
        });
        setFormProperties(formSavedData || {});
      })
      .catch((e) => console.log("Error ", e));
  };

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

  const handleShowBackColorPicker = () => {
    setShowBackColorPicker(!showBackColorPicker);
  };

  const handleBackgroundColorPicker = (backColor) => {
    handleRemoveUploadImage();
    setBackCompactPicker(backColor);
    setFormProperties((item) => {
      return {
        ...item,
        backgroundColor: backColor,
        backgroundImage: "",
      };
    });
    setBackGrounduniqueIndex(uniqueIndex);
  };

  let handleRemoveBackgroundColor = () => {
    setBackCompactPicker("rgba(0,0,0,1)");
    const tempProp = { ...formProp };
    delete tempProp.backgroundColor;
    setFormProperties(tempProp);
    setBackGrounduniqueIndex(uniqueIndex);
  };

  const handleSelectFontFamily = (e) => {
    setSelectFontFamily(e.family);
    setFormProperties((item) => {
      return {
        ...item,
        fontFamily: e.family,
      };
    });
    setBackGrounduniqueIndex(uniqueIndex);
    // document.execCommand("fontName", false, e.family);
    // e.preventDefault();
  };

  const uploadBackgroundImage = async (e) => {
    if (e) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 450,
        useWebWorker: true,
      };

      let uploadedBackground;
      await imageCompression(e, options).then((x) => {
        uploadedBackground = x;
      });
      const formData = new FormData();
      formData.append("file", uploadedBackground);
      await axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            logoName:
              localStorage.getItem("workspace") +
              localStorage.getItem("appName") +
              localStorage.getItem("selectedForm").replace(/\.[^/.]+$/, "") +
              "FormProperty",
          },
        }
      );
    }
  };

  const handleUploadBackImage = (e) => {
    handleRemoveBackgroundColor();
    setUploadedBackImg(e.target.files[0]);
    uploadBackgroundImage(e.target.files[0]);
    setFormProperties((item) => {
      return {
        ...item,
        backgroundImage:
          localStorage.getItem("workspace") +
          localStorage.getItem("appName") +
          localStorage.getItem("selectedForm").replace(/\.[^/.]+$/, "") +
          "FormProperty",
        backgroundColor: "",
      };
    });
    setIsBackImgUploaded(true);
    setBackGrounduniqueIndex(uniqueIndex);
  };

  let handleRemoveUploadImage = () => {
    setUploadedBackImg(null);
    setIsBackImgUploaded(false);
    const tempProp = { ...formProp };
    delete tempProp.backgroundImage;
    setFormProperties(tempProp);
    setBackGrounduniqueIndex(uniqueIndex);
    console.log("handleRemoveUploadImage");
  };

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleSavedraft = () => {
    // setSave(true)
    setFormSaveDraft(true);
  };

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
      // toast.error(
      //   `There are errors in the form, please click on the errors to view details`,
      //   {
      //     position: "bottom-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //   }
      // );
      setFormbuilderErrors({
        ...formbuilderErrors,
        forms: {
          ...formbuilderErrors.forms,
          [data.resourceName]: {
            fieldNameErrors: [...elementsWithoutFieldName],
            dataVariableErrors: [...elementsWithoutDataVariable],
            ratingFieldErrors: [...ratingElementsWithoutRatingType],
            actionTypeErrors: [...buttonElementsWithoutActionType],
          },
        },
      });
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
      // toast.success("No Errors found in the form, Uploading the form", {
      //   position: "bottom-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
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

  const handleCall = (MainbodySection) => {
    setOpen(MainbodySection);
  };

  //image uploader CDS starts here

  const imageUploader = async (item) => {
    const imageUploaderPromise = new Promise((resolve, reject) => {
      const appName = localStorage.getItem("appName");
      var bodyFormData = new FormData();
      bodyFormData.append("file", item.imageUrl);

      var config = {
        method: "post",
        url: `${
          process.env.REACT_APP_CDS_ENDPOINT + appName
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
          resolve(response.data);
        })
        .catch(function (error) {
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
  };

  //image uploader CDS ends here

  // ------------------------------------------------------------------------------------------

  async function onSave(autoSaveData = false) {
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
      if (autoSaveData == false) {
        toast.error(
          t(
            `There are errors in the form, please click on the errors to view details`
          ),
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
      setFormbuilderErrors({
        ...formbuilderErrors,
        forms: {
          ...formbuilderErrors.forms,
          [data.resourceName]: {
            fieldNameErrors: [...elementsWithoutFieldName],
            dataVariableErrors: [...elementsWithoutDataVariable],
            ratingFieldErrors: [...ratingElementsWithoutRatingType],
            actionTypeErrors: [...buttonElementsWithoutActionType],
          },
        },
      });
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
      if (autoSaveData == false) {
        toast.success(t("No Errors found in the form, Uploading the form"), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      await allImagesUploader();
      const tempByteData = JSON.stringify({
        formData: [...layout.layout],
        claim,
        formProperties: {
          ...formProp,
          // backgroundColor: backcompactPicker,
          // fontStyle: "asf",
          // backgoundImage: uploadedBackImg
        },
      });

      var byteData = convertStringToByteArray(tempByteData);
      const appName = localStorage
        .getItem("appName")
        .replace(/\s+/g, "-")
        .toLowerCase();

      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: encodeURIComponent(localStorage.getItem("appName")),
        fileName: encodeURIComponent(
          data.resourceName.replace(/\.[^/.]+$/, "")
        ),
        fileType: "form",
        fileContent: byteData,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/formmodeller/createFile",
          inputJson
        )
        .then((res) => {
          if (autoSaveData == false) {
            toast.success(t("Form saved Successfully"), {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
          const postData = {
            workspaceName: localStorage.getItem("workspace"),
            miniApp: localStorage.getItem("appName"),
            fileName: data.resourceName,
            fileType: data.resourceType,
            userId: localStorage.getItem("username"),
          };
          axios
            .post(
              process.env.REACT_APP_MODELLER_API_ENDPOINT +
                "modellerService/releaseAsset",
              postData
            )
            .then((res) => console.log(res));
        })
        .catch((e) => console.log("Error : ", e));
    }
  }

  useEffect(() => {
    let autoSaveInterval = null;
    if (AutoSavefeature) {
      autoSaveInterval = setInterval(() => {
        renderOnSave();
      }, (AutosaveFrequency ? AutosaveFrequency : 10) * 1000);

      return () => clearInterval(autoSaveInterval);
    } else {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    }
  }, [AutoSavefeature, pageSaved]);

  useEffect(() => {
    setPageSaved(pageSaved + 1);
  }, [layout.layout]);

  const renderOnSave = () => {
    setPageSaved((prev) => prev + 1);
    onSave(true);
  };

  const onSaveasDraft = async () => {
    // const elementsWithoutPropFieldName = layout.layout.filter(
    //   (item) => item.elementType !== "image"
    // );

    // const elementsWithoutFieldName = elementsWithoutPropFieldName.filter(
    //   (item) => item.fieldName === "" || item.fieldName === null
    // );

    // const elementsWithPropDataVariable = layout.layout.filter(
    //   (item) =>
    //     item.elementType !== "label" &&
    //     item.elementType !== "section" &&
    //     item.elementType !== "image" &&
    //     item.elementType !== "location" &&
    //     item.elementType !== "qrcode" &&
    //     item.elementType !== "mathexp" &&
    //     item.elementType !== "link"
    // );

    // const elementsWithoutDataVariable = elementsWithPropDataVariable.filter(
    //   (item) =>
    //     item.processVariableName === null || item.processVariableName === ""
    // );

    // const elementsWithRating = layout.layout.filter(
    //   (item) => item.elementType === "rating"
    // );

    // const ratingElementsWithoutRatingType = elementsWithRating.filter(
    //   (item) => item.ratingType == null
    // );

    // const elementsWithActionType = layout.layout.filter(
    //   (item) => item.elementType === "button"
    // );

    // const buttonElementsWithoutActionType = elementsWithActionType.filter(
    //   (item) => item.actionType === null || item.actionType === ""
    // );

    // if (
    //   elementsWithoutDataVariable[0] ||
    //   elementsWithoutFieldName[0] ||
    //   ratingElementsWithoutRatingType[0] ||
    //   buttonElementsWithoutActionType[0]
    // ) {
    //   toast.error(
    //     `There are errors in the form, please click on the errors to view details`,
    //     {
    //       position: "bottom-right",
    //       autoClose: 5000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //     }
    //   );
    //   setFormbuilderErrors({
    //     ...formbuilderErrors,
    //     forms: {
    //       ...formbuilderErrors.forms,
    //       [data.resourceName]: {
    //         fieldNameErrors: [...elementsWithoutFieldName],
    //         dataVariableErrors: [...elementsWithoutDataVariable],
    //         ratingFieldErrors: [...ratingElementsWithoutRatingType],
    //         actionTypeErrors: [...buttonElementsWithoutActionType],
    //       },
    //     },
    //   });
    // } else {
    //   setFormbuilderErrors({
    //     ...formbuilderErrors,
    //     forms: {
    //       ...formbuilderErrors.forms,
    //       [data.resourceName]: {
    //         fieldNameErrors: [],
    //         dataVariableErrors: [],
    //         ratingFieldErrors: [],
    //         actionTypeErrors: [],
    //       },
    //     },
    //   });
    //   toast.success("No Errors found in the form, Uploading the form", {
    //     position: "bottom-right",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });

    //   await allImagesUploader();
    const tempByteData = JSON.stringify({
      formData: [...layout.layout],
      claim,
    });
    var byteData = convertStringToByteArray(tempByteData);

    const inputJson = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
      fileType: "form",
      comment: formComment,
      fileContent: byteData,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/saveAsDraft",
        inputJson
      )
      .then((res) => {
        toast.success("Saved as draft Successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const postData = {
          workspaceName: localStorage.getItem("workspace"),
          miniApp: localStorage.getItem("appName"),
          fileName: data.resourceName,
          fileType: data.resourceType,
          userId: localStorage.getItem("username"),
        };
        axios
          .post(
            process.env.REACT_APP_MODELLER_API_ENDPOINT +
              "modellerService/releaseAsset",
            postData
          )
          .then((res) => {
            setFormSaveDraft(false);
          });
      })
      .catch((e) => console.log("Error : ", e));
    // }
  };

  const convertStringToByteArray = (str) => {
    String.prototype.encodeHex = function () {
      var bytes = [];
      for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
      }
      return bytes;
    };

    var byteArray = str.encodeHex();
    return byteArray;
  };

  const openFormProperties = () => {
    setShowFromProperties(true);
  };

  const closeFormProperties = () => {
    setShowFromProperties(false);
    setEditName(data.resourceName.replace(/\.[^/.]+$/, ""));
  };

  const handleSaveFormProperties = () => {
    EditApi();
  };

  const EditApi = async () => {
    const id = toast.loading("Editing Form....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "form",
        updatedName: editName,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/file/rename",
          inputJson
        )
        .then((response) => {
          closeFormProperties();
          doGetAllResources();
          toast.update(id, {
            render: t("Edited Name Successfully!"),
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          closeFileInTab(data);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  const openDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const deleteFile = async () => {
    const id = toast.loading("Deleting Form....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "form",
      };
      axios
        .delete(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/deleteFile",
          { data: inputJson }
        )
        .then((response) => {
          openDeleteModal();
          doGetAllResources();
          toast.update(id, {
            render: t("Deleted Form Successfully!"),
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          const tempFiles = openFiles.filter(
            (item) => item.resourceName !== data.resourceName
          );
          setOpenFiles([...tempFiles]);
        });
    } catch (error) {
      console.log("error", error);
      toast.update(id, {
        render: t("Failed to Delete Form!"),
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
        isLoading: false,
      });
    }
  };

  const onDuplicateModalOpen = () => {
    setShowDuplicateModal(true);
    setErr(false);
  };

  const onDuplicateModalClose = () => {
    setShowDuplicateModal(false);
    setErr(false);
  };

  const onDuplicateFormNameCHange = (e) => {
    setDuplicateFormName(e.target.value);
    setErr(false);
  };

  const renderDuplicate = () => {
    if (duplicateFormName) {
      const tempByteData = JSON.stringify({
        formData: [...layout.layout],
        claim,
      });
      var byteData = convertStringToByteArray(tempByteData);
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: encodeURIComponent(localStorage.getItem("appName")),
        fileType: "form",
        fileName: encodeURIComponent(duplicateFormName),
        fileContent: byteData,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/formmodeller/createFile",
          postData
        )
        .then((res) => {
          toast.success(t("Asset Added Successfully"), {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setShowDuplicateModal(false);
          setDuplicateFormName("");
          doGetAllResources();
        })
        .catch((e) => console.log(e));
      setErr(false);
    } else {
      setErr(true);
    }
  };

  const handleClaimChange = () => {
    setClaim(!claim);
  };

  useEffect(() => {
    getDataModelList();
  }, []);

  const getDataModelList = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/getResources",
        postData
      )
      .then((res) => {
        setDataModels(res.data.data.datamodel);
      })
      .catch((e) => console.log(e.message));
  };

  const renderDataModelOptions = () => {
    return dataModels?.map((item) => (
      <option value={item.resourceName}>
        {item.resourceName.replace(".java", "")}
      </option>
    ));
  };

  const handleDataModelChange = (e) => {
    let value = e.target.value;
    value = value.charAt(0).toLowerCase() + value.slice(1);
    value = value?.replace("java", "");

    setFormProperties((item) => {
      return {
        ...item,
        selectedDataModal: e.target.value?.replace(".java", ""),
      };
    });
    fetchMetaContent(e.target.value);
  };

  const fetchMetaContent = (val) => {
    if (val) {
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: val,
        fileType: "datamodel",
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/fetchFile/meta",
          postData
        )
        .then((res) => {
          if (res.data.data) {
            const data = res.data.data.replace(/\.[^/.]+$/, "");
            const jsonData = json5.parse(data);
            setDataFields([...jsonData]);
            setDataFieldsOnLoad([...jsonData]);
          } else {
            setDataFields([]);
            setDataFieldsOnLoad([]);
          }
        })
        .catch((e) => console.log(e.message));
    } else {
      setDataFields([]);
      setDataFieldsOnLoad([]);
    }
  };

  const handleuseSessionChange = () => {
    setCondition((prev) => {
      return {
        ...prev,
        operand2: "",
      };
    });
    setUseSession(!useSession);
  };

  const handleuseSessionChangeOnLoad = () => {
    setConditionOnLoad((prev) => {
      return {
        ...prev,
        operand2: "",
      };
    });
    setUseSessionOnLoad(!useSessionOnLoad);
  };

  const addFilter = (e) => {
    e.preventDefault();
    if (condition.operand1 && condition.operand2 && condition.operator) {
      let temp = {
        ...condition,
        useSession: true,
        id: Math.round(Math.random() * 999999999),
      };
      setFormProperties((item) => {
        return {
          ...item,
          filter: { ...temp },
        };
      });

      setCondition({});
    } else {
      toast.error("All Fields are necessary to add condition", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const addCondition = (e) => {
    e.preventDefault();
    if (condition.operand1 && condition.operand2 && condition.operator) {
      let temp = placeholderChange?.length ? [...placeholderChange] : [];
      temp.push({
        ...condition,
        useSession,
        id: Math.round(Math.random() * 999999999),
      });
      setPlaceholderChange([...temp]);
      setFormProperties((item) => {
        return {
          ...item,
          onLoadCondition: [...temp],
        };
      });

      setCondition({});
    } else {
      toast.error("All Fields are necessary to add condition", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const addMapDataConditions = (e) => {
    e.preventDefault();
    if (
      conditionOnLoad.operand1 &&
      conditionOnLoad.operand2 &&
      conditionOnLoad.operator
    ) {
      let temp = formProp?.mapDataConditions?.length
        ? [...formProp?.mapDataConditions]
        : [];

      temp.push({
        ...conditionOnLoad,
        id: Math.round(Math.random() * 999999999),
      });

      setFormProperties((prev) => {
        return {
          ...prev,
          mapDataConditions: [...temp],
        };
      });

      setConditionOnLoad({});
    } else {
      toast.error("All Fields are necessary to add condition", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const renderUseSessionValues = () => {
    return (
      <>
        <option value="">Select a session value</option>
        <option value="_sessionEmployeeName">Logged in Employee Name</option>
        <option value="_sessionEmployeeID">Logged in Employee ID</option>
        <option value="_sessionEmployeeEmail">Logged in Employee Email</option>
      </>
    );
  };

  const renderUseSessionValuesOnLoad = () => {
    return (
      <>
        <option value="">Select a session value</option>
        <option value="_sessionEmployeeName">Logged in Employee Name</option>
        <option value="_sessionEmployeeID">Logged in Employee ID</option>
        <option value="_sessionEmployeeEmail">Logged in Employee Email</option>
      </>
    );
  };

  const RenderOperators = () =>
    ["=", ">", "<", ">=", "<=", "!="].map((op) => (
      <option value={op}>{op}</option>
    ));

  const RenderOperatorsOnLoad = () =>
    ["="].map((op) => <option value={op}>{op}</option>);

  const renderOperand2 = () => {
    // if (useSession) {
    return (
      <select
        value={condition.operand2}
        onChange={(e) => changeCondition(e, "operand2")}
        id="useSession"
        style={{ width: "30%" }}
      >
        {renderUseSessionValues()}
      </select>
    );
    // } else {
    //   return (
    //     <input
    //       id="input"
    //       placeholder="Operand 2"
    //       value={condition.operand2}
    //       onChange={(e) => changeCondition(e, "operand2")}
    //       style={{ width: "30%" }}
    //     />
    //   );
    // }
  };

  const renderOperand2OnLoad = () => {
    if (useSessionOnLoad) {
      return (
        <select
          value={conditionOnLoad.operand2}
          onChange={(e) => changeConditionOnLoad(e, "operand2")}
          id="useSessionOnLoad"
          style={{ width: "30%" }}
        >
          {renderUseSessionValuesOnLoad()}
        </select>
      );
    } else {
      return (
        <input
          id="input"
          placeholder="Operand 2"
          value={conditionOnLoad.operand2}
          onChange={(e) => changeConditionOnLoad(e, "operand2")}
          style={{ width: "30%" }}
        />
      );
    }
  };

  // const RenderUseProcessVariableValues = () => {
  //   return (
  //     <>
  //       {dataFields?.map((val) => (
  //         <option value={val.name}>{val.name}</option>
  //       ))}
  //     </>
  //   );
  // };

  // const RenderUseProcessVariableValuesOnLoad = () => {
  //   return (
  //     <>
  //       {dataFieldsOnLoad?.map((val) => (
  //         <option value={val.name}>{val.name}</option>
  //       ))}
  //     </>
  //   );
  // };

  const renderUseProcessVariableValues = () => {
    let values = [];

    const temp = layout?.layout?.map((ele) => {
      if (ele?.stack?.length) {
        ele?.stack?.map((stack) => {
          if (stack?.processVariableName) {
            values.push(ele.processVariableName);
          }
        });
      } else {
        if (ele?.processVariableName) {
          values.push(ele.processVariableName);
        }
      }
    });

    return (
      <>
        {values?.map((val) => (
          <option value={val}>{val}</option>
        ))}
      </>
    );
  };

  const changeCondition = (e, id) => {
    e.preventDefault();
    setCondition((prev) => {
      return {
        ...prev,
        [id]: e.target.value,
      };
    });
  };

  const changeConditionOnLoad = (e, id) => {
    e.preventDefault();
    setConditionOnLoad((prev) => {
      return {
        ...prev,
        [id]: e.target.value,
      };
    });
  };

  const removeCondition = (e, id) => {
    e.preventDefault();
    let tempArray = placeholderChange?.filter((con) => con.id !== id);
    if (tempArray.length) {
      setPlaceholderChange([...tempArray]);
      setFormProperties((item) => {
        return {
          ...item,
          onLoadCondition: [...tempArray],
        };
      });
    } else {
      setPlaceholderChange([]);
      setFormProperties((item) => {
        return {
          ...item,
          onLoadCondition: [],
        };
      });
    }
  };

  const removeFilter = (e) => {
    e.preventDefault();
    setFormProperties((prev) => {
      return {
        ...prev,
        filter: {},
      };
    });
  };

  const removeMapCondition = (e, id) => {
    e.preventDefault();
    let tempArray = formProp?.mapDataConditions?.filter((con) => con.id !== id);
    if (tempArray.length) {
      setFormProperties((prev) => {
        return {
          ...prev,
          mapDataConditions: [...tempArray],
        };
      });
    } else {
      setFormProperties((prev) => {
        return {
          ...prev,
          mapDataConditions: [],
        };
      });
    }
  };

  const RenderFilter = () => {
    return (
      <div style={{ marginBottom: "10px" }}>
        <label style={{ fontSize: "20px", margin: "10px" }}>Filter</label>
        <div>
          <span
            style={{
              marginRight: "5px",
              fontSize: "16px",
            }}
          >
            {formProp?.filter?.operand1}
          </span>
          <span style={{ marginRight: "5px", fontSize: "16px", color: "red" }}>
            {formProp?.filter?.operator}
          </span>
          <span style={{ marginRight: "5px", fontSize: "16px" }}>
            {formProp?.filter?.operand2}
          </span>

          <button
            style={{
              marginRight: "15px",
              fontSize: "25px",
              width: "35px",
              borderRadius: "17",
            }}
            onClick={removeFilter}
          >
            -
          </button>
        </div>
      </div>
    );
  };

  const renderDataFields = () => {
    return dataFields?.map((field) => (
      <option value={field?.name}>{field?.name}</option>
    ));
  };

  const renderMapConditions = () => {
    return formProp?.mapDataConditions?.map((con, index) => {
      return (
        <div key={con?.id}>
          <span
            style={{
              marginLeft: "5px",
              fontSize: "16px",
              marginRight: "5px",
            }}
          >
            {index + 1}.
          </span>
          <span
            style={{
              marginRight: "5px",
              fontSize: "16px",
            }}
          >
            {con?.operand1}
          </span>
          <span style={{ marginRight: "5px", fontSize: "16px", color: "red" }}>
            {con?.operator}
          </span>
          <span style={{ marginRight: "5px", fontSize: "16px" }}>
            {con?.operand2}
          </span>

          <button
            style={{
              marginRight: "15px",
              fontSize: "25px",
              width: "35px",
              borderRadius: "17",
            }}
            onClick={(e) => removeMapCondition(e, con?.id)}
          >
            -
          </button>
        </div>
      );
    });
  };

  const renderUndo = (e) => {
    if (undoArray.length) {
      let tempUndoArray = [...undoArray];
      let tempLayout = tempUndoArray.pop();

      tempUndoArray.length
        ? setUndoArray([...tempUndoArray])
        : setUndoArray([]);

      setLayout({ layout: [...tempLayout] });
      setRedoArray((prev) => {
        return [...prev, [...layout.layout]];
      });
    }
  };

  const renderRedo = (e) => {
    if (redoArray.length) {
      let tempRedoArray = [...redoArray];
      let tempLayout = tempRedoArray.pop();

      tempRedoArray.length
        ? setRedoArray([...tempRedoArray])
        : setRedoArray([]);

      setLayout({ layout: [...tempLayout] });
      setUndoArray((prev) => {
        return [...prev, [...layout.layout]];
      });
    }
  };

  const show = (e) => {
    console.log({ undoArray, redoArray, layout });
  };

  const clear = (e) => {
    setUndoArray([]);
    setRedoArray([]);
    setLayout({ layout: [] });
  };

  const handleCustomLoaderCheckboxChange = (e) => {
    setFormProperties((prev) => {
      return {
        ...prev,
        customLoader: {
          ...prev.customLoader,
          [e.target.id]: e.target.checked,
        },
      };
    });
  };

  const handleCustomLoaderInputChange = (e) => {
    setFormProperties((prev) => {
      return {
        ...prev,
        customLoader: {
          ...prev.customLoader,
          [e.target.id]: e.target.value,
        },
      };
    });
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={t("Duplicate Form")}
        show={showDuplicateModal}
        handleClose={onDuplicateModalClose}
        className="duplicate-modal"
        id="duplicate-modal"
      >
        <div className="new-asset-wrapper">
          <h6 className="new-asset-name primaryColor">
            {t("Enter New Asset Name")}
          </h6>
          <input
            id="duplicate-form-asset-input"
            className="new-asset-input"
            placeholder="Name of the form"
            value={duplicateFormName}
            onChange={onDuplicateFormNameCHange}
          />
          <Link
            to="#"
            id="duplicate-form-button"
            onClick={() => renderDuplicate()}
            className="primaryButton new-asset-button primaryButtonColor"
          >
            {t("Duplicate")}
          </Link>
        </div>
      </CommonModelContainer>
      <FormBuilderTabPane
        data={data}
        layout={layout}
        setLayout={setLayout}
        element={element}
        setElement={setElement}
        elements={elements}
        isDisplayError={isDisplayError}
        showErrors={showErrors}
        templateElements={templateElements}
        renderElements={renderElements}
        open={open}
        undoArray={undoArray}
        setUndoArray={setUndoArray}
        redoArray={redoArray}
        setRedoArray={setRedoArray}
        formProp={formProp}
        backGrounduniqueIndex={backGrounduniqueIndex}
      />
      <div className="appdesigner-rightside-menu BodyColor">
        <ul className="appdesigner-rightside-menu-link">
          <li>
            <Link
              to="#"
              id="right-side-edit-properties"
              data-tip
              data-for="EditProperties"
              onClick={openFormProperties}
            >
              <EditProperties className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="EditProperties"
              place="top"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Form Properties")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              id="right-side-undo-btn"
              data-tip
              data-for="undo"
              to="#"
              onClick={(e) => {
                if (undoArray.length) renderUndo(e);
              }}
            >
              <Undo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="undo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Undo")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              id="right-side-redo-btn"
              data-tip
              data-for="redo"
              to="#"
              onClick={(e) => {
                if (redoArray.length) renderRedo(e);
              }}
            >
              <Redo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="redo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Redo")}
            </ReactTooltip>
          </li>
          {loggedInUser.enabled_menus?.menus_enabled?.includes(
            "APPDESIGNER_DELETEASSET"
          ) && (
            <li>
              <Link
                to="#"
                id="right-side-delete-btn"
                data-tip
                data-for="delete"
                onClick={openDeleteModal}
              >
                <Delete className="svg-fill iconFillhover iconSvgFillColor" />
              </Link>
              <ReactTooltip
                id="delete"
                place="left"
                className="tooltipCustom"
                arrowColor="rgba(0, 0, 0, 0)"
                effect="solid"
              >
                {t("Delete")}
              </ReactTooltip>
            </li>
          )}
          <li>
            <Link
              to="#"
              id="right-side-duplicate-btn"
              data-tip
              data-for="copy"
              onClick={onDuplicateModalOpen}
            >
              <Duplicate className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="copy"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Duplicate")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              id="right-side-save-btn"
              onClick={() => {
                data.lockStatus
                  ? data.lockOwner === localStorage.getItem("username")
                    ? onSave()
                    : console.log("Not the owner")
                  : onSave();
              }}
              data-tip
              data-for="save"
            >
              <Save className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="save"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {data.lockStatus
                ? data.lockOwner === localStorage.getItem("username")
                  ? t("Save")
                  : `Locked by ${data.lockOwner}`
                : t("Save")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              id="right-side-save-draft-btn"
              onClick={onSaveasDraft}
              data-tip
              data-for="saveDraft"
            >
              <SaveAsADraft className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="saveDraft"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Save As Draft")}
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
              <Preview className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="Preview"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Preview")}
            </ReactTooltip>
            <RenderFormPreview
              openModelOne={openModelOne}
              closeModelOne={oncloseModelOne}
              layout={formPreviewData}
              formProp={formProp}
            />
          </li>

          <li>
            <Link
              id="right-side-download-btn"
              data-tip
              data-for="Download"
              to="#"
            >
              <img src={downloadCs} />
              {/* <Download1 className="svg-stroke-comingSoonIcon" /> */}
            </Link>
            <ReactTooltip
              id="Download"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              id="right-side-map-btn"
              onClick={handleButtonClick}
              data-tip
              data-for="Mapping"
            >
              <Mapping className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="Mapping"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Mapping")}
            </ReactTooltip>
            <FormMapping
              formDataProp={data.resourceName}
              buttonClick={open}
              FormToFormMapping={handleCall}
            />
          </li>
          {/* <li>
            <Link to="#" data-tip data-for="Generate">
              <img
                src={GroupIcon}
                alt="group Icon"
                style={{ height: "40px" }}
              />
            </Link>
            <ReactTooltip
              id="Generate"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              Generate
            </ReactTooltip>
          </li> */}
          <li>
            <div class="form-switch" data-tip data-for="Claim">
              <input
                // id="right-side-claim-form-input"
                data-tip
                data-for="Claim"
                type="checkbox"
                class="form-check-input"
                id="flexSwitchCheckDefault"
                role="switch"
                style={{
                  borderColor: "#0D3C84",
                  borderWidth: "2px",
                  alignSelf: "center",
                  color: "#0D3C84",
                  height: "18px",
                  width: "30px",
                  cursor: "pointer",
                }}
                checked={claim}
                onChange={handleClaimChange}
              />
            </div>
            <ReactTooltip
              id="Claim"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {claim ? t("Release Form") : t("Claim Form")}
            </ReactTooltip>
          </li>
          {/* <li>
            <button onClick={clear}>Clear</button>
          </li>
          <li>
            <button onClick={show}>Show</button>
          </li> */}
        </ul>
        <Link className="credit-card-link" data-tip data-for="Overview" to="#">
          <Overview className="svg-fill-comingSoonIcon" />
        </Link>
        <ReactTooltip
          id="Overview"
          place="left"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          effect="solid"
        >
          {t("comingSoon")}
        </ReactTooltip>
        {/* <Link  className="right-logo">
          <span>
            <img src={LogoIcon} alt="Logo" />
          </span>
          <i>V1.1.2</i>
        </Link> */}
      </div>
      <CommonModelContainer
        // modalTitle={`Delete  ${data.resourceName.substring(
        //   0,
        //   data.resourceName.length - 4
        // )}`}
        modalTitle={t("Delete Form")}
        show={showDeleteModal}
        handleClose={openDeleteModal}
        className="delete-modal"
        id="delete-modal"
      >
        <h6 className="deleteform">
          {t("Do you want to delete")}{" "}
          {data.resourceName.substring(0, data.resourceName.length - 4)}{" "}
        </h6>
        <div className="Delete-popup-bottom-formbuilder">
          <button
            id="delete-file-cancel-btn"
            className="cancelsecondaryButton secondaryButtonColor"
            onClick={openDeleteModal}
          >
            {t("Cancel")}
          </button>
          <button
            id="delete-file-confirm-btn"
            onClick={() => deleteFile()}
            className="deleteprimaryButton primaryButtonColor"
          >
            {t("Confirm")}
          </button>
        </div>
      </CommonModelContainer>
      {/* <CommonModelContainer
        modalTitle="Edit Name"
        show={showEditModal}
        handleClose={openEditModal}
        className="delete-modal"
        id="delete-modal"
      > */}
      {/* <h6 className="deleteform">
          Rename {" "} 
          {data.resourceName.substring(0, data.resourceName.length - 4)}{" "}
        </h6> */}
      {/* <div class="application py-2">
          <span className="form-subheading" id="edit-app-title">
            Rename File <span className="appdesignerappname">*</span>
          </span>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="appdesignerinput"
            // style={"padding:16px"}
          />
        </div>
        <div className="Delete-popup-bottom-formbuilder">
          <button
            id="delete-file-cancel-btn"
            className="cancelsecondaryButton secondaryButtonColor"
            onClick={openEditModal}
          >
            Cancel
          </button>
          <button
            id="delete-file-confirm-btn"
            onClick={() => EditApi()}
            className="deleteprimaryButton primaryButtonColor"
          >
            Confirm
          </button>
        </div>
      </CommonModelContainer> */}
      {/* <p className="warning-text">This action will close the file</p> */}

      {/* //////////////Form Properties Modal ///////////////// */}

      <CommonModelContainer
        modalTitle={t("Form Customisation")}
        show={showFormProperties}
        handleClose={closeFormProperties}
        className="form-properties-modal"
        // dialogAs={DraggableModalDialog}
        // backdropClassName="FormElementsBackdrop"
      >
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
                {t("Property")}
              </button>
            </li>
            <li class="nav-item" role="presentation">
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
                {t("On Load")}
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link propertiesPopup"
                id="pills-loading-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-loading"
                type="button"
                role="tab"
                aria-controls="pills-loading"
                aria-selected="false"
              >
                {t("Custom Loading Modal")}
              </button>
            </li>
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <form>
                <div className="form-input renameFileNameContainer">
                  <label htmlFor="">{t("Form Name")}</label>
                  <div style={{ display: "flex" }}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="appdesignerinput form-cust-input"
                      style={{ width: "70%" }}
                    />
                    <button
                      id="delete-file-confirm-btn"
                      onClick={() => handleSaveFormProperties()}
                      className="primaryButton primaryButtonColor renameFileName"
                      disabled={
                        data.resourceName.replace(/\.[^/.]+$/, "") == editName
                          ? true
                          : false
                      }
                    >
                      {t("Rename")}
                    </button>
                  </div>

                  <small className="warning-text">
                    {t("Renaming the file will close the file")}
                  </small>
                </div>
                <div className="form-input">
                  <label> {t("Change Background Color")}</label>
                  <div className="colorBoxStyleContainer color-box-container ">
                    <div
                      className="form-prop-color-box-style form-cust-input"
                      onClick={handleShowBackColorPicker}
                    >
                      <div className="color-box-wrapper">
                        <div
                          className="form-prop-color-box"
                          style={{
                            background: `${
                              formProp.backgroundColor
                                ? formProp.backgroundColor
                                : backcompactPicker
                            }`,
                            width: "27%",
                          }}
                        >
                          <ReactTooltip id="11" place="top" effect="solid">
                            {t("Form Background Color")}
                          </ReactTooltip>
                        </div>
                        <p>
                          {`#${rgbHex(
                            formProp.backgroundColor
                              ? formProp.backgroundColor
                              : backcompactPicker
                          )}`
                            ?.substring(
                              0,
                              `#${rgbHex(
                                formProp.backgroundColor
                                  ? formProp.backgroundColor
                                  : backcompactPicker
                              )}`?.length - 2
                            )
                            .toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div
                      className="remove-btn-form-prop"
                      onClick={handleRemoveBackgroundColor}
                    >
                      <Remove
                        style={{ height: 26, width: 26 }}
                        className="svg-fill"
                      />
                    </div>

                    {/* <div className="form-prop-color-box-style form-cust-input justify-content-start">100%</div> */}
                  </div>
                  <div
                    className={
                      showBackColorPicker == true
                        ? "display-back-color-picker"
                        : "displayHide"
                    }
                  >
                    <div>
                      <ColorPicker
                        hideAdvancedSliders="false"
                        hideColorGuide="false"
                        hideInputType="false"
                        value={backcompactPicker}
                        onChange={handleBackgroundColorPicker}
                        height={125}
                        width={250}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-input">
                  <label>{t("uploadImage")}</label>
                  <div className="form-prop-upload-wrapper">
                    <div
                      className="ps-2 pt-1 form-cust-input"
                      style={{ border: "1px solid #E5E5E5", width: "80%" }}
                    >
                      <label
                        htmlhtmlFor="upload-img"
                        class=""
                        onChange={handleUploadBackImage}
                        id="imageUploadProperties-uploadImg-label"
                      >
                        <input type="file" class="file" id="upload-img" />
                        {formProp?.backgroundImage?.length == 0 ? (
                          <>
                            <UploadFormProp
                              style={{ height: 26, width: 26 }}
                              className="svg-fill"
                            />
                          </>
                        ) : (
                          <div className="d-flex flex-row">
                            <ImageLoader
                              src={`${
                                process.env.REACT_APP_CDS_ENDPOINT
                              }appLogo/image/${
                                formProp?.backgroundImage
                              }?Authorization=${localStorage.getItem(
                                "token"
                              )}&workspace=${localStorage.getItem(
                                "workspace"
                              )}`}
                              style={{
                                borderRadius: 5,
                                height: "26px",
                                width: "26px",
                              }}
                              alt=""
                              uniqueId={backGrounduniqueIndex}
                            />

                            <span>
                              {formProp?.backgroundImage && (
                                <div
                                  style={{
                                    color: "grey",
                                    marginLeft: "12px",
                                    marginTop: "1px",
                                    fontSize: "12px",
                                  }}
                                >
                                  {t("Uploaded successfully!")}
                                </div>
                              )}
                            </span>
                          </div>
                        )}
                      </label>
                    </div>
                    <Remove
                      style={{ height: 26, width: 26 }}
                      className="svg-fill remove-btn-form-prop"
                      onClick={handleRemoveUploadImage}
                    />
                  </div>
                </div>
                <div className="form-input">
                  <label>{t("Change Text Fonts")}</label>
                  <div className="select ">
                    <FontPicker
                      apiKey="AIzaSyAaXIFdqZdfK5Rcq2xrB3fRQv6xhyqt_rc"
                      activeFontFamily={
                        formProp?.fontFamily
                          ? formProp?.fontFamily
                          : selectFontFamily
                      }
                      onChange={(nextFont) => handleSelectFontFamily(nextFont)}
                      id="styleComponent-Text-FontPicker"
                    />
                  </div>
                </div>
              </form>
            </div>
            <div
              class="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
            >
              {/* <div className="form-checkbox-wrap">
                <label htmlFor="useSession">
                  <input
                    type="radio"
                    id="useSession"
                    name="form-radio"
                    checked={useSession}
                    onClick={handleuseSessionChange}
                  />
                  <span>
                    <Icon icon="bx:check" />
                  </span>
                  <p>{t("Use Session")}</p>
                </label>
              </div> */}
              <div className="form-input">
                <label>{t("Select a Data Model")}</label>
                <select
                  id="numberProperties-dataModel-select"
                  onChange={handleDataModelChange}
                  style={{ height: "40px" }}
                  value={`${formProp?.selectedDataModal}.java`}
                >
                  <option value="">{t("Select an option")}</option>
                  {renderDataModelOptions()}
                </select>
              </div>
              {formProp?.filter?.operand1 ? (
                <RenderFilter />
              ) : (
                <div className="TextBox-custom-flex" id="input-wrap">
                  <select
                    value={condition.operand1}
                    onChange={(e) => changeCondition(e, "operand1")}
                    style={{ width: "30%" }}
                  >
                    <option value="">{t("Operand 1")}</option>
                    {renderDataFields()}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => changeCondition(e, "operator")}
                    style={{ width: "30%" }}
                  >
                    <option value="">{t("Operator")}</option>
                    <RenderOperators />
                  </select>
                  {renderOperand2()}

                  <button onClick={addFilter} style={{ width: "10%" }}>
                    +
                  </button>
                </div>
              )}

              <div className="form-input">
                <label>{t("Auto Map Data")}</label>
              </div>
              <div className="TextBox-custom-flex" id="input-wrap">
                <select
                  value={conditionOnLoad.operand1}
                  onChange={(e) => changeConditionOnLoad(e, "operand1")}
                  style={{ width: "30%" }}
                >
                  <option value="">{t("Operand 1")}</option>
                  {renderUseProcessVariableValues()}
                </select>
                <select
                  value={conditionOnLoad.operator}
                  onChange={(e) => changeConditionOnLoad(e, "operator")}
                  style={{ width: "30%" }}
                >
                  <option value="">{t("Operator")}</option>
                  <RenderOperatorsOnLoad />
                </select>
                <select
                  value={conditionOnLoad.operand2}
                  onChange={(e) => changeConditionOnLoad(e, "operand2")}
                  style={{ width: "30%" }}
                >
                  <option value="">{t("Operand 2")}</option>
                  {renderDataFields()}
                </select>
                <button onClick={addMapDataConditions} style={{ width: "10%" }}>
                  +
                </button>
              </div>
              <div>
                {formProp?.mapDataConditions?.length ? (
                  <div style={{ marginBottom: "10px" }}>
                    <label style={{ fontSize: "20px", margin: "10px" }}>
                      Data Assignments
                    </label>
                    {renderMapConditions()}
                  </div>
                ) : null}
              </div>
            </div>
            <div
              class="tab-pane fade"
              id="pills-loading"
              role="tabpanel"
              aria-labelledby="pills-loading-tab"
            >
              <div style={{ marginTop: "10px" }} />

              {formProp?.customLoader?.useDefaultLoader ? (
                <div
                  style={{
                    border: "1px solid black",
                    opacity: formProp?.customLoader?.showLoader ? 1 : 0.5,
                  }}
                >
                  <div class="thank-you-pop">
                    <div className="activity-indicator" />
                    <h1 className="primaryColor">endpoint</h1>
                    <p className="secondaryColor">Loading please wait...</p>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    border: "1px solid black",
                    backgroundColor:
                      formProp?.customLoader?.modalBackgroundColor || "",
                    opacity: formProp?.customLoader?.showLoader ? 1 : 0.5,
                  }}
                >
                  <div class="thank-you-pop">
                    <div
                      className="activity-indicator"
                      style={{
                        borderTopColor:
                          formProp?.customLoader?.loaderColor || "gray",
                      }}
                    />
                    <h1
                      className={
                        formProp?.customLoader?.headingTextColor
                          ? ""
                          : "primaryColor"
                      }
                      style={{
                        color: formProp?.customLoader?.headingTextColor || "",
                      }}
                    >
                      {formProp?.customLoader?.headingText || "endpoint"}
                    </h1>
                    <p
                      className={
                        formProp?.customLoader?.descriptionTextColor
                          ? ""
                          : "secondaryColor"
                      }
                      style={{
                        color:
                          formProp?.customLoader?.descriptionTextColor || "",
                      }}
                    >
                      {formProp?.customLoader?.descriptionText ||
                        "Loading please wait..."}
                    </p>
                  </div>
                </div>
              )}

              <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                <label style={{ marginBottom: "10px" }}>
                  <h3>Loader Properties</h3>
                </label>

                <form>
                  <div>
                    <div className="form-input">
                      <label className="secondaryColor">
                        Show loader on this form
                      </label>
                    </div>
                    <div class="form-switch">
                      <input
                        id="showLoader"
                        type="checkbox"
                        class="form-check-input"
                        role="switch"
                        style={{
                          borderColor: "#0D3C84",
                          borderWidth: "2px",
                          alignSelf: "center",
                          color: "#0D3C84",
                          height: "18px",
                          width: "30px",
                          cursor: "pointer",
                        }}
                        checked={formProp?.customLoader?.showLoader}
                        onChange={handleCustomLoaderCheckboxChange}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="form-input">
                      <label className="secondaryColor">
                        Use default loader
                      </label>
                    </div>
                    <div class="form-switch">
                      <input
                        id="useDefaultLoader"
                        type="checkbox"
                        class="form-check-input"
                        role="switch"
                        style={{
                          borderColor: "#0D3C84",
                          borderWidth: "2px",
                          alignSelf: "center",
                          color: "#0D3C84",
                          height: "18px",
                          width: "30px",
                          cursor: "pointer",
                        }}
                        checked={formProp?.customLoader?.useDefaultLoader}
                        onChange={handleCustomLoaderCheckboxChange}
                      />
                    </div>
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">Loader Color</label>
                    <input
                      type="color"
                      id="loaderColor"
                      value={formProp?.customLoader?.loaderColor}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">Heading Text</label>
                    <input
                      type="text"
                      placeholder="Heading Text"
                      id="headingText"
                      value={formProp?.customLoader?.headingText}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">Heading Text Color</label>
                    <input
                      type="color"
                      id="headingTextColor"
                      value={formProp?.customLoader?.headingTextColor}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">Description Text</label>
                    <input
                      type="text"
                      placeholder="Description Text"
                      id="descriptionText"
                      value={formProp?.customLoader?.descriptionText}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">
                      Description Text Color
                    </label>
                    <input
                      type="color"
                      id="descriptionTextColor"
                      value={formProp?.customLoader?.descriptionTextColor}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                  <div className="form-input">
                    <label className="secondaryColor">
                      Modal Background Color
                    </label>
                    <input
                      type="color"
                      id="modalBackgroundColor"
                      value={formProp?.customLoader?.modalBackgroundColor}
                      onChange={handleCustomLoaderInputChange}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <div className="Delete-popup-bottom-formbuilder">
            <button
              id="delete-file-cancel-btn"
              className="cancelsecondaryButton secondaryButtonColor"
              onClick={closeFormProperties}
            >
              {t("Close")}
            </button>
          </div> */}
        </>
      </CommonModelContainer>

      {/* //////////// save as draft /////////////////// */}
      {/* <CommonModelContainer
        modalTitle={"Comment"}
        show={formSaveDraft}
        handleClose={() => setFormSaveDraft(false)}
        className={" popup"}
      >
        <Row className="mapdataRow">
          <Col lg={12} className="mapdatainfo">
            <Row>
              <Col md={4}>
                <div className="comment">
                  <p className="commenttext">Comments</p>
                  <input
                    placeholder="Type here.."
                    className="commentbox"
                    value={formComment}
                    onChange={(event) => {
                      setFormComment(event.target.value);
                    }}
                  />
                </div>
              </Col>
            </Row>
            <div className="mapping-btn-action mt-5">
              <button
                className="FormcommentmapButton mx-3 "
                onClick={() => onSaveasDraft()}
              >
                Save as draft
              </button>
            </div>
          </Col>
        </Row>
      </CommonModelContainer> */}
    </>
  );
};

export default FormBuilderTabPaneContainer;
