import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { FormLaptop, ProfileIcon, SelectBpmn } from "../../../assets";
import CommonModelContainer from "../../CommonModel/CommonModelContainer";
import CustomSelect from "../../CustomSelect/CustomSelect";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
const GroupIconPopUpBpmn = (props) => {
  const [t, i18n] = useTranslation("common");
  const { data } = props;
  const [mapData, setMapData] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [bpmn, setBpmn] = useState(null);
  const [selectedBpmn, setSelectedBpmn] = useState(null);

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
        getBpmn(res.data.data.bpmn);
      });
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

  const GenerateFormFromBpmn = () => {
    var data = JSON.stringify({
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: selectedBpmn.value,
      fileType: "bpmn",
    });

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_MODELLER_API_ENDPOINT}modellerService/formmodeller/generateFile`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        props.RightSidebarToMainbodySection(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSelectOption = (e) => {
    // console.log(e.target.value)
    setSelectOption(e.target.value);
  };

  const onCloseModal = () => {
    props.RightSidebarToMainbodySection(false);
  };

  const updateSelectedBpmn = (bpmn) => {
    setSelectedBpmn(bpmn);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={t("Generate")}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className={mapData && "showmap"}
        id="groupIconPopUpBpmn-generate-popup"
      >
        <Row className="mapdataRow">
          <Col lg={12} className="mapdatainfo">
            <Row>
              <Col md={12}>
                <div className="mapping-select-box">
                  <p className="secondaryColor">File Name</p>
                  <CustomSelect
                    transferFrom={bpmn}
                    bringingvalue={updateSelectedBpmn}
                    id="groupIconPopUpBpmn-customSelect"
                  />
                </div>
              </Col>
            </Row>
            <div className="mapping-btn-action mt-5">
              <button className="mapButton primaryButtonColor" onClick={GenerateFormFromBpmn}  id="groupIconPopUpBpmn-generate-btn">
              {t("Generate")}
              </button>
            </div>
          </Col>
        </Row>
      </CommonModelContainer>
    </>
  );
};
export default GroupIconPopUpBpmn;
