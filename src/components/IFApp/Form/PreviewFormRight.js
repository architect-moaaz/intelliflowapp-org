import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const PreviewFormRight = (props) => {
  const [activeTask, setActiveTask] = useState("HumanTask1");
  const [activeDevice, setActiveDevice] = useState("web");
  const [taskForm, setTaskForm] = useState([]);
  // const [taskFormDetail, setTaskFormDetail] = useState([]);
  const [t, i18n] = useTranslation("common");
  {
    t("mobile");
  }

  const taskFormName = () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/workflow/mapping/" +
        localStorage.getItem("workspace") +
        "/" +
        localStorage.getItem("appName"),
      headers: {},
    };

    axios(config)
      .then(function (response) {
        setTaskForm(response.data.data);
        // console.log(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFormData = (e) => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: e,
      fileType: "form",
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/content",
        postData
      )
      .then((response) => {
        // console.log("handleFormData", JSON.parse(response.data.data));
        // setTaskFormDetail(response.data.data);
        props.taskFormDetail(JSON.parse(response.data.data));
      });
  };

  useEffect(() => {
    taskFormName();
  }, []);

  // console.log(
  //   "taskForm",
  //   taskForm.map((e) => e.formname)
  // );

  const handleChangeRadio = (e) => {
    // console.log("handleChangeRadio", e);
    setActiveDevice(e);
  };
  const handleChangeTask = (e) => {
    setActiveTask(e);
    handleFormData(e);
    // console.log("handleChangeTask", e);
  };
  return (
    <div className="formPreviewRight BodyColor">
      {/* <div
        id="previewFormRight-top"
        className="formPreviewRightTop"
        onChange={(e) => handleChangeRadio(e.target.value)}
      >
        <div className="formPreviewDevice">
          <Icon
            icon="akar-icons:desktop-device"
            // height="33.33px"
            width="50px"
            alt="info"
            className={
              activeDevice == "web"
                ? "formPreviewDeviceIconActive "
                : "formPreviewDeviceIconNotActive "
            }
          ></Icon>
          <label
            className={
              activeDevice == "web"
                ? "formPreviewTaskLabelActive formPreviewDeviceLabel"
                : "formPreviewTaskLabelNotActive formPreviewDeviceLabel"
            }
          >
            <input
            id="previewFormRight-web"
              type="radio"
              value="web"
              name="device"
              //   onClick={handleChangeRadio}
              //   checked={selected === "web"}
              className={
                activeDevice == "web"
                  ? "formPreviewInputRadioActive formPreviewInputRadio"
                  : "formPreviewInputRadioNotActive formPreviewInputRadio"
              }
            />
            Web
          </label>
        </div>
        <div className="formPreviewDevice">
          <Icon
            icon="akar-icons:mobile-device"
            // height="33.33px"
            width="50px"
            alt="info"
            className={
              activeDevice == "mobile"
                ? "formPreviewDeviceIconActive "
                : "formPreviewDeviceIconNotActive "
            }
          ></Icon>
          <label
            className={
              activeDevice == "mobile"
                ? "formPreviewTaskLabelActive formPreviewDeviceLabel"
                : "formPreviewTaskLabelNotActive formPreviewDeviceLabel"
            }
          >
            <input
            id="previewFormRight-mobile"
              type="radio"
              value="mobile"
              name="device"
              //   onClick={handleChangeRadio}
              //   checked={selected === "mobile"}
              className={
                activeDevice == "mobile"
                  ? "formPreviewInputRadioActive formPreviewInputRadio"
                  : "formPreviewInputRadioNotActive formPreviewInputRadio"
              }
            />
            Mobile
          </label>
        </div>
      </div> */}
      <div className="currentFormOpen BodyColor">
        <button
          id="previewFormRight-formBtn"
          className="currentFormOpenBtn primaryButtonColor"
          onClick={() => props.currentFormOpen()}
        >
          {t("Open Current Form")}
        </button>
      </div>

      <div className="formPreviewRightBottom ">
        <div className="formPreviewRightBottomHeading primaryButtonColor">
          <p className="primaryButtonColor">{t("Select Human Task")}</p>
        </div>
        <div
          id="previewFormRight-bottom"
          onChange={(e) => handleChangeTask(e.target.value)}
          className="formPreviewRightBottomBody customScrollBar"
        >
          {taskForm?.map((task, i) => {
            return (
              <label
                className={
                  activeTask == task.formname
                    ? "formPreviewTaskLabelActive formPreviewTaskLabel"
                    : "formPreviewTaskLabelNotActive formPreviewTaskLabel"
                }
                key={i}
              >
                <input
                  className={
                    activeTask == task.formname
                      ? "formPreviewInputRadioActive formPreviewInputRadio"
                      : "formPreviewInputRadioNotActive formPreviewInputRadio"
                  }
                  type="radio"
                  value={task.formname}
                  name="HumanTask"
                />
                {task.formname}
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreviewFormRight;
