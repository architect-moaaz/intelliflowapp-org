import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { FormLaptop, ProfileIcon, SelectBpmn } from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FormMapping.css";
import { useTranslation } from "react-i18next";

const FormMapping = (props) => {
  const { formDataProp } = props;
  const [mapData, setMapData] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [bpmn, setBpmn] = useState(null);
  const [form, Setform] = useState(null);
  const [selectedbpmn, setSelectedbpmn] = useState(null);
  const [usertask, setUsertask] = useState(null);
  const [usertaskValue, setUsertaskValue] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }
  const selectedFormName = formDataProp;
  useEffect(() => {
    apiGet();
  }, [props.buttonClick]);

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
        getBpmn(res.data.data.bpmn);
        getform(res.data.data.form);
      });
  };

  useEffect(() => {
    const Bpmngetdata = (resourceName, resourceType) => {
      console.log("resourceName", resourceName);
      console.log("resourceType", resourceType);
      var data = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: resourceName,
        fileType: resourceType,
      };
      var config = {
        method: "post",
        url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/bpmnmodeller/getData`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then((response) => {
          if (response.data.data.userTask[0]) {
            const temp = [
              {
                name: "Process Task",
                tasktype: "PT",
              },
              ...response.data.data.userTask,
            ];
            getusertask(temp);
          } else {
            const temp = [
              {
                name: "Process Task",
                tasktype: "PT",
              },
            ];
            getusertask(temp);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (bpmn != null) {
      Bpmngetdata(selectedbpmn?.value, "bpmn");
    }
  }, [selectedbpmn]);

  const apiPostmapping = () => {
    var taskName = selectedTask.value.replace(/\.[^/.]+$/, "");
    if (selectedTask.tasktype == "PT") {
      taskName = selectedbpmn.value.replace(/\.[^/.]+$/, "");
    }
    var data = JSON.stringify({
      workspace: localStorage.getItem("workspace"),
      miniapp: localStorage.getItem("appName"),
      tasktype: selectedTask.tasktype,
      taskname: taskName,
      formname: selectedFormName,
      bpmnname: selectedbpmn.value,
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

  const getBpmn = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: SelectBpmn,
        tasktype: item.tasktype ? item.tasktype : "UT",
      };
    });
    setBpmn([...temp]);
  };

  const getform = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: ProfileIcon,
      };
    });
    Setform([...temp]);
  };

  const getusertask = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.name,
        payIcon: ProfileIcon,
        tasktype: item.tasktype ? "PT" : "UT",
      };
    });
    setUsertask([...temp]);
  };

  const changeSelectedbpmn = (tempselectedbpmn) => {
    setSelectedbpmn(tempselectedbpmn);
  };

  const changeSelectedTask = (tempselectedtask) => {
    setSelectedTask(tempselectedtask);
  };

  const handleSelectOption = (e) => {
    setSelectOption(e.target.value);
    apiPostmapping();
    props.FormToFormMapping(false);
  };
  const handleClear = () => {
    // console.log("clearall");
    // console.log(bpmn);
    setSelectedbpmn(null);
  };

  const onCloseModal = () => {
    props.FormToFormMapping(false);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={`Bind ${selectedFormName.replace(
          /\.[^/.]+$/,
          ""
        )} to WorkFlow`}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={" popup"}
        id="mapping-workflow-model"
      >
        <Row className="mapdataRow">
          <Col lg={12} className="mapdatainfo">
            <Row>
              <Col md={4}>
                <div className="workflow">
                  <p className="secondaryColor" id="map-modal-workflow">
                    {t("Workflow")}
                  </p>
                  <CustomSelect
                    id="map-workflow-dropdown"
                    defaulVal={null}
                    transferFrom={bpmn}
                    bringingvalue={changeSelectedbpmn}
                    className="MappingModalDropdown"
                  />
                </div>
              </Col>
              {selectedbpmn != null && (
                <Col md={4}>
                  <div className="humantask">
                    <p className="secondaryColor" id="map-modal-humantask">
                      {t("Humantask")}
                    </p>
                    <CustomSelect
                      id="map-modal-humantask-dropdown"
                      transferFrom={usertask}
                      bringingvalue={changeSelectedTask}
                    />
                  </div>
                </Col>
              )}
            </Row>
            <div className="mapping-btn-action mt-5">
              <button
                id="map-modal-clearall-btn"
                className="secondaryButton secondaryButtonColor mx-3 "
                onClick={handleClear}
              >
                {t("Clear All")}
              </button>
              <button
                id="map-modal-map-btn"
                className="mapButton primaryButtonColor mx-3 "
                onClick={handleSelectOption}
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
export default FormMapping;
