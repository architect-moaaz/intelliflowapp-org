import { Link, useHistory } from "react-router-dom";
import * as React from "react";
import { Icon } from "@iconify/react";
import PulseFillIcon from "remixicon-react/AddLineIcon";
import axios from "axios";
import moment from "moment";
import StepNavigation from "./stepNavigation";
import ReactTooltip from "react-tooltip";
import {
  uploadimageIco,
  uparrowIco,
  ApplicationIcon,
  mobileIco,
  computerIco,
  SharpRestore,
  Tick2,
  UploadFile,
  PropertiesIco,
  EditIcon,
  Edit,
  Logo100,
  DeleteIco,
  infocircleIco,
  LaptopIcoRed,
  LaptopIco,
  PhoneIcoRed,
  PhoneIco,
  DownloadExcelTemplate,
} from "../../assets";
import { Col, Dropdown, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import "./ApplicationDashboard.css";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import {
  appList as appListAtom,
  openFilesState,
  formbuilderErrorsState,
  loggedInUserState,
  sidebarDataState,
} from "../../state/atom";
import { useRecoilState } from "recoil";
import { selector, useRecoilValue } from "recoil";
import { searchTerm } from "../Header/Header";
import { dataCount } from "../../state/atom";
import imageCompression from "browser-image-compression";
import ProgressiveImage from "../ProgressiveImage/ProgressiveImage";
// import CreateAppScratch from "../../assets/NewIcon/CreateAppScratch.svg";
import { ReactComponent as CreateAppScratch } from "../../assets/NewIcon/CreateAppScratch.svg";
import { ReactComponent as CreateAppExcel } from "../../assets/NewIcon/CreateAppExcel.svg";
import { ReactComponent as CreateAppTemplate } from "../../assets/NewIcon/CreateAppTemplate.svg";
// import CreateAppExcel from "../../assets/NewIcon/CreateAppExcel.svg";
// import CreateAppTemplate from "../../assets/NewIcon/CreateAppTemplate.svg";
import UploadFileCreateApp from "../../assets/NewIcon/UploadFileCreateApp.svg";
import newUploadIcon from "../../assets/NewIcon/newUploadIcon.svg";
import UploadedExcelcon from "../../assets/NewIcon/UploadedExcelcon.svg";
import templateBoxIcon from "../../assets/NewIcon/templateBoxIcon.svg";
import PublishedIcon from "../../assets/NewIcon/PublishedIcon.svg";
import DraftIcon from "../../assets/NewIcon/DraftIcon.svg";
import formatDateTimeInTimezone from "../DateAndTime/TimezoneFormatter";
import createExcelTemplate from "../../assets/ExcelTemplates/Excel_Template.xlsx";
import PaginationAppDashboard from "../../components/Pagination/PaginationAppDashboard";
import LoadingWrapper from "../LoadingWrapper/LoadingWrapper";
import LoadingWrapperCard from "../LoadingWrapperCard/LoadingWrapperCard";

const searchValueState = selector({
  key: "searchValueState",
  get: ({ get }) => {
    return get(searchTerm);
  },
});

const ApplicationDashboard = () => {
  const [t, i18n] = useTranslation("common");
  const history = useHistory();
  localStorage.setItem("Dashboard", t("appDesigner"));
  const [selectedExcel, setSelectedExcel] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [openModelOne, setOpenModelOne] = useState(false);
  const [createNewAppUsingExcelModal, setCreateNewAppUsingExcelModal] =
    useState(false);
  const [createExcelStatus, setCreateExcelStatus] = useState(false);
  const [showPreviewModel, setShowPreviewModel] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [show, setShow] = useState(false);
  const [countTerm, setcountTerm] = useRecoilState(dataCount);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showNewAppModel, setShowNewAppModel] = useState(false);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [showExcelModel, setShowExcelModel] = useState(false);
  const [name, setName] = useState("");
  const [appNameOld, setAppNameOld] = useState("");
  const [previousAppName, setPreviousAppName] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionOld, setDescriptionOld] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFilePreview, setUploadedFilePreview] = useState(null);
  const [mapData, setMapData] = useState(false);
  const [appDetailsData, setAppDetailsData] = useState(null);
  const [appName, setAppName] = useState("");
  const [deleteAppName, setDeleteAppName] = useState("");
  const [displayDeleteAppName, setDisplayDeleteAppName] = useState("");
  const [alphabetSort, setAlphabetSort] = useState(null);
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [displayName, setDisplayName] = useState();
  const searchValue = useRecoilValue(searchValueState);
  const [appCreationStatus, setAppCreationStatus] = useState({
    status: false,
    message: "",
    style: "",
  });
  const [formbuilderErrors, setFormbuilderErrors] = useRecoilState(
    formbuilderErrorsState
  );
  const labelArray = ["Uploading", "Binding", "Completed"];
  const [stepTextColor, setStepTextColor] = useState("stepTextClass");
  const [currentStep, updateCurrentStep] = useState(1);
  const [sidebarData, setSidebarData] = useRecoilState(sidebarDataState);
  function updateStep(step) {
    updateCurrentStep(step);
  }
  const [selectAppForPreview, setSelectAppForPreview] = useState({
    appName: "",
    colorScheme: "",
    creationTime: "",
    deviceSupport: "",
    lastUpdatedTime: "",
    logoUrl: "",
    status: "",
    userId: "",
    workspaceName: "",
  });
  const [formSelected, setFormSelected] = useState(false);
  const [gridSelected, setGridSelected] = useState(false);
  const [sheetSelected, setSheetSelected] = useState(false);
  const [targetDevice, setTargetDevice] = useState("");
  const [targetDeviceOld, setTargetDeviceOld] = useState("");
  const [imageStatus, setImageStatus] = useState({
    status: "",
    url: "",
    urlThumbnail: "",
  });

  const [appList, setappList] = useRecoilState(appListAtom);

  const [isWeb, setIsWeb] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [activeDevice, setActiveDevice] = useState("web");
  const [descriptionCharLeft, setDescriptionCharLeft] = useState(250);
  const handleChangeRadio = (e) => {
    setActiveDevice(e);
  };

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [templatesCount, setTemplatesCount] = useState("");
  const [templateAppsList, setTemplateAppList] = useState([]);
  const [startColumnNumber, setStartColumnNumber] = useState("");
  const [startRowNumber, setStartRowNumber] = useState("");
  const [filtersMobileWeb, setFiltersMobileWeb] = useState({
    M: false,
    D: false,
    U: false,
  });
  const [totalNoOfAppsCreated, setTotalNoOfAppsCreated] = useState();
  const [noOfAppsAllowed, setNoOfAppsAllowed] = useState();
  const [noOfTabsinSpreadsheet, setNoOfTabsInSpreadsheet] = useState();
  const [offset, setOffset] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [sortParam, setSortParam] = useState("");
  const [filterParam, setFilterParam] = useState("");
  const [isSorting, setIssorting] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMainContent, setIsLoadingMainContent] = useState(true);
  const [isLoadingAppList, setIsLoadingAppList] = useState(true);

  // useEffect(() => {
  //   if (
  //     loggedInUser?.enabled_menus?.menus_enabled?.includes("CHATBOT_ENABLE")
  //   ) {
  //     let script_1_loaded = false;
  //     let script_2_loaded = false;

  //     const script_1 = document.createElement("script");
  //     script_1.src =
  //       "http://ns3172713.ip-151-106-32.eu:43000/assets/modules/channel-web/inject.js";
  //     script_1.async = true;
  //     document.body.appendChild(script_1);

  //     const script_2 = document.createElement("script");
  //     script_2.src =
  //       "https://cdn.rawgit.com/abdennour/react-csv/6424b500/cdn/react-csv-latest.min.js";
  //     script_2.async = true;
  //     document.body.appendChild(script_2);

  //     script_1.onload = () => {
  //       script_1_loaded = true;
  //       if (script_1_loaded && script_2_loaded) {
  //         window.botpressWebChat.init({
  //           host: "http://ns3172713.ip-151-106-32.eu:43000",
  //           botId: "intellia",
  //           extraStylesheet: "/assets/modules/channel-web/newStyle.css",
  //         });
  //       }
  //     };

  //     script_2.onload = () => {
  //       script_2_loaded = true;
  //       if (script_1_loaded && script_2_loaded) {
  //         window.botpressWebChat.init({
  //           host: "http://ns3172713.ip-151-106-32.eu:43000/",
  //           botId: "intellia",
  //           extraStylesheet: "/assets/modules/channel-web/newStyle.css",
  //         });
  //       }
  //     };

  //     return () => {
  //       document.body.removeChild(script_1);
  //       document.body.removeChild(script_2);
  //     };
  //   }
  // }, []);

  async function getToken() {
    try {
      const response = await axios.post(
        "http://ns3172713.ip-151-106-32.eu:43000/api/v2/admin/auth/login/basic/default",
        {
          email: "info@intelliflow.ai",
          password: "password",
          strategy: "local",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const botToken = response.data.payload.jwt;
      localStorage.setItem("botToken", botToken);
      return botToken;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }

  useEffect(() => {
    getToken();
  }, []);

  const loadApps = async () => {
    APPINFO();
  };

  useEffect(() => {
    if (isSorting) {
      fetchSoringData();
    } else if (isFiltering) {
      if (filtersMobileWeb.M) {
        fetchFilterData();
      } else if (filtersMobileWeb.D) {
        fetchFilterData();
      } else {
        loadApps();
      }
    } else {
      loadApps();
    }
  }, [offset, isSorting, isFiltering, filtersMobileWeb]);

  //  if(!filtersMobileWeb.M && !filtersMobileWeb.D){
  //   console.log("inside if block when web or mobile false");
  //   loadApps()
  // }

  useEffect(() => {
    loadApps();
  }, [searchValue]);

  // const loadTemplateApps = async () =>{
  //   getTempInfo()

  // }
  const toTemplate = (item) => {
    localStorage.setItem("templateData", JSON.stringify(item));
    console.log("templateData => ", item);
    // history.push('/template')
  };

  useEffect(() => {
    var includes = false;
    if (
      loggedInUser?.enabled_menus?.menus_enabled?.some((v) =>
        v.includes("APPDESIGNER")
      )
    ) {
      includes = true;
    }
    if (!includes) {
      history.push({
        pathname: "/Dashboard",
      });
    }

    setOpenFiles([]);
    setSidebarData([]);
    setFormbuilderErrors({
      forms: {},
      workflow: {},
      businessModel: {},
      dataModel: {},
    });
    loadApps().then((e) => {
      // APPINFO();
    });
  }, []);

  // console.log("templateAppsList", templateAppsList);
  useEffect(() => {
    if (!uploadedFile) {
      setUploadedFilePreview(null);
      return;
    }
    console.log("uploadedFile", uploadedFile);
    const objectUrl = URL.createObjectURL(uploadedFile);
    setUploadedFilePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);

  const selectPreview = (appName) => {
    const singleAppData = appDetailsData?.data
      .filter((e) => appName == e.appName)
      .map((e) => {
        return e;
      });
    if (singleAppData.length != 0) {
      setSelectAppForPreview(singleAppData[0]);
    }
  };

  const createNewApp = async (evt) => {
    const id = toast.loading("Creating App....");
    evt.preventDefault();

    if (uploadedFile) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 450,
        useWebWorker: true,
      };
      const optionsThumbnail = {
        maxSizeMB: 0.01,
        maxWidthOrHeight: 50,
        useWebWorker: true,
      };
      let uploadedAppLogo;
      await imageCompression(uploadedFile, options).then((x) => {
        uploadedAppLogo = x;
      });
      let uploadedAppLogoThumbnail;
      await imageCompression(uploadedFile, optionsThumbnail).then((x) => {
        uploadedAppLogoThumbnail = x;
      });

      const formData = new FormData();
      formData.append("file", uploadedAppLogo);
      const formDataThumbnail = new FormData();
      formDataThumbnail.append("file", uploadedAppLogoThumbnail);
      await axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data; charset=utf-8",
            logoName:
              localStorage.getItem("workspace") +
              encodeURIComponent(name.replace(/\s+/g, "-")).toLowerCase(),
          },
        }
      );
      axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formDataThumbnail,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            logoName:
              localStorage.getItem("workspace") +
              `${name.replace(/\s+/g, "-").toLowerCase()}_thumbnail`,
          },
        }
      );
    }
    const postData = {
      miniAppName: name,
      description: description,
      workspaceName: localStorage.getItem("workspace"),
      logoURL: uploadedFile ? "true" : "false",
      deviceSupport: targetDevice,
    };

    console.log("PostDataUrl", postData);
    if (name == "") {
      toast.update(id, {
        render: "Please enter the app name ",
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
        isLoading: false,
      });
      return;
    }

    if (description == "") {
      toast.update(id, {
        render: "Please enter the description",
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
        isLoading: false,
      });
      return;
    }
    if (targetDevice == "") {
      toast.update(id, {
        render: "Please select the device",
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        type: "error",
        isLoading: false,
      });
    }
    if (targetDevice && description && name) {
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/createRepository",
          postData
        )
        .then((response) => {
          onOpenNewAppModal();
          loadApps();
          addHomePage(response.data.created.miniappName);
          toast.update(id, {
            render: "Created Successfully!",
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          // clearValue();
          // setUploadedFilePreview(null);
          // setUploadedFile(null);
          // setDescription(null);
          CreateApplicationClose();
          localStorage.setItem(
            "displayName",
            response.data.created.displayName
          );
          history.push({
            pathname: "/studio",
            state: {
              appName: response.data.created.miniappName,
            },
          });
        })
        .catch((error) => {
          if (error.status == 409) {
          }
          toast.update(id, {
            render: "App already exist, Please enter another app name",
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
          // clearValue();
          // setUploadedFile(null);
          // setUploadedFilePreview(null);
          // setDescription(null);
        });
    }
  };

  const addHomePage = (miniAppName) => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: miniAppName,
      fileName: `${localStorage.getItem("workspace")}-${miniAppName}`,
      fileType: "page",
    };

    const headers = {
      "Content-Type": "application/json",
    };

    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/formmodeller/createFile",
        postData,
        { headers }
      )
      .then((response) => {})
      .catch((e) => console.log(e));
  };

  const deleteApp = () => {
    const id = toast.loading("Deleting App....");
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: deleteAppName,
    };

    axios
      .delete(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/deleteMiniApp",
        { data: postData }
      )
      .then((response) => {
        setShowDeleteModel(false);
        loadApps();
        toast.update(id, {
          render: "Deleted Successfully!",
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      })
      .catch((error) => {
        toast.update(id, {
          render: error.message,
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
  };
  const subscribe = async () => {
    const axios = require("axios");

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        "IDENTITY/misc/getWorkspaceConfig",
      headers: {
        workspaceName: localStorage.getItem("workspace"),
        Authorization: localStorage.getItem("token"),
      },
    };

    axios
      .request(config)
      .then(async (response) => {
        setNoOfAppsAllowed(response.data.config.noOfApps);
        setIsLoadingMainContent(false);
        setNoOfTabsInSpreadsheet(response.data.config.noOfTabsinSpreadSheet);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      subscribe();
    }, 3000);
  }, []);
  const APPINFO = async () => {
    const headers = searchValue.length > 0 ? { appName: searchValue } : {};
    var config = {
      method: "get",
      url: `${
        process.env.REACT_APP_MODELLER_API_ENDPOINT
      }modellerService/${localStorage.getItem(
        "workspace"
      )}/data?size=50&page=${offset}`,
      headers: headers,
    };
    axios(config)
      .then(async (response) => {
        if (response?.data?.data?.data?.count?.totalPages) {
          setPageCount(response.data.data.data.count.totalPages);
        }

        setcountTerm(response.data.data.data.count);
        setTotalNoOfAppsCreated(response.data.data.data.count.totalApps);
        var applistdata = JSON.parse(JSON.stringify(appList));
        applistdata.forEach((element) => {
          const singleAppData = response.data.data.data.apps
            .filter((e) => element.name == e.appName)
            .map((e) => {
              return e;
            });
          if (singleAppData.length != 0) {
            element.logoURL = singleAppData[0].logoUrl;
          }
        });
        if (applistdata.length > 0) {
          setappList(applistdata);
        }
        setAppDetailsData(response.data);
        var appData = [];
        response.data.data.data.apps.map((element) => {
          appData.push({
            name: element.appName,
            status: element.status,
            createTime: element.creationTime,
            logoUrl: element.logoUrl,
            displayName: element.appDisplayName,
            userId: element.userId,
            workspaceName: element.workspaceName,
            lastModified: element.lastUpdatedTime,
            deviceSupport: element.deviceSupport,
            description: element.description,
          });
        });
        setappList(appData);

        setAlphabetSort(appData);
        setIsLoadingAppList(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  var templateApps = [];

  const getTempInfo = async () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/" +
        "Template" +
        "/data",
      headers: {
        workspace: "Intelliflow",
      },
    };
    // axios(config)
    // .then(async (response) => {
    //   console.log("response", response);
    //   setTemplatesCount(response.data.data.data.count.development);
    //   var templateApps = [];
    //   response.data.data.data.apps.map((item) => {
    //     templateApps.push({
    //       appDisplayName: item.appDisplayName,
    //       appName: item.appName,
    //       colorScheme: item.colorScheme,
    //       creationTime: item.creationTime,
    //       description: item.description,
    //       deviceSupport: item.deviceSupport,
    //       lastUpdatedTime: item.lastUpdatedTime,
    //       logoUrl: item.logoUrl,
    //       status: item.status,
    //       workspaceName: item.workspaceName,
    //     });
    //   });
    //   setTemplateAppList(templateApps)

    // });
    // console.log("templateAppsList", templateAppsList);

    const response = await axios(config);
    setTemplatesCount(response.data.data.data.count.development);
    console.log("response", response);
    response.data.data.data.apps.map((item) => {
      templateApps.push({
        appDisplayName: item.appDisplayName,
        appName: item.appName,
        colorScheme: item.colorScheme,
        creationTime: item.creationTime,
        description: item.description,
        deviceSupport: item.deviceSupport,
        lastUpdatedTime: item.lastUpdatedTime,
        logoUrl: item.logoUrl,
        status: item.status,
        workspaceName: item.workspaceName,
      });
    });
    console.log("templateApps", templateApps);
    setTemplateAppList(templateApps);
  };

  // const getTempInfo = async () => {
  //   var config = {
  //     method: "get",
  //     url:
  //       process.env.REACT_APP_MODELLER_API_ENDPOINT +
  //       "modellerService/" +
  //       "Template" +
  //       "/data",
  //     headers: {
  //       workspace: "Intelliflow",
  //     },
  //   };

  //   const response = await axios(config);
  //   setTemplatesCount(response.data.data.data.count.development);
  //   console.log("response", response);
  //   response.data.data.data.apps.map((item) => {
  //     templateApps.push({
  //       appDisplayName: item.appDisplayName,
  //       appName: item.appName,
  //       colorScheme: item.colorScheme,
  //       creationTime: item.creationTime,
  //       description: item.description,
  //       deviceSupport: item.deviceSupport,
  //       lastUpdatedTime: item.lastUpdatedTime,
  //       logoUrl: item.logoUrl,
  //       status: item.status,
  //       workspaceName: item.workspaceName,
  //     });
  //   });
  //   setTemplateAppList(templateApps);
  // };

  const determineFormFlag = () => {
    if (formSelected == true && gridSelected == true && sheetSelected == true) {
      return "formGridSheet";
    } else if (
      formSelected == true &&
      gridSelected == true &&
      sheetSelected == false
    ) {
      return "formGrid";
    } else if (
      formSelected == true &&
      sheetSelected == true &&
      gridSelected == false
    ) {
      return "formSheet";
    } else if (
      gridSelected == true &&
      sheetSelected == true &&
      formSelected == false
    ) {
      return "gridSheet";
    } else if (
      formSelected == true &&
      gridSelected == false &&
      sheetSelected == false
    ) {
      return "form";
    } else if (
      formSelected == false &&
      gridSelected == true &&
      sheetSelected == false
    ) {
      return "grid";
    } else if (
      formSelected == false &&
      gridSelected == false &&
      sheetSelected == true
    ) {
      return "sheet";
    }
  };

  const newExcelApp = async () => {
    var axios = require("axios");
    if (uploadedFile) {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 450,
        useWebWorker: true,
      };
      const optionsThumbnail = {
        maxSizeMB: 0.01,
        maxWidthOrHeight: 50,
        useWebWorker: true,
      };
      let uploadedAppLogo;
      await imageCompression(uploadedFile, options).then((x) => {
        uploadedAppLogo = x;
      });
      let uploadedAppLogoThumbnail;
      await imageCompression(uploadedFile, optionsThumbnail).then((x) => {
        uploadedAppLogoThumbnail = x;
      });

      const formData = new FormData();
      formData.append("file", uploadedAppLogo);
      const formDataThumbnail = new FormData();
      formDataThumbnail.append("file", uploadedAppLogoThumbnail);
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
              name.replace(/\s+/g, "-").toLowerCase(),
          },
        }
      );
      axios.post(
        `${
          process.env.REACT_APP_CDS_ENDPOINT
        }appLogo/upload?Authorization=${localStorage.getItem(
          "token"
        )}&workspace=${localStorage.getItem("workspace")}`,
        formDataThumbnail,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            logoName:
              localStorage.getItem("workspace") +
              `${name.replace(/\s+/g, "-").toLowerCase()}_thumbnail`,
          },
        }
      );
    }

    const excelbase64 = await convertBase64(selectedExcel);
    var spliteddata = excelbase64.split(",");
    // var axios = require("axios");
    // localStorage.setItem("displayName", name);
    // localStorage.setItem("appName", name);
    var data = JSON.stringify({
      requestModel: {
        formFlag: determineFormFlag(),
        logoURL: uploadedFile ? "true" : "false",
        workspaceName: localStorage.getItem("workspace"),
        description: description,
        miniAppName: name,
        excelContent: spliteddata[1],
        startColumnNumber: startColumnNumber,
        startRowNumber: startRowNumber,
      },
    });
    console.log("excel data", data);

    var config = {
      method: "POST",
      url: `${process.env.REACT_APP_EXCELAPP_SERVICE}EXCEL/excel/${name}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setCreateExcelStatus(true);
        excelAppStatus();
        CreateCreateNewAppUsingExcelClose();
        setCreateNewAppUsingExcelModal();
        loadApps();
      })
      .catch(function (error) {
        CreateCreateNewAppUsingExcelClose();
        console.log(error);
      });
  };

  const excelAppStatus = async () => {
    let attempts = 0;
    let intervalId = setInterval(() => {
      var axios = require("axios");
      var config = {
        method: "get",
        url:
          process.env.REACT_APP_EXCELAPP_ENDPOINT +
          "gensis/" +
          localStorage.getItem("workspace") +
          `/` +
          `${name.replace(/\s+/g, "-").toLowerCase()}`,
        headers: {},
      };

      axios(config)
        .then(function (response) {
          // console.log("response", response);
          localStorage.setItem("appName", response.data.appName);
          localStorage.setItem("displayName", response.data.appDisplayName);
          setStepTextColor("selectedTextColor");

          setCreateNewAppUsingExcelModal(false);
          if (response.data.status == "UPLOADING") {
            updateStep(1);
          }
          if (response.data.status == "BINDING") {
            updateStep(2);
          }
          if (response.data.status == "COMPLETED") {
            updateStep(3);
            clearInterval(intervalId);
          }
          if (response.data.status == "FAILED") {
            clearValue();
            const id = toast.loading("validating....");
            setCreateExcelStatus(false);
            toast.update(id, {
              render: "App creation failed",
              position: "top-center",
              autoClose: 6000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              type: "error",
              isLoading: false,
            });
            clearInterval(intervalId);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
      if (attempts > 30) {
        clearInterval(intervalId);
      } else {
        attempts = attempts + 1;
      }
    }, 1000);
  };
  // console.log("selectedExcel", selectedExcel);

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  const showMapData = () => {
    setMapData(!mapData);
  };

  const onOpenEditModal = () => {
    setShowEditModel(!showEditModel);
  };
  const onOpenNewAppModal = () => {
    setShowNewAppModel(!showNewAppModel);
  };
  const onOpenDeleteModal = () => {
    setShowDeleteModel(!showDeleteModel);
  };

  const onOpenExcelModal = () => {
    setShowExcelModel(!showExcelModel);
  };
  const onOpenPreviewModel = (e) => {
    setShowPreviewModel(!showPreviewModel);
    setAppName(e);
    selectPreview(e);
  };
  const onCloseModalOne = () => {
    setOpenModelOne(false);
  };

  function step2Validator() {
    return true;
  }

  function handlesort() {
    const sortedData = [...alphabetSort].sort((a, b) => {
      return a.name > b.name ? 1 : -1;
    });
    setAlphabetSort(sortedData);
  }

  const sortingByName = () => {
    var appListTemp = [...appList];
    appListTemp.sort((a, b) => {
      if (b.name > a.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1;
      } else {
        return 0;
      }
    });
    setappList(appListTemp);
  };

  const sortingByNameReverse = () => {
    var appListTemp = [...appList];
    appListTemp.sort((a, b) => {
      if (a.name > b.name) {
        return -1;
      } else if (b.name > a.name) {
        return 1;
      } else {
        return 0;
      }
    });
    setappList(appListTemp);
  };

  const sortingByDate = () => {
    var appListTemp = [...appList];
    appListTemp.sort(function (a, b) {
      return new Date(b.createTime) - new Date(a.createTime);
    });
    setappList(appListTemp);
  };
  const sortingByDateReverse = () => {
    var appListTemp = [...appList];
    appListTemp.sort(function (a, b) {
      return new Date(a.createTime) - new Date(b.createTime);
    });
    setappList(appListTemp);
  };

  const sortappsdata = () => {
    var appListTemp = appList;
    var finalarr = sortingByName(appListTemp);
    setappList(finalarr);
  };

  const handleFilter = (event) => {
    console.log("inside handle Filter");
    setIsFiltering(true);
    setIssorting(false);
    const { name, checked } = event.target;
    setFiltersMobileWeb((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
    if (offset !== 1) {
      console.log("offs3et iff");
      setOffset(1);
    }
    let filterCritertia;
    if (checked && name === "D" && filtersMobileWeb?.M) {
      console.log("inside both");
      filterCritertia = '[{"devicesupport":"B"}]';
    } else if (checked && name === "D") {
      console.log("inside Web");
      filterCritertia = '[{"devicesupport":"D"}]';
    } else if (checked && name === "M") {
      console.log("inside Mobile");
      filterCritertia = '[{"devicesupport":"M"}]';
    }

    setFilterParam(filterCritertia);
    fetchFilterData(filterCritertia);
  };

  const fetchFilterData = (filter) => {
    let encodedFilterCriteria = encodeURIComponent(
      filter ? filter : filterParam
    );
    encodedFilterCriteria = encodedFilterCriteria.replace(/\+/g, "%20");
    const url = `${
      process.env.REACT_APP_MODELLER_API_ENDPOINT
    }modellerService/${localStorage.getItem("workspace")}/data`;
    const queryParams = `?page=${offset}&size=50&filter=${encodedFilterCriteria}`;
    const apiUrl = url + queryParams;
    let config = {
      method: "get",
      url: apiUrl,
      headers: {
        workspace: localStorage.getItem("workspace"),
        Authorization: localStorage.getItem("token"),
      },
    };
    axios
      .request(config)
      .then((res) => {
        if (res?.data?.data?.data?.count?.totalPages) {
          setPageCount(res.data.data.data.count.totalPages);
        }
        var sortedAppData = [];
        res.data.data.data.apps.map((element) => {
          sortedAppData.push({
            name: element.appName,
            status: element.status,
            createTime: element.creationTime,
            logoUrl: element.logoUrl,
            displayName: element.appDisplayName,
            userId: element.userId,
            workspaceName: element.workspaceName,
            lastModified: element.lastUpdatedTime,
            deviceSupport: element.deviceSupport,
            description: element.description,
          });
        });
        setappList(sortedAppData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSorting = (event) => {
    setIssorting(true);
    setIsFiltering(false);
    if (offset !== 1) {
      console.log("offs3et iff");
      setOffset(1);
    }
    const sortingCriteria = event.target.name;
    var sort;
    if (sortingCriteria == "newOld") {
      console.log("true newOld");
      sort = '[{"creationtime":"desc"}]';
    } else if (sortingCriteria == "oldNew") {
      sort = '[{"creationtime":"asc"}]';
    } else if (sortingCriteria == "AtoZ") {
      sort = '[{"appname":"asc"}]';
    } else {
      sort = '[{"appname":"desc"}]';
    }
    setSortParam(sort);
    fetchSoringData(sort);
  };

  const fetchSoringData = (sort) => {
    let encodedSortCriteria = encodeURIComponent(sort ? sort : sortParam);
    encodedSortCriteria = encodedSortCriteria.replace(/\+/g, "%20");
    const baseUrl = `${
      process.env.REACT_APP_MODELLER_API_ENDPOINT
    }modellerService/${localStorage.getItem("workspace")}/data`;
    const queryParams = `?page=${offset}&size=50&sort=${encodedSortCriteria}`;
    const apiUrl = baseUrl + queryParams;
    let config = {
      method: "get",
      url: apiUrl,
      headers: {
        workspace: localStorage.getItem("workspace"),
        Authorization: localStorage.getItem("token"),
      },
    };
    axios.request(config).then((res) => {
      if (res?.data?.data?.data?.count?.totalPages) {
        setPageCount(res.data.data.data.count.totalPages);
      }
      var sortedAppData = [];
      res.data.data.data.apps.map((element) => {
        sortedAppData.push({
          name: element.appName,
          status: element.status,
          createTime: element.creationTime,
          logoUrl: element.logoUrl,
          displayName: element.appDisplayName,
          userId: element.userId,
          workspaceName: element.workspaceName,
          lastModified: element.lastUpdatedTime,
          deviceSupport: element.deviceSupport,
          description: element.description,
        });
      });
      setappList(sortedAppData);
    });
  };

  const screenSelectionToggler = (screenType) => {
    // let screensTemp = screens;

    if (screenType == "web") {
      setIsWeb(!isWeb);
    } else if (screenType == "mobile") {
      setIsMobile(!isMobile);
    }
  };

  const targetDevices = () => {
    if (isWeb == true && isMobile == true) {
      setTargetDevice("B");
    } else if (isWeb == true && isMobile == false) {
      setTargetDevice("D");
    } else if (isMobile == true && isWeb == false) {
      setTargetDevice("M");
    } else if (isMobile == false && isWeb == false) {
      setTargetDevice("");
    }
  };

  const targetDeviceEdit = (value) => {
    if (value == "B") {
      setIsMobile(true);
      setIsWeb(true);
    } else if (value == "D") {
      setIsMobile(false);
      setIsWeb(true);
    } else if (value == "M") {
      setIsMobile(true);
      setIsWeb(false);
    } else if (value == "") {
      setIsMobile(false);
      setIsWeb(false);
    }
  };

  useEffect(() => {
    targetDevices();
  }, [isWeb, isMobile]);

  const Publichistory = () => {};

  const handleDeleteApplication = (e, displayDeleteName) => {
    setDisplayDeleteAppName(displayDeleteName);
    setDeleteAppName(e);
    onOpenDeleteModal();
  };

  const onOpenModalOne = () => {
    setOpenModelOne(true);
    setShowNewAppModel(false);
  };
  const closeIcon = (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.83265 7.00019L13.5244 2.71019C13.7299 2.52188 13.8453 2.26649 13.8453 2.00019C13.8453 1.73388 13.7299 1.47849 13.5244 1.29019C13.319 1.10188 13.0403 0.996094 12.7497 0.996094C12.4592 0.996094 12.1805 1.10188 11.975 1.29019L7.29419 5.59019L2.61333 1.29019C2.40787 1.10188 2.12921 0.996094 1.83865 0.996094C1.54808 0.996094 1.26942 1.10188 1.06396 1.29019C0.858499 1.47849 0.743073 1.73388 0.743073 2.00019C0.743073 2.26649 0.858499 2.52188 1.06396 2.71019L5.75573 7.00019L1.06396 11.2902C0.961691 11.3831 0.880519 11.4937 0.825125 11.6156C0.769731 11.7375 0.741211 11.8682 0.741211 12.0002C0.741211 12.1322 0.769731 12.2629 0.825125 12.3848C0.880519 12.5066 0.961691 12.6172 1.06396 12.7102C1.16539 12.8039 1.28607 12.8783 1.41903 12.9291C1.55199 12.9798 1.69461 13.006 1.83865 13.006C1.98269 13.006 2.1253 12.9798 2.25826 12.9291C2.39122 12.8783 2.5119 12.8039 2.61333 12.7102L7.29419 8.41019L11.975 12.7102C12.0765 12.8039 12.1972 12.8783 12.3301 12.9291C12.4631 12.9798 12.6057 13.006 12.7497 13.006C12.8938 13.006 13.0364 12.9798 13.1693 12.9291C13.3023 12.8783 13.423 12.8039 13.5244 12.7102C13.6267 12.6172 13.7079 12.5066 13.7633 12.3848C13.8186 12.2629 13.8472 12.1322 13.8472 12.0002C13.8472 11.8682 13.8186 11.7375 13.7633 11.6156C13.7079 11.4937 13.6267 11.3831 13.5244 11.2902L8.83265 7.00019Z"
        fill="white"
      />
    </svg>
  );

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const clearValue = () => {
    setName("");
    setSelectedExcel(null);
    setAppCreationStatus({
      status: false,
      message: "",
      style: "",
    });
    setDescription("");
    setFormSelected(false);
    setGridSelected(false);
    setSheetSelected(false);
  };

  const handleEditApplication = (cards) => {
    const url = `${
      process.env.REACT_APP_CDS_ENDPOINT
    }appLogo/image/${localStorage.getItem("workspace")}${
      cards.name
    }?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;
    const urlThumbnail = `${
      process.env.REACT_APP_CDS_ENDPOINT
    }appLogo/image/${localStorage.getItem("workspace")}${
      cards.name
    }_thumbnail?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;
    fetch(url).then(async (response) =>
      setImageStatus({
        status: response.status,
        url: url,
        urlThumbnail: urlThumbnail,
      })
    );
    setName(cards.displayName ? cards.displayName : cards.name);
    setAppNameOld(cards.displayName ? cards.displayName : cards.name);
    setPreviousAppName(cards.name);
    setDescription(cards.description);
    setDescriptionOld(cards.description);
    setTargetDevice(cards.deviceSupport);
    setTargetDeviceOld(cards.deviceSupport);
    targetDeviceEdit(cards.deviceSupport);
    onOpenEditModal(cards.name);
  };

  const reNameApp = async () => {
    const id = toast.loading("Updating App....");
    var axios = require("axios");

    if (uploadedFile == null) {
      const AppImage = `${
        process.env.REACT_APP_CDS_ENDPOINT
      }appLogo/image/${localStorage.getItem(
        "workspace"
      )}${previousAppName}?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`;
      const AppImageThumbnail = `${
        process.env.REACT_APP_CDS_ENDPOINT
      }appLogo/image/${localStorage.getItem(
        "workspace"
      )}${previousAppName}_thumbnail?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`;

      fetch(AppImage).then(async (response) => {
        const AppImageBlob = await response.blob();
        const AppImageBlobImage = new File([AppImageBlob], "image.jpg", {
          type: "image/jpg",
        });
        const options = {
          useWebWorker: true,
        };
        let uploadedAppLogo;
        await imageCompression(AppImageBlobImage, options).then((x) => {
          uploadedAppLogo = x;
        });
        const formData = new FormData();
        formData.append("file", uploadedAppLogo);
        axios.post(
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
                name.replace(/\s+/g, "-").toLowerCase(),
            },
          }
        );
      });
      fetch(AppImageThumbnail).then(async (response) => {
        const AppImageThumbnailBlob = await response.blob();
        const AppImageThumbnailBlobImage = new File(
          [AppImageThumbnailBlob],
          "image.jpg",
          {
            type: "image/jpg",
          }
        );
        const optionsThumbnail = {
          useWebWorker: true,
        };
        let uploadedAppLogoThumbnail;
        await imageCompression(
          AppImageThumbnailBlobImage,
          optionsThumbnail
        ).then((x) => {
          uploadedAppLogoThumbnail = x;
        });
        const formDataThumbnail = new FormData();
        formDataThumbnail.append("file", uploadedAppLogoThumbnail);
        axios.post(
          `${
            process.env.REACT_APP_CDS_ENDPOINT
          }appLogo/upload?Authorization=${localStorage.getItem(
            "token"
          )}&workspace=${localStorage.getItem("workspace")}`,
          formDataThumbnail,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              logoName:
                localStorage.getItem("workspace") +
                `${name.replace(/\s+/g, "-").toLowerCase()}_thumbnail`,
            },
          }
        );
      });
    } else {
      if (uploadedFile) {
        const options = {
          maxSizeMB: 0.1,
          maxWidthOrHeight: 450,
          useWebWorker: true,
        };
        const optionsThumbnail = {
          maxSizeMB: 0.01,
          maxWidthOrHeight: 50,
          useWebWorker: true,
        };
        let uploadedAppLogo;
        await imageCompression(uploadedFile, options).then((x) => {
          uploadedAppLogo = x;
        });
        let uploadedAppLogoThumbnail;
        await imageCompression(uploadedFile, optionsThumbnail).then((x) => {
          uploadedAppLogoThumbnail = x;
        });

        const formData = new FormData();
        formData.append("file", uploadedAppLogo);
        const formDataThumbnail = new FormData();
        formDataThumbnail.append("file", uploadedAppLogoThumbnail);
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
                name.replace(/\s+/g, "-").toLowerCase(),
            },
          }
        );
        await axios.post(
          `${
            process.env.REACT_APP_CDS_ENDPOINT
          }appLogo/upload?Authorization=${localStorage.getItem(
            "token"
          )}&workspace=${localStorage.getItem("workspace")}`,
          formDataThumbnail,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              logoName:
                localStorage.getItem("workspace") +
                `${name.replace(/\s+/g, "-").toLowerCase()}_thumbnail`,
            },
          }
        );
      }
    }

    var data = JSON.stringify({
      workspaceName: localStorage.getItem("workspace"),
      initialName: previousAppName,
      updateName: name,
      description: description,
      deviceSupport: targetDevice,
      colorScheme: "",
      logoURL: uploadedFile ? "true" : "false",
    });

    var config = {
      method: "post",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/updateApp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        loadApps();
        setShowEditModel();
        toast.update(id, {
          render: "Updated Successfully!",
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "success",
          isLoading: false,
        });
      })
      .catch(function (error) {
        console.log(error);
        toast.update(id, {
          render: "Update Fail",
          position: "top-center",
          autoClose: 6000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          type: "error",
          isLoading: false,
        });
      });
  };

  const CreateApplicationClose = (e) => {
    setShowNewAppModel(e);
    setUploadedFile(null);
    setUploadedFilePreview(null);
    clearValue();
    setDescription(null);
    setTargetDevice("");
    setIsMobile(false);
    setIsWeb(false);
    setInvalidFileType(false);
  };

  const CreateCreateNewAppUsingExcelClose = (e) => {
    setCreateNewAppUsingExcelModal(e);
    setUploadedFile(null);
    setUploadedFilePreview(null);
    clearValue();
    setDescription(null);
    setTargetDevice("");
    setIsMobile(false);
    setIsWeb(false);
    setStartColumnNumber("");
    setStartRowNumber("");
  };

  const handleEditModalClose = (value) => {
    setUploadedFile(null);
    setUploadedFilePreview(null);
    setShowEditModel(value);
    setPreviousAppName("");
    setDescription("");
    setDescriptionOld("");
    setTargetDevice("");
    setTargetDeviceOld("");
    targetDeviceEdit("");
    setName("");
    setAppNameOld("");
    setImageStatus({ status: "", url: "", urlThumbnail: "" });
  };
  // console.log("setSelected esfdasf", selectedExcel.name);
  const [uploadedExcelName, setUploadedExcelName] = useState("");
  const uploadedExcel = () => {};

  const appTemplates = [
    {
      id: 1,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
    {
      id: 2,
      tempImage: "",
      tempName: "Survey Forms",
    },
    {
      id: 3,
      tempImage: "",
      tempName: "Bank Loan App",
    },
    {
      id: 4,
      tempImage: "",
      tempName: "Leave Application",
    },
    {
      id: 5,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
    {
      id: 6,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
    {
      id: 7,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
    {
      id: 8,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
    {
      id: 9,
      tempImage: "",
      tempName: "Employee Onboarding",
    },
  ];

  const appsCount = useRecoilValue(dataCount);
  var totalAppCount = appsCount.published + appsCount.development;
  var uploadedExcelSize = selectedExcel?.size;
  const sizes = ["bytes", "Kb", "Mb", "GiB"];
  function getExcelFileSize(size) {
    let l = 0,
      n = parseInt(size, 10) || 0;
    while (n >= 1024 && ++l) {
      n = n / 1024;
    }
    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + sizes[l];
  }
  const excelSize = getExcelFileSize(uploadedExcelSize);
  // console.log("excelSize", excelSize);

  const acceptedFormats = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/svg+xml",
  ];
  const [invalidFileType, setInvalidFileType] = useState(false);

  const checkImage = (e) => {
    if (
      e.target.files[0] &&
      !acceptedFormats.includes(e.target.files[0].type)
    ) {
      setInvalidFileType(true);
      setUploadedFile(null);
    } else {
      setUploadedFile(e.target.files[0]);
    }
  };

  const [activeTab, setActiveTab] = useState("applications");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    getTempInfo();
  };

  const handleUsersListChange = (event) => {
    const { name, checked } = event.target;
    setFiltersMobileWeb((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  return (
    <>
      <div className="appdesigner-application-container">
        <div className="your-application customScrollBar">
          {[
            "APPDESIGNER_CREATE",
            "APPDESIGNER_CREATE_TEMPLATE",
            "APPDESIGNER_CREATE_EXCEL",
          ].some((e) =>
            loggedInUser?.enabled_menus?.menus_enabled?.includes(e)
          ) && (
            <Row className="create-new-wrapper">
              <div className="create-app-wrapper customScrollBar">
                {loggedInUser?.enabled_menus?.menus_enabled?.includes(
                  "APPDESIGNER_CREATE"
                ) &&
                  (totalNoOfAppsCreated < noOfAppsAllowed ? (
                    <div
                      className="create-app-box"
                      onClick={onOpenNewAppModal}
                      style={{
                        pointerEvents:
                          isLoadingMainContent == true ? "none" : "unset",
                      }}
                    >
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          <CreateAppScratch className="svg-fill iconSvgFillColor" />
                        </div>
                        <div className="create-app-scratch">
                          <h5 className="create-app-title primaryColor">
                            {t("createApplication")}
                          </h5>
                          <p className="create-app-subtitle secondaryColor">
                            {t("startFromScratch")}
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ) : (
                    <div className="create-app-box-not-allowed">
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          <CreateAppScratch
                            className="svg-fill iconSvgFillColor"
                            style={{ opacity: "0.5" }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title primaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("createApplication")}
                          </h5>
                          <p
                            className="create-app-subtitle secondaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("startFromScratch")}
                          </p>
                          <p className="exceedWarning">
                            Maximum number of Apps limit reached
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ))}
                {loggedInUser?.enabled_menus?.menus_enabled?.includes(
                  "APPDESIGNER_CREATE_EXCEL"
                ) &&
                  (totalNoOfAppsCreated < noOfAppsAllowed ? (
                    <div
                      className="create-app-box"
                      onClick={() => {
                        setCreateNewAppUsingExcelModal(true);
                      }}
                      style={{
                        pointerEvents:
                          isLoadingMainContent == true ? "none" : "unset",
                      }}
                    >
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          <CreateAppExcel className="svg-stroke iconSvgStrokeColor" />
                        </div>
                        <div className="create-app-scratch">
                          <h5 className="create-app-title primaryColor">
                            {t("createApplicationFromExcel")}{" "}
                          </h5>
                          <p className="create-app-subtitle secondaryColor">
                            {t("generateFromSpreadsheet")}
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ) : (
                    <div className="create-app-box-not-allowed">
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          {/* <img src={CreateAppExcel} /> */}
                          <CreateAppExcel
                            className="svg-stroke iconSvgStrokeColor"
                            style={{ opacity: "0.5" }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title primaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("createApplicationFromExcel")}{" "}
                          </h5>
                          <p
                            className="create-app-subtitle secondaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("generateFromSpreadsheet")}
                          </p>
                          <p className="exceedWarning">
                            Maximum number of Apps limit reached
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ))}
                {loggedInUser?.enabled_menus?.menus_enabled?.includes(
                  "APPDESIGNER_CREATE_TEMPLATE"
                ) &&
                  (totalNoOfAppsCreated < noOfAppsAllowed ? (
                    <div
                      className="create-app-box"
                      style={{
                        pointerEvents:
                          isLoadingMainContent == true ? "none" : "unset",
                      }}
                      onClick={() => handleTabChange("templates")}
                      role="tab"
                      aria-controls=""
                      aria-selected={activeTab === "templates"}
                    >
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          <CreateAppTemplate className="svg-stroke iconSvgStrokeColor" />
                        </div>
                        <div className="create-app-scratch">
                          <h5 className="create-app-title primaryColor">
                            {t("createApplicationFromTemplate")}
                          </h5>
                          <p className="create-app-subtitle secondaryColor">
                            {t("inspiredByappTemplate")}
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ) : (
                    <div
                      className="create-app-box-not-allowed"
                      role="tab"
                      aria-controls=""
                      aria-selected={activeTab === "templates"}
                    >
                      <LoadingWrapper isLoading={isLoadingMainContent}>
                        <div className="create-app-icon">
                          <CreateAppTemplate
                            className="svg-stroke iconSvgStrokeColor"
                            style={{ opacity: "0.5" }}
                          />
                        </div>
                        <div className="create-app-scratch">
                          <h5
                            className="create-app-title primaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("createApplicationFromTemplate")}
                          </h5>
                          <p
                            className="create-app-subtitle secondaryColor"
                            style={{ opacity: "0.5" }}
                          >
                            {t("inspiredByappTemplate")}
                          </p>
                          <p className="exceedWarning">
                            Maximum number of Apps limit reached
                          </p>
                        </div>
                      </LoadingWrapper>
                    </div>
                  ))}
              </div>
            </Row>
          )}
          <div id="pillApps" className="application-title-wrap py-2 BodyColor">
            <ul class="nav nav-pills BodyColor" id="pills-tab" role="tablist">
              <li class="nav-item " role="presentation">
                <label
                  class={`nav-link  propertiesPopup yourAppsLabel BodyColor  ${
                    activeTab === "applications" ? "active " : ""
                  }`}
                  id="pills-tab-ifapps"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-ifapps"
                  type="button"
                  role="tab"
                  aria-controls="pills-ifapps"
                  aria-selected={activeTab === "applications"}
                  data-mdb-toggle="tab"
                  onClick={() => handleTabChange("applications")}
                >
                  <h4 className="yourAppTab primaryColor">
                    {" "}
                    {t("application")}
                    {/* ({totalAppCount ? totalAppCount : ""}) */}
                  </h4>
                </label>
              </li>
              <li
                class="nav-item"
                role="presentation"
                style={{ marginLeft: "10px" }}
              >
                <label
                  class={`nav-link  propertiesPopup yourAppsLabel BodyColor ${
                    activeTab === "templates" ? "active" : ""
                  }`}
                  id="pills-tab-iftemp"
                  data-bs-toggle="pill"
                  // data-bs-target={setShowTemplate ? "#pills-iftemp" : ""}
                  data-bs-target="#pills-iftemp"
                  type="button"
                  role="tab"
                  aria-controls="pills-tab-ifcenter"
                  aria-selected={activeTab === "templates"}
                  data-mdb-toggle="tab"
                  onClick={() => handleTabChange("template")}
                >
                  <h4 className="yourAppTab primaryColor">{t("template")}</h4>
                </label>
              </li>
            </ul>
            <ul>
              <li>
                <Dropdown
                  className="dropdown"
                  onMouseLeave={() => setShow(false)}
                  onMouseOver={() => setShow(true)}
                >
                  <Dropdown.Toggle
                    variant=""
                    className="p-0 primaryColor"
                    id="dropdown-basic"
                  >
                    <Icon icon="gg:sort-za" className="primaryColor" />
                    {t("sort")}
                  </Dropdown.Toggle>

                  <Dropdown.Menu show={show} className="BodyColor">
                    <h5 className="dropdown-title primaryColor">{t("sort")}</h5>
                    <Dropdown.Item
                      id="yourApp-sort-new"
                      onClick={handleSorting}
                      className="secondaryColor"
                      name="newOld"
                    >
                      {t("newOld")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="yourApp-sort-old"
                      onClick={handleSorting}
                      className="secondaryColor"
                      name="oldNew"
                    >
                      {t("oldNew")}
                    </Dropdown.Item>
                    {/* <button onClick={handlesort} id="sort-A-Z "> A-Z</button> */}
                    <Dropdown.Item
                      id="yourApp-sort-name"
                      onClick={handleSorting}
                      href="#"
                      className="secondaryColor"
                      name="AtoZ"
                    >
                      {t("az")}
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="yourApp-sort-name-rev"
                      onClick={handleSorting}
                      href="#"
                      className="secondaryColor"
                      name="ZtoA"
                    >
                      {t("za")}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li>
                <Dropdown
                  onMouseOut={() => setShowFilter(false)}
                  onMouseOver={() => setShowFilter(true)}
                >
                  <Dropdown.Toggle
                    variant=""
                    className="p-0 primaryColor"
                    id="dropdown-basic"
                  >
                    <Icon
                      icon="bx:filter-alt"
                      className="primaryColor"
                      vFlip={true}
                    />
                    {t("filter")}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="BodyColor" show={showFilter}>
                    <h4 className="dropdown-title primaryColor">
                      {t("filter")}
                    </h4>
                    <div className="dropdown-item dropdown-option-container">
                      <label className="secondaryColor">{t("mobile")}</label>
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        // name={user.username}
                        // checked={user?.selectedForWrite || false}
                        // id="selectedForWrite"
                        name="M"
                        checked={filtersMobileWeb.M}
                        onChange={handleFilter}
                      ></input>
                    </div>
                    <div className=" dropdown-item dropdown-option-container">
                      <label className="secondaryColor">{t("web")}</label>
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        // name={user.username}
                        // checked={user?.selectedForWrite || false}
                        // id="selectedForWrite"
                        name="D"
                        checked={filtersMobileWeb.D}
                        onChange={handleFilter}
                      ></input>
                    </div>
                    {/* <div className=" dropdown-item dropdown-option-container">
                      <label className="secondaryColor">Others</label>
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        // name={user.username}
                        // checked={user?.selectedForWrite || false}
                        // id="selectedForWrite"
                        name="U"
                        checked={filtersMobileWeb.U}
                        onChange={handleUsersListChange}
                      ></input>
                    </div> */}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            </ul>
          </div>
          <div class="tab-content" id="pills-tabContent">
            <div
              className={`tab-pane fade ${
                activeTab === "applications" ? "show active" : ""
              }`}
              // class="tab-pane fade show active"
              id="pills-ifapps"
              role="tabpanel"
              aria-labelledby="pills-ifapps"
            >
              <div
                className="appdesigner-application-wrap"
                // style={{
                //   height: [
                //     "APPDESIGNER_CREATE",
                //     "APPDESIGNER_CREATE_TEMPLATE",
                //     "APPDESIGNER_CREATE_EXCEL",
                //   ].some((e) =>
                //     loggedInUser?.enabled_menus?.menus_enabled?.includes(e)
                //   )
                //     ? "54vh"
                //     : "81vh",
                // }}
              >
                {loggedInUser?.enabled_menus?.menus_enabled?.includes(
                  "APPDESIGNER_CREATE"
                ) && (
                  <></>
                  // <div
                  //   className="appdesigner-application-item "
                  //   id="open-new-appModal"
                  //   onClick={onOpenNewAppModal}
                  // >
                  //   <div className="application-img">
                  //     <img alt="#" src={ApplicationIcon} />
                  //   </div>
                  //   <Link to="#" id="create-application">
                  //     <span id="create-application-span">
                  //       <PulseFillIcon />
                  //     </span>
                  //     Create ApplicationCreate Application
                  //   </Link>
                  // </div>
                )}
                <LoadingWrapperCard
                  isLoading={isLoadingAppList}
                  numberOfLoaders="10"
                >
                  {appList
                    // .filter((item) => {
                    //   const isDeviceSupported = ["B", "D", "M"].includes(
                    //     item.deviceSupport
                    //   );
                    //   const isDeviceNotSupported = !["B", "D", "M"].includes(
                    //     item.deviceSupport
                    //   );
                    //   const isDSelected =
                    //     filtersMobileWeb.D && item.deviceSupport === "D";
                    //   const isMSelected =
                    //     filtersMobileWeb.M && item.deviceSupport === "M";

                    //   if (
                    //     filtersMobileWeb.D ||
                    //     filtersMobileWeb.M ||
                    //     filtersMobileWeb.U
                    //   ) {
                    //     if (
                    //       filtersMobileWeb.D &&
                    //       filtersMobileWeb.M &&
                    //       isDeviceSupported
                    //     ) {
                    //       // console.log("Excluded 1: ", item);
                    //       return true;
                    //     }
                    //     if (filtersMobileWeb.U && isDeviceNotSupported) {
                    //       // console.log("Excluded 4: ", item);
                    //       return true;
                    //     }

                    //     if (filtersMobileWeb.M && isMSelected) {
                    //       // console.log("Excluded 2: ", item);
                    //       return true;
                    //     }

                    //     if (filtersMobileWeb.D && isDSelected) {
                    //       // console.log("Excluded 3: ", item);
                    //       return true;
                    //     }

                    //     // console.log("Included: ", item);
                    //     return false;
                    //   }

                    //   return true;
                    // })

                    // .filter((e) =>
                    //   e.displayName?.toLowerCase().includes(searchValue)
                    // )
                    .map((cards) => {
                      return (
                        <div
                          className="appdesigner-application-item BodyColor"
                          key={cards.name}
                        >
                          <Dropdown className="dropdown kebabMenu">
                            <Dropdown.Toggle
                              variant=""
                              className="p-0"
                              id="dropdown-basic"
                            >
                              {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          class="bi bi-three-dots-vertical"
                          viewBox="0 0 16 16"
                        >
                          <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                        </svg> */}
                              <svg
                                width="4"
                                height="18"
                                viewBox="0 0 4 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 10C2.55228 10 3 9.55228 3 9C3 8.44772 2.55228 8 2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2C1 2.55228 1.44772 3 2 3Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M2 17C2.55228 17 3 16.5523 3 16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16C1 16.5523 1.44772 17 2 17Z"
                                  stroke="#A9BBC9"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                              {/* <img src={ThreeDotsMini} alt="" /> */}
                            </Dropdown.Toggle>
                            <Dropdown.Menu className=" appdesigner-dropdownn BodyColor">
                              {loggedInUser.enabled_menus?.menus_enabled?.includes(
                                "APPDESIGNER_DELETE"
                              ) && (
                                <Dropdown.Item
                                  tag={Link}
                                  to={{
                                    pathname: ``,
                                    state: {},
                                  }}
                                  // href="#"
                                  // onClick={}
                                  id="create-app-delete-dropdown"
                                  onClick={() =>
                                    handleDeleteApplication(
                                      cards.name,
                                      cards.displayName
                                        ? cards.displayName
                                        : cards.name
                                    )
                                  }
                                  className="BodyColor primaryColor"
                                >
                                  {" "}
                                  <img src={DeleteIco} height="30px" /> Delete
                                </Dropdown.Item>
                              )}

                              <Dropdown.Item
                                tag={Link}
                                to={{
                                  pathname: ``,
                                  state: {},
                                }}
                                href="#"
                                onClick={() => onOpenPreviewModel(cards.name)}
                                id="create-app-properties-dropdown"
                                className="BodyColor primaryColor"
                              >
                                <img src={PropertiesIco} />
                                Properties
                              </Dropdown.Item>

                              <Dropdown.Item className="BodyColor primaryColor">
                                <Link
                                  to={{
                                    pathname: ``,
                                    state: { appName: cards.name },
                                  }}
                                  className="btn btn-edit primaryColor BodyColor"
                                  onClick={() => handleEditApplication(cards)}
                                  id="create-app-edit-app-dropdown"
                                >
                                  <img src={EditIcon} />
                                  Edit Application
                                </Link>
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                          <div className="insidecard">
                            <div className="application-box-img mt-1">
                              {/* <object
                        data={
                          process.env.REACT_APP_CDS_ENDPOINT + cards.logoUrl
                        }
                        type="image/png"
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                      > */}
                              {cards.logoUrl === "true" ? (
                                <ProgressiveImage
                                  src={`${
                                    process.env.REACT_APP_CDS_ENDPOINT
                                  }appLogo/image/${localStorage.getItem(
                                    "workspace"
                                  )}${
                                    cards.name
                                  }?Authorization=${localStorage.getItem(
                                    "token"
                                  )}&workspace=${localStorage.getItem(
                                    "workspace"
                                  )}`}
                                  placeholderSrc={`${
                                    process.env.REACT_APP_CDS_ENDPOINT
                                  }appLogo/image/${localStorage.getItem(
                                    "workspace"
                                  )}${
                                    cards.name
                                  }_thumbnail?Authorization=${localStorage.getItem(
                                    "token"
                                  )}&workspace=${localStorage.getItem(
                                    "workspace"
                                  )}`}
                                  errorImage={Logo100}
                                />
                              ) : (
                                <img
                                  src={Logo100}
                                  className="appdesignerimage"
                                  alt="App Logo"
                                />
                              )}
                            </div>
                            <div className="application-box-info">
                              <h5 className="primaryColor">
                                <i>
                                  <img
                                    alt=""
                                    id="application-box-image"
                                    src={ApplicationIcon}
                                  />
                                </i>
                                <span
                                  className="cardName secondaryColor"
                                  data-tip
                                  data-for={
                                    cards.displayName
                                      ? cards.displayName
                                      : cards.name
                                  }
                                  id="application-card-name"
                                >
                                  {cards.displayName
                                    ? t(cards.displayName)
                                    : t(cards.name)}
                                </span>
                                <ReactTooltip
                                  id={
                                    cards.displayName
                                      ? t(cards.displayName)
                                      : t(cards.name)
                                  }
                                  place="top"
                                  effect="solid"
                                >
                                  {cards.displayName
                                    ? cards.displayName
                                    : cards.name}
                                </ReactTooltip>
                              </h5>
                              <span id="application-card-date secondaryColor">
                                {/* timezone formatter */}
                                {/* {moment(cards.createTime).format("DD/MM/YYYY,LT")} */}
                                {formatDateTimeInTimezone(cards.createTime)}
                              </span>
                              <div className="application-status-wrap">
                                {/* <p>
                          <span>
                            <Icon icon="mi:users" />
                          </span>
                          3
                        </p> */}
                                {/* <h6
                            className={
                              cards.status == "Active"
                                ? "active-tag tag-item "
                                : "progress-tag tag-item "
                            }
                          >
                            {cards.status}
                          </h6> */}
                                <img
                                  className="application-card-status"
                                  src={
                                    cards.status === "Active"
                                      ? DraftIcon
                                      : PublishedIcon
                                  }
                                />
                              </div>
                            </div>
                            <div className="application-box-wrap">
                              <Link
                                id="application-card-edit"
                                to={{
                                  pathname: `/studio`,
                                  state: {
                                    appName: cards.name,
                                  },
                                }}
                                className="btn btn-edit"
                                onClick={() =>
                                  localStorage.setItem(
                                    "displayName",
                                    cards.displayName
                                      ? cards.displayName
                                      : cards.name
                                  )
                                }
                              >
                                {t("edit")}
                              </Link>
                              <Link
                                id="application-card-properties"
                                to="/"
                                className="btn btn-preview"
                                onClick={() => onOpenPreviewModel(cards.name)}
                              >
                                {t("properties")}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </LoadingWrapperCard>
              </div>
              {pageCount > 0 && (
                <div style={{ marginRight: "50px" }}>
                  <PaginationAppDashboard
                    pageCount={pageCount}
                    setOffset={setOffset}
                    offset={offset}
                  />
                </div>
              )}
            </div>
            <div
              className={`tab-pane fade ${
                activeTab === "templates" ? "show active" : ""
              }`}
              // class="tab-pane fade"
              id="pills-iftemp"
              role="tabpanel"
              aria-labelledby="pills-iftemp"
            >
              <div className="appdesigner-application-wrap customScrollBar">
                {templateAppsList.map((item) => (
                  <div className="template-application-item">
                    <div className="tempIsidieCard">
                      <div className="template-box-wrap">
                        {" "}
                        <Link to="/template" onClick={() => toTemplate(item)}>
                          <img src={templateBoxIcon} /> {t(item.appDisplayName)}{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <CommonModelContainer
          modalTitle="Properties"
          show={showPreviewModel}
          handleClose={onOpenPreviewModel}
          className="properties-modal"
          id="create-app-properties-modal"
        >
          {appList
            .filter((e) => e.name === appName)
            .map((e) => {
              return (
                <Row>
                  <div className="col-6">
                    <ul class="propertydetail">
                      <li>
                        <span className="secondaryColor">
                          {t("applicationName")}
                        </span>
                        <p className="secondaryColor" id="prop-app-name">
                          {e?.displayName ? e?.displayName : e?.name}
                        </p>
                      </li>
                      <li>
                        <span className="secondaryColor">Workspace Name</span>
                        <p className="secondaryColor" id="prop-workspace-name">
                          {e?.workspaceName}
                        </p>
                      </li>
                      <li>
                        <span className="secondaryColor">Last Modified</span>
                        <p className="secondaryColor" id="prop-last-modified">
                          {new Date(e?.lastModified).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </li>
                      <li>
                        <span className="secondaryColor">Created On</span>
                        <p className="secondaryColor" id="prop-created-date">
                          {new Date(e?.createTime).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>
                      </li>
                      {/* <li>
                        <span>DeviceSupport</span>
                        <p>{selectAppForPreview?.deviceSupport}</p>
                      </li> */}
                      {/* <li>
                        <span>ColorScheme</span>
                        <p>{selectAppForPreview?.colorScheme}</p>
                      </li> */}
                    </ul>
                  </div>
                  <div className="col-6">
                    <ul class="propertydetail">
                      <li>
                        <span className="secondaryColor">Device Support</span>
                        <p className="secondaryColor" id="prop-device-support">
                          {e?.deviceSupport == "B"
                            ? "Mobile & Web"
                            : e?.deviceSupport == "D"
                            ? t("web")
                            : e?.deviceSupport == "M"
                            ? t("mobile")
                            : "Device Not Specified"}
                        </p>
                      </li>
                      <li>
                        <span className="secondaryColor">UserId</span>
                        <p className="secondaryColor" id="prop-user-id">
                          {e?.userId.charAt(0).toUpperCase() +
                            e?.userId.toLowerCase().slice(1)}
                        </p>
                      </li>

                      <li>
                        <span className="secondaryColor">Status</span>
                        <p className="secondaryColor" id="prop-status">
                          {e?.status.charAt(0).toUpperCase() +
                            e?.status.toLowerCase().slice(1)}
                        </p>
                      </li>
                      <li>
                        <span className="secondaryColor">
                          {t("description")}
                        </span>
                        <p className="secondaryColor" id="prop-description">
                          {e?.description.charAt(0).toUpperCase() +
                            e?.description.toLowerCase().slice(1)}
                        </p>
                      </li>
                    </ul>
                  </div>
                  {/* <Col lg={12} className="properties-table">
              <div class="flex-container">
                <div class="versonhistroy ">
                  <h2>Version History</h2>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Version</th>
                    <th>Date</th>
                    <th>Edited By</th>
                    <th>Approved By</th>
                    <th>Validation</th>
                    <th>Publish</th>
                    <th>Restore</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>V5.1.2 (Current)</td>
                    <td>02-02-2022,05:00 AM</td>
                    <td>Ramiya</td>
                    <td>Mike Ross</td>
                    <td class="text-center">
                      <img src={Tick2} alt="" className="w-20" />
                    </td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>V5.1</td>
                    <td>01-02-2022,09:00 AM</td>
                    <td>Ramiya</td>
                    <td>Mike Ross</td>
                    <td class="text-center">
                      <img src={Tick2} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={UploadFile} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={SharpRestore} alt="" className="w-20" />
                    </td>
                  </tr>
                  <tr>
                    <td>V4</td>
                    <td>01-02-2022,09:00 AM</td>
                    <td>Dharani</td>
                    <td>Mike Ross</td>
                    <td class="text-center">
                      <img src={Tick2} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={UploadFile} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={SharpRestore} alt="" className="w-20" />
                    </td>
                  </tr>
                  <tr>
                    <td>V3</td>
                    <td>01-02-2022,09:00 AM</td>
                    <td>Ramiya</td>
                    <td>Mike Ross</td>
                    <td class="text-center">
                      <img src={Tick2} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={UploadFile} alt="" className="w-20" />
                    </td>
                    <td class="text-center">
                      <img src={SharpRestore} alt="" className="w-20" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col> */}
                </Row>
              );
            })}
        </CommonModelContainer>

        <CommonModelContainer
          // modalTitle="Edit  Application"
          // show={showEditModel}
          // handleClose={onOpenEditModal}
          // className={mapData && "showmap"}

          modalTitle="Edit Application"
          show={showEditModel}
          handleClose={() => handleEditModalClose(false)}
          centered
          size="md"
          className="createapp"
          id="edit-application-modal"
        >
          {/* <div class="editapplication">
            <h3>Edit Application</h3>
          </div>
          <Row>
            <Col lg={6}>
              <div class="applicationname">
                <div class="application">
                  <span>Application Name</span>
                  <input type="text" />
                </div>
                <div class="application">
                  <span>Description</span>
                  <textarea></textarea>
                </div>
                <div class="application">
                  <span>Invite Team Members</span>
                  <input type="text" />
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div class="applicationinfo">
                <div class="chooscolor">
                  <h5>Color Scheme</h5>
                  <div class="color">
                    <input type="color" class="color" />
                    <p>Choosecolor</p>
                  </div>
                </div>
                <div class="chooscolor">
                  <h5>Choose Screen </h5>
                  <div class="choosdevice">
                    <div class="color">
                      <div class="sb-checkbox">
                        <label htmlFor="check4" class="pc">
                          <img src={computerIco} />
                        </label>
                        <input
                          type="checkbox"
                          class="sb-checkbox__input"
                          id="check4"
                          name="check4"
                        />
                        <label
                          class="sb-checkbox__label sb-checkbox__label--orange"
                          htmlFor="check4"
                        ></label>
                      </div>
                      <div class="sb-checkbox">
                        <label htmlFor="check5" class="pc">
                          <img src={mobileIco} />
                        </label>
                        <input
                          type="checkbox"
                          class="sb-checkbox__input"
                          id="check5"
                          name="check4"
                        />
                        <label
                          class="sb-checkbox__label sb-checkbox__label--orange"
                          htmlFor="check5"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="chooscolor">
                  <h5>Upload image</h5>
                  <label htmlhtmlFor="upload-img" class="color colorfile">
                    <input type="file" class="file" id="upload-img" />
                    <Icon icon="ic:outline-photo-size-select-actual" />
                    <p>Upload your image here</p>
                  </label>
                </div>
              </div>
            </Col>
          </Row> */}
          <Modal.Body className=" py-2 px-4 create-new-app-modal">
            <Row>
              <Col>
                <Row>
                  <Col className="me-2">
                    <div class="application py-2">
                      <span
                        className="form-subheading secondaryColor"
                        id="edit-app-title"
                      >
                        {t("applicationName")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <input
                        id="edit-application-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appdesignerinput"
                      />
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col className="me-2">
                    <div class="application">
                      <span className="form-subheading secondaryColor">
                        {t("description")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <textarea
                        id="edit-app-description-text"
                        value={description}
                        onChange={(e) => {
                          let input = e.target.value;
                          setDescriptionCharLeft(250 - input.length);
                          setDescription(e.target.value);
                        }}
                        maxLength="250"
                        className="customScrollBar"
                      />
                      {/* <p className="DescriptionLimit">
                      {descriptionCharLeft}/250
                    </p> */}
                    </div>
                  </Col>
                </Row>

                <Row className="">
                  <Col className="">
                    <div className="py-2">
                      <span
                        className="form-subheading secondaryColor"
                        id="edit-app-decvice-support"
                      >
                        {t("selectDeviceSupport")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <div class="choosdevice pt-2 pb-1">
                        {/* <div class="sb-checkbox"> */}
                        <div
                          id="device-support-web-div"
                          onClick={() => screenSelectionToggler("web")}
                          class="ps-3 col-md-6 col-lg-6 col-sm-6 d-flex align-items-start"
                        >
                          <div className="d-flex flex-column align-items-center justify-content-between">
                            <img
                              id="edit-app-device-support-web-img"
                              className="mt-1"
                              src={isWeb ? LaptopIcoRed : LaptopIco}
                              // onMouseOver={this.src = require({LaptopIcoRed})}
                              // onMouseOut={this.src = require({LaptopIco})}
                              onMouseOver={(e) =>
                                (e.currentTarget.src = LaptopIcoRed)
                              }
                              onMouseOut={
                                (e) => {
                                  if (isWeb) {
                                    e.currentTarget.src = LaptopIcoRed;
                                  } else {
                                    e.currentTarget.src = LaptopIco;
                                  }
                                }
                                // (e.currentTarget.src = LaptopIco)
                              }
                            />
                            <span
                              id="edit-app-device-support-web-span secondaryColor"
                              className={
                                isWeb
                                  ? "choose-screen-text-selected mt-2"
                                  : "choose-screen-text mt-2"
                              }
                              // onMouseOver={e => (e.currentTarget.className = "choose-screen-text-selected")}
                              // onMouseOut={e => (e.currentTarget.className = "choose-screen-text")}
                            >
                              {t("web")}
                            </span>
                          </div>
                        </div>

                        {/* </div> */}
                        {/* <div class="sb-checkbox"> */}
                        <div
                          id="device-support-mobile-div"
                          onClick={() => screenSelectionToggler("mobile")}
                          class="col-md-6 col-lg-6 col-sm-6 d-flex  align-items-start"
                        >
                          <div className="d-flex flex-column align-items-center justify-content-between">
                            <img
                              className="mt-1"
                              id="edit-app-device-support-mob-img"
                              src={isMobile ? PhoneIcoRed : PhoneIco}
                              onMouseOver={(e) =>
                                (e.currentTarget.src = PhoneIcoRed)
                              }
                              onMouseOut={(e) => {
                                if (isMobile) {
                                  e.currentTarget.src = PhoneIcoRed;
                                } else {
                                  e.currentTarget.src = PhoneIco;
                                }
                              }}
                            />
                            <span
                              id="edit-app-device-support-mob-span"
                              className={
                                isMobile
                                  ? "choose-screen-text-selected mt-2 secondaryColor"
                                  : "choose-screen-text mt-2 secondaryColor"
                              }
                            >
                              {t("mobile")}
                            </span>
                          </div>
                        </div>

                        {/* </div> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Col className="ms-2">
                  <div class="py-2">
                    <div className="colorscheme2">
                      <span
                        className="form-subheadingcolor secondaryColor"
                        id="edit-app-color-scheme"
                      >
                        {t("uploadImage")}
                      </span>
                      <div className="appdesignercolorscheme">
                        <div className="">
                          <label
                            id="edit-app-upload-image"
                            className="Browse3 secondaryColor"
                            for="upload-img"
                          >
                            <input
                              type="file"
                              class="file"
                              id="upload-img"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => {
                                setUploadedFile(e.target.files[0]);
                              }}
                              onClick={(e) => {
                                const { target = {} } = e || {};
                                target.value = "";
                              }}
                            />
                            {uploadedFile == null &&
                            imageStatus.status == 404 ? (
                              <>
                                <img src={uploadimageIco} className="mx-1" />
                                Upload image
                              </>
                            ) : uploadedFile == null &&
                              imageStatus.status == 200 ? (
                              <div className="appdesigneruploadimg editAppUpdateImage ">
                                <div style={{ height: "85px", width: "85px" }}>
                                  <ProgressiveImage
                                    src={imageStatus.url}
                                    placeholderSrc={imageStatus.urlThumbnail}
                                    height={85}
                                    width={85}
                                  />
                                </div>
                                <h6 className="primaryColor">
                                  <span className="secondaryColor">
                                    {t("clicktoUpload")}
                                  </span>
                                </h6>
                                <p className="secondaryColor">
                                  {t("Accepted file SVG, PNG OR JPG")}
                                </p>
                              </div>
                            ) : (
                              <div className="appdesigneruploadimg editAppUpdateImage">
                                <img
                                  height={85}
                                  width={85}
                                  className="appdesignerimagecurve"
                                  src={uploadedFilePreview}
                                />

                                <h6 className="primaryColor">
                                  {" "}
                                  <span className="secondaryColor">
                                    {t("clicktoUpload")}
                                  </span>
                                </h6>
                                <p className="secondaryColor">
                                  {t("Accepted file SVG, PNG OR JPG")}
                                </p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Col>
              <Row>
                <div className="col-12 mt-4 mb-2 mt-4 appdesigner-editapp-cancel">
                  <button
                    id="edit-app-cancle-btn"
                    className="secondaryButton cancelBtnAppDash secondaryButtonColor"
                    onClick={() => handleEditModalClose(false)}
                  >
                    Cancel
                  </button>
                  <button
                    id="edit-app-update-btn"
                    disabled={
                      targetDevice == "" ||
                      name == "" ||
                      description == "" ||
                      (appNameOld == name &&
                        descriptionOld == description &&
                        targetDeviceOld == targetDevice)
                        ? true
                        : false
                    }
                    className="primaryButton editAppUpdateBtn"
                    onClick={() => reNameApp()}
                  >
                    Update
                  </button>
                </div>
              </Row>
            </Row>
          </Modal.Body>
        </CommonModelContainer>
        <CommonModelContainer
          modalTitle={t("createNewApp")}
          show={showNewAppModel}
          handleClose={() => CreateApplicationClose(false)}
          centered
          size="md"
          className="createapp"
          id="create-application-model"
        >
          <Modal.Body className="py-2 px-4 create-new-app-modal">
            <Row>
              <Col>
                <Row className="">
                  <Col className="me-2">
                    <div class="application py-2">
                      <span className="form-subheading secondaryColor">
                        {t("applicationName")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <input
                        id="create-app-name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appdesignerinput"
                        placeholder={t("enterApplicationName")}
                      />
                    </div>
                  </Col>
                </Row>

                <Row className="">
                  <Col className="me-2">
                    <div class="py-2 application">
                      <span
                        className="form-subheading secondaryColor"
                        id="create-app-description"
                      >
                        {t("description")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>

                      <textarea
                        id="create-app-desc-text"
                        value={description}
                        onChange={(e) => {
                          let input = e.target.value;
                          setDescriptionCharLeft(250 - input.length);
                          setDescription(e.target.value);
                        }}
                        maxLength="250"
                        className="customScrollBar descTextArea"
                        placeholder={t("enterDescriptionHere")}
                      />
                      {/* <p className="DescriptionLimit">
                      {descriptionCharLeft}/250
                    </p> */}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    className="
                  "
                  >
                    <div className="py-2">
                      <span
                        id="create-app-device-support"
                        className="form-subheading secondaryColor"
                      >
                        {t("selectDeviceSupport")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <div class="choosdevice pt-2 pb-1">
                        {/* <div class="sb-checkbox"> */}
                        <div
                          id="create-app-device-web-div"
                          onClick={() => screenSelectionToggler("web")}
                          class="ps-3 col-md-6 col-lg-6 col-sm-6 d-flex align-items-start"
                        >
                          <div className="d-flex flex-column align-items-center justify-content-between">
                            <img
                              id="create-app-device-support-web"
                              className="mt-1"
                              src={isWeb ? LaptopIcoRed : LaptopIco}
                              onMouseOver={(e) =>
                                (e.currentTarget.src = LaptopIcoRed)
                              }
                              onMouseOut={(e) => {
                                if (isWeb) {
                                  e.currentTarget.src = LaptopIcoRed;
                                } else {
                                  e.currentTarget.src = LaptopIco;
                                }
                              }}
                            />
                            <span
                              id="create-app-device-support-web-span secondaryColor"
                              className={
                                isWeb
                                  ? "choose-screen-text-selected mt-2 secondaryColor"
                                  : "choose-screen-text mt-2 secondaryColor"
                              }
                              // onMouseOver={e => (e.currentTarget.className = "choose-screen-text-selected")}
                              // onMouseOut={e => (e.currentTarget.className = "choose-screen-text")}
                            >
                              {t("web")}
                            </span>
                          </div>
                        </div>

                        {/* </div> */}
                        {/* <div class="sb-checkbox"> */}
                        <div
                          id="create-app-device-support-mobile-div"
                          onClick={() => screenSelectionToggler("mobile")}
                          class="col-md-6 col-lg-6 col-sm-6 d-flex  align-items-start"
                        >
                          <div className="d-flex flex-column align-items-center justify-content-between">
                            <img
                              id="create-app-device-support-mob-image"
                              className="mt-1"
                              src={isMobile ? PhoneIcoRed : PhoneIco}
                              onMouseOver={(e) =>
                                (e.currentTarget.src = PhoneIcoRed)
                              }
                              onMouseOut={(e) => {
                                if (isMobile) {
                                  e.currentTarget.src = PhoneIcoRed;
                                } else {
                                  e.currentTarget.src = PhoneIco;
                                }
                              }}
                            />
                            <span
                              id="create-app-device-support-mob-span"
                              className={
                                isMobile
                                  ? "choose-screen-text-selected mt-2 secondaryColor"
                                  : "choose-screen-text mt-2 secondaryColor"
                              }
                            >
                              {t("mobile")}
                            </span>
                          </div>
                        </div>

                        {/* </div> */}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Col className="ms-2">
                  <div class="py-2">
                    <div className="colorscheme2">
                      <span
                        id="create-app-color-span"
                        className="form-subheading secondaryColor"
                      >
                        {t("uploadImage")}
                      </span>
                      <div className="appdesignercreatecolorscheme">
                        <Row className="">
                          <label
                            id="create-app-upload-img"
                            className="Browse3 secondaryColor"
                            for="upload-img"
                          >
                            <input
                              type="file"
                              class="file"
                              id="upload-img"
                              accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                              onChange={(e) => {
                                checkImage(e);
                              }}
                              onClick={(e) => {
                                const { target = {} } = e || {};
                                target.value = "";
                              }}
                            />
                            {uploadedFile == null ? (
                              <>
                                <img
                                  src={UploadFileCreateApp}
                                  id="create-app-uploaded-img"
                                  className="mx-1"
                                />

                                <h6 className="primaryColor">
                                  {" "}
                                  <span className="secondaryColor">
                                    {t("clicktoUpload")}
                                  </span>
                                  {/* <small>or drag and drop</small> */}
                                </h6>
                                <p className="secondaryColor">
                                  {t("Accepted file SVG, PNG OR JPG")}
                                </p>
                                {invalidFileType && (
                                  <p
                                    className="secondaryColor"
                                    style={{ color: "red" }}
                                  >
                                    Please upload a SVG, PNG or JPG file.
                                  </p>
                                )}
                              </>
                            ) : (
                              <div className="appdesigneruploadimg">
                                <img
                                  id="create-app-upload-preview"
                                  height={85}
                                  width={85}
                                  className="appdesignerimagecurve"
                                  src={uploadedFilePreview}
                                />
                                {/* <p
                                  className="appdesignerellipse"
                                  data-tip
                                  data-for={uploadedFile.name}
                                  id="create-app-upload-file-name"
                                >
                                  {uploadedFile.name}{" "}
                                </p> */}
                                <ReactTooltip
                                  id={uploadedFile.name}
                                  place="bottom"
                                  className="tooltipCustom"
                                  arrowColor="rgba(0, 0, 0, 0)"
                                  effect="float"
                                >
                                  <span
                                    id="create-app-uploaded-file-name"
                                    className="appdesigneruploadedfile secondaryColor"
                                  >
                                    {uploadedFile.name}
                                  </span>
                                </ReactTooltip>
                              </div>
                            )}
                          </label>
                          {uploadedFile !== null ? (
                            <div className="removeUploadeImage">
                              <span
                                className="secondaryColor"
                                onClick={() => setUploadedFile(null)}
                              >
                                Remove Image
                              </span>
                              <p className="secondaryColor">
                                {t("Accepted file SVG, PNG OR JPG")}
                              </p>
                            </div>
                          ) : null}
                        </Row>
                        {/* {uploadedFile != null ? (
                          
                        )} */}
                      </div>
                    </div>
                  </div>
                </Col>
              </Col>

              {/* cancle */}
              <Row>
                <div className="col-12 mt-4 mb-2 mt-4 appdesigner-editapp-cancel">
                  <button
                    id="create-app-cancel-btn"
                    className="secondaryButton secondaryButtonColor  cancelBtnAppDash"
                    onClick={() => CreateApplicationClose(false)}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    id="create-app-create-btn"
                    className="primaryButton primaryButtonColor"
                    onClick={createNewApp}
                    disabled={
                      targetDevice == "" || description == "" || name == ""
                        ? true
                        : false
                    }
                  >
                    {t("createApp")}
                  </button>
                </div>
              </Row>
              {/* <Row>
                <div className="excel">
                  Want to create application by Excel?
                  <span
                    id="create-app-excel-span"
                    className="upload"
                    onClick={() => {
                      setCreateNewAppUsingExcelModal(true);
                      setShowNewAppModel(false);
                    }}
                  >
                    Upload Excel
                  </span>
                </div>
              </Row> */}
            </Row>
          </Modal.Body>
        </CommonModelContainer>
        <CommonModelContainer
          modalTitle="Delete This Application"
          show={showDeleteModel}
          handleClose={onOpenDeleteModal}
          centered
          size="md"
          id="create-app-delete-app-model"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <Row>
                <p className="secondaryColor">
                  Are you sure you want to delete {displayDeleteAppName}{" "}
                  Application
                </p>
              </Row>
              <Row>
                <div className="col-12 mt-4 mb-2 appdesigner-deleteapp-cancel">
                  <button
                    id="delete-app-cancel-btn"
                    className="secondaryButton secondaryButtonColor"
                    onClick={() => setShowDeleteModel(false)}
                  >
                    Cancel
                  </button>
                  <button
                    id="delete-app-delete-btn"
                    className="primaryButton primaryButtonColor"
                    onClick={() => deleteApp()}
                  >
                    Delete App
                  </button>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </CommonModelContainer>
        <CommonModelContainer
          modalTitle={t("Create Excel To Application")}
          show={createNewAppUsingExcelModal}
          handleClose={() => CreateCreateNewAppUsingExcelClose(false)}
          centered
          size="md"
          className="createNewAppModal"
          id="create-app-excel-model"
        >
          <Modal.Body className=" create-new-app-modal px-4 appdesigner-excelmodel">
            <Row>
              <Col>
                <Row>
                  <Col className="me-2">
                    <div class="application py-2">
                      <span className="form-subheading secondaryColor">
                        {t("applicationName")}{" "}
                        <span className="appdesignerappname">*</span>
                      </span>
                      <input
                        id="create-app-excel-app-name-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="appdesignerinput"
                        placeholder={t("enterApplicationName")}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col className="me-2">
                    <div class="py-2 application">
                      <span className="form-subheading secondaryColor">
                        {t("description")}{" "}
                        <span className="appdesignerappname secondaryColor">
                          *
                        </span>
                      </span>
                      <textarea
                        id="create-app-excel-desc"
                        value={description}
                        onChange={(e) => {
                          let input = e.target.value;
                          setDescriptionCharLeft(250 - input.length);
                          setDescription(e.target.value);
                        }}
                        maxLength="250"
                        className="customScrollBar excelCreateAppDesc"
                        placeholder={t("enterDescriptionHere")}
                      />
                      {/* <p className="DescriptionLimit">
                      {descriptionCharLeft}/250
                    </p> */}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row className="">
                  <Col className="ms-2">
                    <div class="py-2">
                      <div className="colorscheme2">
                        <span
                          className="form-subheading secondaryColor"
                          id="create-app-excel-color-scheme"
                        >
                          {t("uploadImage")}
                        </span>
                        <div className="appdesignercreatecolorscheme">
                          <Row className="">
                            <label
                              className="Browse3 secondaryColor"
                              for="upload-img"
                            >
                              <input
                                type="file"
                                class="file"
                                id="upload-img"
                                accept="image/png, image/jpeg, image/jpg,image/svg+xml"
                                onChange={(e) => {
                                  checkImage(e);
                                }}
                                onClick={(e) => {
                                  const { target = {} } = e || {};
                                  target.value = "";
                                }}
                              />
                              {uploadedFile == null ? (
                                <>
                                  <img
                                    src={UploadFileCreateApp}
                                    className="mx-1"
                                  />
                                  <h6 className="primaryColor">
                                    {" "}
                                    <span className="secondaryColor">
                                      {t("clicktoUpload")}
                                    </span>
                                    {/* <small>or drag and drop</small> */}
                                  </h6>
                                  <p className="secondaryColor">
                                    {t("Accepted file SVG, PNG OR JPG")}
                                  </p>
                                  {invalidFileType && (
                                    <p
                                      className="secondaryColor"
                                      style={{ color: "red" }}
                                    >
                                      Please upload a SVG, PNG or JPG file.
                                    </p>
                                  )}
                                </>
                              ) : (
                                <div className="appdesigneruploadimg">
                                  <img
                                    id="create-app-excel-upload-img-prev"
                                    height={85}
                                    width={85}
                                    className="appdesignerimagecurve"
                                    src={uploadedFilePreview}
                                  />

                                  <ReactTooltip
                                    id={uploadedFile.name}
                                    place="bottom"
                                    className="tooltipCustom"
                                    arrowColor="rgba(0, 0, 0, 0)"
                                    effect="float"
                                  >
                                    <span
                                      id="create-app-excel-upload-filename-span"
                                      className="appdesigneruploadedfile secondaryColor"
                                    >
                                      {uploadedFile.name}
                                    </span>
                                  </ReactTooltip>
                                </div>
                              )}
                            </label>
                            {uploadedFile !== null ? (
                              <div className="removeUploadeImage">
                                <span
                                  className="secondaryColor"
                                  onClick={() => setUploadedFile(null)}
                                >
                                  Remove Image
                                </span>
                                <p className="secondaryColor">
                                  {t("Accepted file SVG, PNG OR JPG")}
                                </p>
                              </div>
                            ) : null}
                          </Row>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Row className="">
                <Col className="">
                  <div className="py-2">
                    <span className="form-subheading secondaryColor">
                      {t("selectDeviceSupport")}{" "}
                      <span className="appdesignerappname secondaryColor">
                        *
                      </span>
                    </span>
                    <div class="choosdevice excelChooseDevice pt-2 pb-1">
                      {/* <div class="sb-checkbox"> */}
                      <div
                        id="create-app-excel-device-web"
                        onClick={() => screenSelectionToggler("web")}
                        class="ps-3 col-md-6 col-lg-6 col-sm-6 d-flex align-items-start"
                      >
                        <div className="d-flex flex-column align-items-center justify-content-between">
                          <img
                            id="create-app-excel-device-support-web-img"
                            className="mt-1"
                            src={isWeb ? LaptopIcoRed : LaptopIco}
                            // onMouseOver={this.src = require({LaptopIcoRed})}
                            // onMouseOut={this.src = require({LaptopIco})}
                            onMouseOver={(e) =>
                              (e.currentTarget.src = LaptopIcoRed)
                            }
                            onMouseOut={
                              (e) => {
                                if (isWeb) {
                                  e.currentTarget.src = LaptopIcoRed;
                                } else {
                                  e.currentTarget.src = LaptopIco;
                                }
                              }
                              // (e.currentTarget.src = LaptopIco)
                            }
                          />
                          <span
                            id="excel-device-support-web-span"
                            className={
                              isWeb
                                ? "choose-screen-text-selected mt-2 secondaryColor"
                                : "choose-screen-text mt-2 secondaryColor"
                            }
                            // onMouseOver={e => (e.currentTarget.className = "choose-screen-text-selected")}
                            // onMouseOut={e => (e.currentTarget.className = "choose-screen-text")}
                          >
                            {t("web")}
                          </span>
                        </div>
                      </div>

                      {/* </div> */}
                      {/* <div class="sb-checkbox"> */}
                      <div
                        id="create-app-excel-device-web"
                        onClick={() => screenSelectionToggler("mobile")}
                        class="col-md-6 col-lg-6 col-sm-6 d-flex  align-items-start"
                      >
                        <div className="d-flex flex-column align-items-center justify-content-between">
                          <img
                            id="excel-device-support-mob-img"
                            className="mt-1"
                            src={isMobile ? PhoneIcoRed : PhoneIco}
                            onMouseOver={(e) =>
                              (e.currentTarget.src = PhoneIcoRed)
                            }
                            onMouseOut={(e) => {
                              if (isMobile) {
                                e.currentTarget.src = PhoneIcoRed;
                              } else {
                                e.currentTarget.src = PhoneIco;
                              }
                            }}
                          />
                          <span
                            id="excel-device-support-mob-span"
                            className={
                              isMobile
                                ? "choose-screen-text-selected mt-2 secondaryColor"
                                : "choose-screen-text mt-2 secondaryColor"
                            }
                          >
                            {t("mobile")}
                          </span>
                        </div>
                      </div>

                      {/* </div> */}
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="">
                <Col>
                  <div>
                    <div className="d-flex flex-row justify-content-between">
                      <div>
                        <span className="form-subheading secondaryColor">
                          {t("Upload Excel")}{" "}
                          <span className="appdesignerappname secondaryColor">
                            *
                          </span>
                        </span>
                      </div>
                      <div>
                        <img
                          id="excel-upload-exel-img"
                          className=""
                          alt="#"
                          src={infocircleIco}
                          data-tip
                          data-for="uploadexcelinfo"
                        />
                        <ReactTooltip
                          id="uploadexcelinfo"
                          place="left"
                          arrowColor="rgba(0, 0, 0, 0)"
                          effect="solid"
                        >
                          {noOfTabsinSpreadsheet} number of tabs in spreadsheet
                          allowed
                        </ReactTooltip>
                      </div>
                    </div>
                    <div className="uploadExcel py-2">
                      {selectedExcel ? (
                        <div className="uploadedExcel ">
                          <img
                            className="uploadedExcelIcon"
                            src={UploadedExcelcon}
                            alt=""
                          />
                          <div className="w-100">
                            <p className="uploadedExcelTitle secondaryColor">
                              {selectedExcel.name}
                            </p>
                            <p className="uploadedExcelSize secondaryColor">
                              {excelSize}
                            </p>
                          </div>
                          <span
                            className="secondaryColor"
                            onClick={() => setSelectedExcel(null)}
                          >
                            Remove
                          </span>
                        </div>
                      ) : (
                        <div className="d-flex flex-column justify-content-center">
                          <div className="">
                            <div className="usingexcel">
                              <span className="appdesigner-excel secondaryColor">
                                <label
                                  className="d-flex justify-content-center"
                                  htmlFor="upload-button"
                                >
                                  <img
                                    id="excel-upload-icon"
                                    src={newUploadIcon}
                                  />
                                </label>
                                {t("Upload Excel file to create Application")}
                              </span>

                              <input
                                style={{ display: "none" }}
                                type="file"
                                id="upload-button"
                                className="excel-upload-input"
                                name="myfile"
                                accept=".xlsx,.xls"
                                onChange={(elem) => {
                                  console.log(
                                    "set excel upload",
                                    elem.target.files[0].size / 1024
                                  );
                                  setSelectedExcel(elem.target.files[0]);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <a
                      href={createExcelTemplate}
                      target="_blank"
                      download="Excel template"
                      className="mt-1 template-download-link "
                    >
                      <span className="appdesigner-template secondaryColor">
                        <img src={DownloadExcelTemplate} />{" "}
                        {t("Download Excel Template")}
                      </span>
                    </a>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col className="col-lg-6 col-md-6 col-sm-6 mt-2">
                  <span className="form-subheading secondaryColor">
                    {t("Generate")}
                  </span>
                  <div className="py-2 appdesigner-generate">
                    <div className="px-2 appdesigner-excelcheckbox">
                      <label className="checkbox secondaryColor">
                        <input
                          id="create-app-excel-field"
                          className="Formcheckbox"
                          type="checkbox"
                          checked={formSelected}
                          onChange={() => setFormSelected(!formSelected)}
                        />
                        <span className="Form ms-2 secondaryColor">
                          {t("Field")}
                        </span>
                      </label>
                    </div>
                    <div className="appdesigner-excelcheckbox">
                      <label className="checkbox secondaryColor">
                        <input
                          id="create-app-excel-grid"
                          className="Gridcheckbox"
                          type="checkbox"
                          checked={gridSelected}
                          onChange={() => setGridSelected(!gridSelected)}
                        />
                        <span className="Form ms-2 secondaryColor">
                          {t("Grid")}
                        </span>
                      </label>
                    </div>
                    {/* <div className="appdesigner-excelcheckbox">
                      <label className="checkbox">
                        <input
                          id="create-app-excel-sheet"
                          className="Gridcheckbox"
                          type="checkbox"
                          checked={sheetSelected}
                          onChange={() => setSheetSelected(!sheetSelected)}
                        />
                        <span className="Form ms-2">Sheet</span>
                      </label>
                    </div> */}
                  </div>
                </Col>
                <Col className="col-lg-6 col-md-6 col-sm-6 mt-2">
                  <span className="form-subheading">
                    {t("Excel Row & Column")}
                  </span>
                  <div className="py-2 appdesigner-excelRowColumn">
                    <div className="px-2 ">
                      <label className="createAppExcel-rowColumnLabel">
                        <span className="Form ">{t("Start row number")}</span>
                        <input
                          id="create-app-excel-field"
                          className=" createAppExcel-rowColumnInput ms-2"
                          type="number"
                          value={startRowNumber}
                          onChange={(e) => setStartRowNumber(e.target.value)}
                        />
                      </label>
                    </div>
                    <div className="">
                      <label className="createAppExcel-rowColumnLabel">
                        <span className="Form ">
                          {t("Start column number")}
                        </span>
                        <input
                          id="create-app-excel-grid"
                          className="createAppExcel-rowColumnInput ms-2"
                          type="number"
                          value={startColumnNumber}
                          onChange={(e) => setStartColumnNumber(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <div className="col-12 mt-4 mb-2 mt-4 appdesigner-editapp-cancel">
                  <button
                    id="create-app-excel-cancel-btn"
                    className="secondaryButton secondaryButtonColor cancelBtnAppDash"
                    onClick={() => CreateCreateNewAppUsingExcelClose(false)}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    className="primaryButton primaryButtonColor"
                    id="create-app-excel-create-app-btn"
                    onClick={newExcelApp}
                    disabled={
                      targetDevice == "" ||
                      description == "" ||
                      name == "" ||
                      selectedExcel == null
                        ? true
                        : false
                    }
                  >
                    {t("createApp")}
                  </button>
                </div>
              </Row>
              {/* <Row>
                <div className="backexcel">
                  <span
                    className="back"
                    id="create-app-excel-go-back-btn"
                    onClick={() => {
                      setShowNewAppModel(true);
                      setCreateNewAppUsingExcelModal(false);
                    }}
                  >
                    {" "}
                    Go Back
                  </span>
                  to Create New Application Manually
                </div>
              </Row> */}
            </Row>
          </Modal.Body>
        </CommonModelContainer>
        {/* </Modal> */}
        <Modal
          show={createExcelStatus}
          onHide={() => setCreateExcelStatus(false)}
          handleClose={() => setCreateExcelStatus(false)}
          centered
          size="md"
          id="create-app-excel-status-modal"
        >
          <Modal.Body className="py-4 px-4 create-new-app-modal">
            <div>
              <Row className="my-2">
                <Col className="appdesigner-excelstatusgif">
                  {currentStep == 3 ? (
                    <img
                      height={200}
                      width={200}
                      src={require("../../assets/animations/deploymentSuccess.gif")}
                      alt="loading..."
                    />
                  ) : (
                    <img
                      height={200}
                      width={200}
                      src={require("../../assets/animations/deploymentScanner.gif")}
                      alt="loading..."
                    />
                  )}
                </Col>
              </Row>
              <Row className="my-2">
                <Col className="appdesigner-excelstatusgif"></Col>
              </Row>
              <Row className="mt-5 mb-3">
                <Col className="appdesigner-excelstatusgif"></Col>
              </Row>
              <Row>
                <Col className="appdesigner-exelstatus">
                  <StepNavigation
                    labelArray={labelArray}
                    currentStep={currentStep}
                    updateStep={updateStep}
                    fontcolortype={stepTextColor}
                  ></StepNavigation>
                </Col>
              </Row>
              <div className="appdesigner-excelstatusgif">
                <h3 className="appname primaryColor">{name}</h3>
              </div>
              <Row className="my-2">
                <Col className="appdesigner-excelstatusgif">
                  {/* <button
                    className="primaryButton"
                    onClick={() => setCreateExcelStatus(false)}
                  >
                    Cancel
                  </button> */}
                  <button
                    id="create-app-edit-app-btn"
                    className="primaryButton primaryButtonColor"
                  >
                    <Link
                      id="create-app-edit-app-btn-link"
                      to={{
                        pathname: `/studio`,
                        // state: { appName: name },
                      }}
                      className="btn edit-btn"
                    >
                      Edit Your Application
                    </Link>
                  </button>
                </Col>
              </Row>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default ApplicationDashboard;
