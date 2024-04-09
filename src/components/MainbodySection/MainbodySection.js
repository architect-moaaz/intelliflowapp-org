import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { FormLaptop, ProfileIcon, SelectBpmn } from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import CustomSelect from "../CustomSelect/CustomSelect";
import "./MainbodySection.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainbodySection = (props) => {
  const [propdata, setPropdata] = useState(props);
  const [mapData, setMapData] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [dataModel, setDataModel] = useState(null);
  const [Bpmn, setBpmn] = useState(null);
  const [selecteddatamodel, setSelecteddatamodel] = useState(null);
  const [selectedbpmn, setSelectedbpmn] = useState(null);

  useEffect(() => {
    apiGet();
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
        getDataModel(res.data.data.datamodel);
        getBpmn(res.data.data.bpmn);
      });
  };
  // const changeSelecteddatemodel = (datamodel) => {
  //   setSelecteddatamodel(datamodel);
  // };

  const changeSelectedbpmn = (bpmn) => {
    setSelectedbpmn(bpmn);
  };
  const getDataModel = (data) => {
    // console.log("MainBodySection-Data", data);
    // const temp = data.map((item) => {
    //   return {
    //     value: item.resourceName,
    //     payIcon: FormLaptop,
    //   };
    // });
    // console.log("temp[0]", temp[0]);
    // console.log("temp[1]", temp[1]);
    // console.log("temp", temp);
    // setDataModel([...temp]);
    setSelecteddatamodel(localStorage.getItem("selectedForm"));
  };

  const getBpmn = (data) => {
    const temp = data.map((item) => {
      return {
        value: item.resourceName,
        payIcon: SelectBpmn,
      };
    });
    setBpmn([...temp]);
    setSelectedbpmn(temp[0]);
  };

  const apiPost = () => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      qualifiedObjectName:
        "io.intelliflow.generated.models." +
        selecteddatamodel.replace(/\.[^/.]+$/, ""),
      propertyName: selecteddatamodel.replace(/\.[^/.]+$/, ""),
      bpmnFileName: selectedbpmn.value,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/Bpmnmodeller/bind",
        postData
      )
      .then((response) => {
        toast.success("Mapping successfully completed", {
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

    apiPost();
    props.RightSidebarToMainbodySection(false);
  };

  const onCloseModal = () => {
    props.RightSidebarToMainbodySection(false);
  };

  const showMapData = () => {
    setMapData(!mapData);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle="Bind Data Model to WorkFlow"
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={mapData && "showmap"}
        id="mainbodySection-bindModel"
      >
        <Row className="mapdataRow">
          <Col lg={12} className="mapdatainfo">
            <Row>
              <Col md={6}>
                <div className="mapping-select-box">
                  <p className="secondaryColor">Bpmn</p>
                  <CustomSelect
                    transferFrom={Bpmn}
                    bringingvalue={changeSelectedbpmn}
                    id="mainbodySection-customSelect"
                  />
                </div>
              </Col>
            </Row>
            <div className="mapping-btn-action mt-5">
              <button className="secondaryButton secondaryButtonColor mx-3 "  id="mainbodySection-clearAll-btn">Clear All</button>
              <button className="mapButton primaryButtonColor mx-3" onClick={handleSelectOption}  id="mainbodySection-map-btn">
                Map
              </button>
            </div>
          </Col>
        </Row>
      </CommonModelContainer>
    </>
  );
};
export default MainbodySection;
