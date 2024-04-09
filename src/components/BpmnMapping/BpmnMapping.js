import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  FormLaptop,
  ProcessIcon,
  ProfileIcon,
  jamscreenIcon,
  BusineesRuleIcon,
  DataModelIcon,
} from "../../assets";
// import { ReactComponent as DataModelIcon } from "../../assets/images/DataModel.svg";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Bpmn.css";
import { useTranslation } from "react-i18next";

const BpmnMapping = (props) => {
  const { data, formDataProp, saveCount } = props;
  const [mapData, setMapData] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [showBpmntoFormModel, setShowBpmntoFormModel] = useState(false);
  const [form, setform] = useState(null);
  const [selectedDmn, setSelectedDmn] = useState(null);
  const [selectedbpmn, setSelectedbpmn] = useState(null);
  const [usertask, setUsertask] = useState(null);
  const [businessRule, setBusinessRule] = useState(null);
  const [businessRuleTask, setBusinessRuleTask] = useState(null);
  const [dmn, setDmn] = useState(null);
  const [dataModel, setDataModel] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [selectedBusinessRuleTask, setSelectedBusinessRuleTask] =
    useState(null);
  const [businessRuleTaskName, setBusinessRuleTaskName] = useState(null);
  const [businessRuleTaskId, setBusinessRuleTaskId] = useState(null);
  const [dmnNamespace, setDmnNamespace] = useState(null);
  const [decisionName, setDecisionsName] = useState(null);
  const [selecteddatamodel, setSelecteddatamodel] = useState(null);
  const [showForms, setShowForms] = useState(null);
  const [showHumanTask, setShowHumanTask] = useState(null);
  const [showDataModel, setShowDataModel] = useState(null);
  const [getHumanDataOnSave, setGetHumanDataOnSave] = useState(null);
  const [showMainPopUp, setshowMainPopup] = useState(props.buttonClick);
  const selectedFormName = formDataProp;
  const selectedDMNName = props.data.resourceName;
  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }

  useEffect(() => {
    apiGet();
    Bpmngetdata();
  }, [saveCount]);

  const apiGet = () => {
    const data = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/getResources",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        getform(res.data.data.form);
        getDataModel(res.data.data.datamodel);
        getdmn(res.data.data.dmn);
      })
      .catch((e) => console.log(e));
  };

  const Bpmngetdata = () => {
    var postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName,
      fileType: data.resourceType,
    };
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/bpmnmodeller/getData`,
      headers: {
        "Content-Type": "application/json",
      },
      data: postData,
    };
    axios(config)
      .then(function (response) {
        var alltasks = [];

        {
          response.data.data.process.length != 0 &&
            response.data.data.process.map((task) => {
              task.type = "processTask";
              alltasks.push(task);
            });
        }

        {
          response.data.data.userTask.length != 0 &&
            response.data.data.userTask.map((task) => {
              task.type = "userTask";
              alltasks.push(task);
            });
        }

        getusertask(alltasks);
        setBusinessRuleTaskName(response.data.data.businessRuleTask[0].name);
        setBusinessRuleTaskId(response.data.data.businessRuleTask[0].id);
        getbusinessRuleTask(response.data.data.businessRuleTask);
        setBusinessRule(response.data.data.businessRuleTask);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const apiPostmapping = () => {
    var taskName = selectedTask?.value.replace(/\.[^/.]+$/, "");
    if (selectedTask?.tasktype == "PT") {
      taskName = selectedbpmn?.value.replace(/\.[^/.]+$/, "");
    }
    var data = JSON.stringify({
      workspace: localStorage.getItem("workspace"),
      miniapp: localStorage.getItem("appName"),
      tasktype: selectedTask?.tasktype,
      taskname: taskName,
      formname: selectedFormName,
      bpmnname: selectedbpmn?.value,
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/form/mapping`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        toast.success("Mapping successfully completed", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const dmngetdata = (tempVal) => {
    var postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: tempVal.value,
      fileType: "dmn",
    };
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/dmnmodeller/getData`,
      headers: {
        "Content-Type": "application/json",
      },
      data: postData,
    };
    // console.log({ config });
    axios(config)
      .then((response) => {
        setDmnNamespace(response.data.data.namespace);
        setDecisionsName(response.data.data.decisions[0].name);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getform = (data) => {
    const temp = data?.map((item) => {
      const valueName = item.resourceName.split(".");
      let formsName = valueName[0];
      return {
        value: formsName,
        payIcon: jamscreenIcon,
      };
    });
    setform([...temp]);
  };

  const getusertask = (data) => {
    // console.log("usertask",user)
    const temp = data.map((item) => {
      // console.log("item-item", item.tasktype);
      return {
        value: item.name,
        payIcon: item.type == "userTask" ? ProfileIcon : ProcessIcon,
        tasktype: item.tasktype ? "PT" : "UT",
      };
    });
    setUsertask([...temp]);
  };

  const getdmn = (data) => {
    const temp = data?.map((item) => {
      return {
        value: item.resourceName,
        payIcon: BusineesRuleIcon,
      };
    });
    setDmn([...temp]);
    setSelectedDmn(temp[0]);
    dmngetdata(temp[0]);
  };

  const getbusinessRuleTask = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.name,
        payIcon: BusineesRuleIcon,
      };
    });
    setBusinessRuleTask([...temp]);
  };

  const getDataModel = (data) => {
    // console.log("data-getdatamodel");
    const temp = data?.map((item) => {
      return {
        value: item.resourceName,
        payIcon: DataModelIcon,
      };
    });
    setDataModel([...temp]);
    setSelecteddatamodel(temp[0]);
  };

  const apiPost = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileType: "dmn",
      dmnName: selectedBusinessRuleTask?.value,
      dmnNamespace: dmnNamespace,
      decisionName: decisionName,
      businessRuleTaskName: businessRuleTaskName,
      businessRuleTaskId: businessRuleTaskId,
      bpmnFileName: data.resourceName,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/dmnmodeller/bind",
        postData
      )
      .then((response) => {
        toast.success(t("Mapping successfully completed"), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const apiPostDataModel = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      qualifiedObjectName:
        "io.intelliflow.generated.models." +
        selecteddatamodel?.value.replace(/\.[^/.]+$/, ""),
      propertyName: selecteddatamodel?.value.replace(/\.[^/.]+$/, ""),
      bpmnFileName: data.resourceName,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/Bpmnmodeller/bind",
        postData
      )
      .then((response) => {
        toast.success(t("Mapping successfully completed"), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  const onOpenBpmntoFormModel = () => {
    // console.log("call");
    setShowBpmntoFormModel(!showBpmntoFormModel);
  };

  const handleSelectOptionDataModel = (e) => {
    setShowDataModel(false);
    setSelectOption(e.target.value);
    props.BpmntoBpmnMapping(false);
    apiPostDataModel();
  };

  const handleSelectOptionForm = (e) => {
    setShowForms(false);
    setSelectOption(e.target.value);
    props.BpmntoBpmnMapping(false);
    setTimeout(() => {
      apiPostmapping();
    }, 2000);
  };

  const handleSelectOptionHumanTask = (e) => {
    setShowHumanTask(false);
    setSelectOption(e.target.value);
    props.BpmntoBpmnMapping(false);
    apiPost();
  };

  const onCloseModal = () => {
    props.BpmntoBpmnMapping(false);
  };

  const showMapData = () => {
    setMapData(!mapData);
  };
  const changeSelectedTask = (tempselectedtask) => {
    setSelectedTask(tempselectedtask);
  };

  const changeSelectedForm = (tempselectedform) => {
    setSelectedForm(tempselectedform);
  };

  const changeSelectedDmn = (tempselectedDmn) => {
    // console.log(tempselectedDmn.value);
    setSelectedDmn(tempselectedDmn);
    dmngetdata(tempselectedDmn);
  };

  const changeSelectedBusinessRuleTask = (tempselectedBusinessRuleTask) => {
    setSelectedBusinessRuleTask(tempselectedBusinessRuleTask);
  };

  const changeSelectedDataModel = (tempselecteddatamodel) => {
    setSelecteddatamodel(tempselecteddatamodel);
  };

  let history = useHistory();
  return (
    <>
      <CommonModelContainer
        modalTitle={t("select one")}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={"Selectone"}
        id="bpmnMapping-selectOne-CommonModelContainer"
      >
        <div className="bpmnmapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-12">
                <div className="bpmn-mapping-select-box">
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowForms(true)}
                    id="bpmnMapping-forms-link"
                  >
                    <p className="secondaryColor">
                      {" "}
                      <img
                        src={jamscreenIcon}
                        alt="jamscreen Icon"
                        height="20px"
                      />{" "}
                      {t("Forms")}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="col-md-12">
                <div className="bpmn-mapping-select-box">
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowHumanTask(true)}
                    id="bpmnMapping-businessRules-link"
                  >
                    <p className="secondaryColor">
                      {" "}
                      <img
                        src={BusineesRuleIcon}
                        alt="BusineesRule Icon"
                        height="20px"
                      />{" "}
                      {t("Business Rules")}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="col-md-12">
                <div className="bpmn-mapping-select-box">
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowDataModel(true)}
                    id="bpmnMapping-dataModel-link"
                  >
                    <p className="secondaryColor">
                      {" "}
                      <img
                        src={DataModelIcon}
                        alt="DataModel Icon "
                        height="20px"
                      />{" "}
                      {/* <DataModelIcon className="svg-fill iconFillhover iconSvgFillColor" style={{height: "20px"}} /> */}
                      {t("Data Model")}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle={t("Work Flow")}
        show={showForms}
        handleClose={() => setShowForms(false)}
        className="popup"
        id="bpmnMapping-workFlow-CommonModelContainer"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="workflow">
                  <p className="secondaryColor">{t("Humantask")}</p>
                  <CustomSelect
                    transferFrom={usertask}
                    bringingvalue={changeSelectedTask}
                    id="bpmnMapping-usertask-CustomSelect"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="humantask">
                  <p className="secondaryColor">{t("Form")}</p>
                  <CustomSelect
                    transferFrom={form}
                    bringingvalue={changeSelectedForm}
                    id="bpmnMapping-form-CustomSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                id="bpmnMapping-back-button"
                className="secondaryButton secondaryButtonColor mx-3 "
                onClick={() => setShowForms(false)}
              >
                {t("Back")}
              </button>

              <button className="secondaryButton secondaryButtonColor mx-3 ">
                {t("Clear All")}
              </button>
              <button
                id="bpmnMapping-map-button"
                className="mapButton primaryButtonColor mx-3 "
                onClick={handleSelectOptionForm}
              >
                {t("Map")}
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Work Flow"
        show={showHumanTask}
        handleClose={() => setShowHumanTask(false)}
        className="popup"
        id="bpmnMapping-showHumanTask-CommonModelContainer"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="workflow">
                  <p className="secondaryColor">{t("DMN")}</p>
                  <CustomSelect
                    transferFrom={dmn}
                    bringingvalue={changeSelectedDmn}
                    id="bpmnMapping-dmn-CustomSelect"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="humantask">
                  <p className="secondaryColor">{t("Businees Rule Task")}</p>
                  <CustomSelect
                    transferFrom={businessRuleTask}
                    bringingvalue={changeSelectedBusinessRuleTask}
                    id="bpmnMapping-businessRuleTask-CustomSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                id="bpmnMapping-back2-button"
                className="secondaryButton secondaryButtonColor mx-3 "
                onClick={() => setShowHumanTask(false)}
              >
                {t("Back")}
              </button>

              <button
                className="secondaryButton secondaryButtonColor mx-3 "
                id="bpmnMapping-clearAll-button"
              >
                {t("Clear All")}
              </button>
              <button
                id="bpmnMapping-map-button"
                className="mapButton primaryButtonColor mx-3 "
                onClick={handleSelectOptionHumanTask}
              >
                {t("Map")}
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Work Flow"
        show={showDataModel}
        handleClose={() => setShowDataModel(false)}
        className={" Datamodel"}
        id="bpmnMapping-selectOne-CommonModelContainer"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="workflow">
                  <p className="secondaryColor">{t("Data Model")}</p>
                  <CustomSelect
                    transferFrom={dataModel}
                    bringingvalue={changeSelectedDataModel}
                    id="bpmnMapping-dataModel-CustomSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                id="bpmnMapping-back3-button"
                className="secondaryButton primaryButtonColor mx-3 "
                onClick={() => setShowDataModel(false)}
              >
                {t("Back")}
              </button>

              <button
                className="secondaryButton primaryButtonColor mx-3 "
                id="bpmnMapping-clearAll2-button"
              >
                {t("Clear All")}
              </button>
              <button
                id="bpmnMapping-map2-button"
                className="mapButton primaryButtonColor mx-3 "
                onClick={handleSelectOptionDataModel}
              >
                {t("Map")}
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};

export default BpmnMapping;
