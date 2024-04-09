import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { BusineesRuleIcon, DataModelIcon, WorkFlow } from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import CustomSelectAll from "../CustomSelectAll/CustomSelectAll";
import CustomMultiSelect from "../CustomMultiSelect/CustomMultiSelect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../BpmnMapping/Bpmn.css";
import {
  StringIco,
  IntegerIcon,
  CharacterIcon,
  BooleanIcon,
  DateIcon,
  ByteIcon,
  DoubleIcon,
  LongIcon,
  DatetimeIcon,
  FloatIcon,
} from "../../assets";
import { useTranslation } from "react-i18next";

const DataModellerMapping = (props) => {
  const [dmn, setDmn] = useState(null);
  const [bpmn, setBpmn] = useState(null);
  const [dataModelSingle, setDataModelSingle] = useState(null);
  const [dataModel, setDataModel] = useState(null);
  const [selectedBpmns, setSelectedBpmns] = useState(null);
  const [selectedDataModelSingle, setSelectedDataModelSingle] = useState(null);
  const [selectedDataModel, setSelectedDataModel] = useState(null);
  const [selectedDmn, setSelectedDmn] = useState(null);
  const [showBpmnModal, setShowBpmnModal] = useState(null);
  const [showDmnModal, setShowDmnModal] = useState(null);

  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }

  useEffect(() => {
    apiGet();
    datamodellergetdata();
    getDataModel();
  }, []);

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
        getdmn(res.data.data.dmn);
        getbpmn(res.data.data.bpmn);
      })
      .catch((e) => console.log(e));
  };

  const datamodellergetdata = () => {
    var data = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: props.data.resourceName,
      fileType: props.data.resourceType,
    };
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/fetchFile/meta`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        // console.log("Datamodel-new", JSON.parse(response.data.data));
        getDataModelSingle(JSON.parse(response.data.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const BpmnDataModalMappingApi = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      qualifiedObjectName:
        "io.intelliflow.generated.models." +
        selectedDataModel.value.replace(/\.[^/.]+$/, ""),
      propertyName: selectedDataModel.value.replace(/\.[^/.]+$/, ""),
      bpmnFileName: selectedBpmns.value,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/Bpmnmodeller/bind",
        postData
      )
      .then((response) => {
        console.log("response", response.status);
        toast.success(t("Mapping successfully completed"), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("Mapping failed"), {
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
  const DmnDataModalMappingApi = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      qualifiedObjectName:
        "io.intelliflow.generated.models." +
        localStorage.getItem("selectedForm").replace(/\.[^/.]+$/, ""),
      propertyName: localStorage
        .getItem("selectedForm")
        .replace(/\.[^/.]+$/, "")
        .toLowerCase(),
      dmnName: selectedDmn.value,
      fileType: "dmn",
      dataModelBinding: "true",
      propertyNames: selectedDataModelSingle?.map((e) => e.value),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/dmnmodeller/bind",
        postData
      )
      .then((response) => {
        console.log("response", response.status);
        toast.success(t("Mapping successfully completed"), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error(t("Mapping failed"), {
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

  const getdmn = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: BusineesRuleIcon,
      };
    });
    setDmn([...temp]);
  };

  const getbpmn = (data) => {
    // console.log("getbpmn", data);
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: WorkFlow,
      };
    });
    setBpmn([...temp]);
    // console.log("tempBpmn", [...temp]);
  };

  const renderIcons = (item) => {
    // console.log("item-item", item);
    switch (item.type) {
      case "String":
        return StringIco;
      case "Integer":
        return IntegerIcon;
      case "Character":
        return CharacterIcon;
      case "Boolean":
        return BooleanIcon;
      case "Date":
        return DateIcon;
      case "Byte":
        return ByteIcon;
      case "Double":
        return DoubleIcon;
      case "Long":
        return LongIcon;
      case "Date Time":
        return DatetimeIcon;
      case "Float":
        return FloatIcon;
      case "DataModel":
        return DataModelIcon;
      default:
        return "";
    }
  };

  const getDataModelSingle = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.name,
        payIcon: renderIcons(item),
      };
    });
    setDataModelSingle([...temp]);
  };

  const getDataModel = () => {
    setDataModel([
      {
        value: localStorage.getItem("selectedForm"),
        payIcon: DataModelIcon,
      },
    ]);
  };

  const handleBpmnModal = (e) => {
    BpmnDataModalMappingApi();
    setShowBpmnModal(false);
    props.BpmnDmnModal(false);
  };

  const handleDmnModal = (e) => {
    DmnDataModalMappingApi();
    setShowDmnModal(false);
    props.BpmnDmnModal(false);
  };

  const onCloseModal = () => {
    props.BpmnDmnModal(false);
  };

  const changeSelectedBpmn = (tempselectedbpmn) => {
    setSelectedBpmns(tempselectedbpmn);
  };

  const changeSelectedDataModelSingle = (tempselecteddatamodelSingle) => {
    setSelectedDataModelSingle(tempselecteddatamodelSingle);
  };
  const changeSelectedDataModel = (tempselecteddatamodel) => {
    setSelectedDataModel(tempselecteddatamodel);
  };

  const changeSelectedDmn = (tempselectedDmn) => {
    setSelectedDmn(tempselectedDmn);
  };

  // console.log("selectedDataModelSingle", selectedDataModelSingle);

  return (
    <>
      <CommonModelContainer
        modalTitle={t("Select Any One")}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={"Selectone"}
        id="dataModellerMapping-selectAnyOne-CommonModelContainer"
      >
        <div className="bpmnmapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-12">
                <div className="bpmn-mapping-select-box">
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowBpmnModal(true)}
                    id="dataModellerMapping-workflow"
                  >
                    <p className="secondaryColor">
                      {" "}
                      <img
                        src={WorkFlow}
                        alt="WorkFlow Icon"
                        height="20px"
                      />{" "}
                      {t("Work Flow")}
                    </p>
                  </Link>
                </div>
              </div>

              <div className="col-md-12">
                <div className="bpmn-mapping-select-box">
                  <Link
                    to="#"
                    style={{ textDecoration: "none" }}
                    onClick={() => setShowDmnModal(true)}
                    id="dataModellerMapping-businessRules"
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
            </div>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle={t("Work Flow To Data Model")}
        show={showBpmnModal}
        handleClose={() => setShowBpmnModal(false)}
        className="popup"
        id="dataModellerMapping-workflowToDataModel-CommonModelContainer"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="workflow">
                  <p className="secondaryColor">BPMN</p>
                  <CustomSelect
                    transferFrom={bpmn}
                    bringingvalue={changeSelectedBpmn}
                    id="dataModellerMapping-bpmn-CustomSelect"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="humantask">
                  <p className="secondaryColor">{t("Data Model")}</p>
                  <CustomSelect
                    transferFrom={dataModel}
                    bringingvalue={changeSelectedDataModel}
                    id="dataModellerMapping-dataModel-CustomSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                className="secondaryButton secondaryButtonColor mx-3 "
                onClick={() => setShowBpmnModal(false)}
                id="dataModellerMapping-back-btn"
              >
                Back
              </button>

              <button
                className="secondaryButton secondaryButtonColor mx-3 "
                id="dataModellerMapping-clearAll-btn"
              >
                Clear All
              </button>
              <button
                className="mapButton primaryButtonColor mx-3 "
                id="dataModellerMapping-map-btn"
                onClick={handleBpmnModal}
              >
                Map
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle={t("Business Rules To Data Model ")}
        show={showDmnModal}
        handleClose={() => setShowDmnModal(false)}
        className="popup"
        id="dataModellerMapping-businessRulesToDataModel-CommonModelContainer"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col-lg-12">
            <div className="row">
              <div className="col-md-4">
                <div className="workflow">
                  <p className="secondaryColor">DMN</p>
                  <CustomSelect
                    transferFrom={dmn}
                    bringingvalue={changeSelectedDmn}
                    id="dataModellerMapping-dmn-CustomSelect"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="humantask">
                  <p className="secondaryColor">{t("Data Model")}</p>
                  <CustomSelectAll
                    transferFrom={dataModelSingle}
                    bringingvalue={changeSelectedDataModelSingle}
                    isMulti={true}
                    allowSelectAll={true}
                    id="dataModellerMapping-dmndataModel-CustomSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                className="secondaryButton secondaryButtonColor mx-3 "
                onClick={() => setShowDmnModal(false)}
                id="dataModellerMapping-backdmn-btn"
              >
                {t("Back")}
              </button>

              <button
                className="secondaryButton secondaryButtonColor mx-3 "
                id="dataModellerMapping-clearAlldmn-btn"
              >
                {t("Clear All")}
              </button>
              <button
                className="mapButton primaryButtonColor mx-3 "
                id="dataModellerMapping-mapdmn-btn"
                onClick={handleDmnModal}
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

export default DataModellerMapping;
