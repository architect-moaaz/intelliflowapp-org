import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import {
  FormLaptop,
  ProfileIcon,
  SelectBpmn,
  BusineesRuleIcon,
} from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./DNM.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";

const DNMmapping = (props) => {
  const [selectOption, setSelectOption] = useState("");
  const [bpmn, setBpmn] = useState(null);
  const [dmn, setDmn] = useState(null);
  const [selectedbpmn, setSelectedbpmn] = useState([]);
  const [selectedDmn, setSelecteddmn] = useState(null);
  const [businessRuleTask, setBusinessRuleTask] = useState([]);
  const [businessRuleTaskId, setBusinessRuleTaskId] = useState(null);
  const [businessRuleTaskName, setBusinessRuleTaskName] = useState(null);
  const [dmnModelName, setDmnModelName] = useState(null);
  const [dmnNamespace, setDmnNamespace] = useState(null);
  const [decisionName, setDecisionsName] = useState(null);
  const [decision, setDecision] = useState(null);
  const selectedDMNName = props.data.resourceName;
  const [t, i18n] = useTranslation("common");
  {t("mobile")}

  useEffect(() => {
    apiGet();
    FetchBpmndata();
    dmngetdata();
  }, [selectedbpmn]);

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
        setBpmn(res.data.data.bpmn);
        getdmn(res.data.data.dmn);
        setDmn(res.data.data.dmn);
        getBpmn(res.data.data.bpmn);
      });
  };

  const FetchBpmndata = () => {
    var data = JSON.stringify({
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: selectedbpmn,
      fileType: "bpmn",
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/bpmnmodeller/getData`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        setBusinessRuleTaskName(response.data.data.businessRuleTask[0].name);
        setBusinessRuleTaskId(response.data.data.businessRuleTask[0].id);
        getbusinessRuleTask(response.data.data.businessRuleTask);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const dmngetdata = () => {
    var data = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: selectedDMNName,
      fileType: props.data.resourceType,
    };
    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/dmnmodeller/getData`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        setDmnNamespace(response.data.data.namespace);
        setDmnModelName(response.data.data.name);
        setDecisionsName(response.data.data.decisions[0].name);
        getdecision(response.data.data.decisions);
        getdecision(response.data.data.decisions[0].name);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getdmn = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.namespace,
        payIcon: BusineesRuleIcon,
      };
    });
    setDmn([...temp]);
  };

  const getBpmn = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: SelectBpmn,
      };
    });
    setBpmn([...temp]);
  };
  const getdecision = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.name,
        payIcon: BusineesRuleIcon,
      };
    });
    setDecision([...temp]);
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
  const apiPost = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileType: "dmn",
      dmnName: dmnModelName,
      dmnNamespace: dmnNamespace,
      decisionName: decisionName,
      businessRuleTaskName: businessRuleTaskName,
      businessRuleTaskId: businessRuleTaskId,
      bpmnFileName: selectedbpmn,
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

  const handleSelectOption = (e) => {
    setSelectOption(e.target.value);
    props.DNMtoDNMmapping(false);
    apiPost();
  };

  const changeSelectedbpmn = (tempselectedbpmn) => {
    setSelectedbpmn(tempselectedbpmn.value);
  };

  const changeSelecteddmn = (tempselecteddmn) => {
    setSelecteddmn(tempselecteddmn);
  };
  const changeSelecteddecision = (tempselecteddecision) => {
    setDecision(tempselecteddecision);
  };

  const onCloseModal = () => {
    props.DNMtoDNMmapping(false);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={`Bind ${selectedDMNName} to WorkFlow`}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={"DNM"}
        id="dnmMapping-dnmToWorkflow-CommonModelContainer"
      >
        <Row className="mapdataRow">
          <Col lg={12} className="mapdatainfo">
            <Row>
              <Col md={4}>
                <div className="mapping-select-box">
                  <p className="secondaryColor">{t("WorkFlow")}</p>
                  <CustomSelect
                    transferFrom={bpmn}
                    bringingvalue={changeSelectedbpmn}
                    id="dnmMapping-bpmn-CustomSelect"
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="mapping-select-box">
                  <p className="secondaryColor">{t("Business Rule")}</p>
                  <CustomSelect
                    transferFrom={businessRuleTask}
                    bringingvalue={changeSelecteddmn}
                    id="dnmMapping-businessRuleTask-CustomSelect"
                  />
                </div>
              </Col>
              <Col md={4}>
                <div className="mapping-select-box">
                  <p className="secondaryColor">{t("Decisions")}</p>
                  <CustomSelect
                    transferFrom={decision}
                    bringingvalue={changeSelecteddecision}
                    id="dnmMapping-decision-CustomSelect"
                  />
                </div>
              </Col>
            </Row>
            <div className="mapping-btn-action mt-5">
              <button className="secondaryButton secondaryButtonColor mx-3 " id="dnmMapping-clearAll-button">{t("Clear All")}</button>
              <button
                className="mapButton primaryButtonColor mx-3 "
                onClick={handleSelectOption}
                disabled={selectedbpmn ? false : true}
                id="dnmMapping-map-button"
              >
                {t("Map")}
              </button>
            </div>
          </Col>
        </Row>
      </CommonModelContainer>
    </>
  );
};
export default DNMmapping;
