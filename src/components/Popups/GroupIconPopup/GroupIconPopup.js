import { useState } from "react";
import axios from "axios";
import CommonModelContainer from "../../CommonModel/CommonModelContainer";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./GroupIconPopup.css";
import { useTranslation } from "react-i18next";
const GroupIconPopup = (props) => {
  const [t, i18n] = useTranslation("common");
  const [generateFileName, setGenerateFileName] = useState(false);
  const GenerateFormFromDataModeller = () => {
    var data = JSON.stringify({
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: localStorage.getItem("selectedForm"),
      fileType: "datamodel",
      updatedName: generateFileName,
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
        toast.success("generated successfully completed", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        props.RightSidebarToMainbodySection(false);
        props.doGetAllResources();
      })
      .catch(function (error) {
        toast.error("generation Failed", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log(error);
      });
  };

  const onCloseModal = () => {
    props.RightSidebarToMainbodySection(false);
  };

  return (
    <>
      <CommonModelContainer
        modalTitle={t("Generate")}
        show={props.buttonClick}
        handleClose={() => onCloseModal()}
        className="showmap"
        id="groupIconPopup-generate-popup"
      >
        <div className="mapdataRow row">
          <div className="mapdatainfo col">
            <div className="mapping-select-box">
              <p className="secondaryColor">File Name</p>
              <input
                type="text"
                onChange={(e) => setGenerateFileName(e.target.value)}
                id="groupIconPopup-customSelect"
                className="gernate-file-name"
              />
            </div>
            <div className="mapping-btn-action mt-5">
              <button
                className="mapButton primaryButtonColor"
                onClick={GenerateFormFromDataModeller}
                id="groupIconPopup-generate-btn"
              >
                {t("Generate")}
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>
    </>
  );
};
export default GroupIconPopup;
