import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import axios from "axios";

const PreviewFormRight = (props) => {
  const [activeTask, setActiveTask] = useState("HumanTask1");
  const [activeDevice, setActiveDevice] = useState("web");
  const [taskForm, setTaskForm] = useState([]);
  // const [taskFormDetail, setTaskFormDetail] = useState([]);

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

  return (
    <div className="login-formPreviewRight BodyColor">
      <div className="currentFormOpen">
        <button
          id="previewFormRight-formBtn"
          className="currentFormOpenBtn primaryButtonColor"
          onClick={() => props.currentFormOpen()}
        >
          Open Form
        </button>
      </div>
    </div>
  );
};

export default PreviewFormRight;
