import React from "react";
import "react-toastify/dist/ReactToastify.css";
import {
  Breadcrumb,
  Tab,
  Nav,
  Dropdown,
  Image,
  TabPane,
} from "react-bootstrap";
import Sidebar from "./Sidebar";
import "./BotSettings.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";


const BotSettings = (props) => {
  const [botname, setBotname] = useState();
  const [description, setDescription] = useState();
  const [botId, setBotid] = useState();
  const [avatarUpload, setAvatarUpload] = useState("");
  const [botInformation, setBotInformation] = useState("");
  const [t, i18n] = useTranslation("common");

  const botID = localStorage.getItem("botID");

  const botData = () => {
    fetch(`http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/config`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "X-BP-Workspace": "default",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setBotname(data.name);
        setDescription(data.description);
        setBotid(data.id);
        const imgLink = data.details.avatarUrl;
        const imageUrl = `http://ns3172713.ip-151-106-32.eu:43000${imgLink}`;
        setAvatarUpload(imageUrl);
      });
  };




  const handleInputChange = (event) => {
    setBotname(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSave = () => {
    botData()
    fetch(`http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "X-BP-Workspace": "default",
      },
      body: JSON.stringify({
        name: botname,
        description: description,
        details: {
          avatarUrl: avatarUrls,
        },
      }),
    });
    botData();

  };

  // -----------------------------------Avatar upload---------------------------------------------------------

  const [fileData, setFileData] = useState(null);
  const [avatarUrls, setAvatarUrls] = useState("");

  const handleUploadAvatar = () => {
    var axios = require("axios");
    // var FormData = require("form-data");

    var data = new FormData();
    data.append("file", fileData);

    var config = {
      method: "post",
      url: `http://ns3172713.ip-151-106-32.eu:43000/api/v1/studio/${botID}/media`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("botToken")}`,
        "Content-Type":
          "multipart/form-data, boundary=----WebKitFormBoundaryUHjoN9VTPbynLaF2",
        "X-BP-Workspace": "default",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        const imgUrl = response.data.url;
        setAvatarUrls(response.data.url);
        handleSave();
      })
      .catch(function (error) {
        console.log(error);
      });
    botData();
    handleSave();
  };
  useEffect(() => {
    botData();
  }, []);


  return (
    <>
      <div className="setting-main-body">
        <div className="bot-setting-sidebar">
          <Sidebar />
        </div>
        <div className="bot-setting-body">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Nav variant="pills" className="bot-settings-pills">
              <Nav.Item>
                <Nav.Link eventKey="first">General</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="Second">Avatar & Cover picture</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <div className="setting-data">
                  <div>
                    <span className="secondaryColor">Bot Name</span>
                    <input
                    id="botSetting-botName"
                      type="text"
                      value={botname}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <span className="secondaryColor">Bot ID</span>
                    <input
                      type="text"
                      disabled
                      value={botId}
                      style={{ backgroundColor: "#D9D9D9" }}
                    />
                  </div>
                  {/* <div>
                    <span>Status</span>
                    <input type="text" />
                  </div> */}
                  <div>
                    <span className="secondaryColor">{t("description")}</span>
                    <input
                      type="textarea"
                      value={description}
                      onChange={handleDescriptionChange}
                    />
                  </div>
                  <div className="setting-save-button">
                    <button className="primaryButton primaryButtonColor" onClick={handleSave}>
                      Save Changes
                    </button>
                  </div>
                </div>
              </Tab.Pane>
              <TabPane eventKey="Second">
                <div className="setting-data">
                  <form>
                    <span className="secondaryColor">Bot Avatar</span>
                    <span className="avatar-upload secondaryColor">
                      <input
                        type="file"
                        onChange={(e) => setFileData(e.target.files[0])}
                        className="avatar-upload"
                      />
                      <button
                        id="botSetting-avatarUpload"
                        className="primaryButton primaryButtonColor uploadImage"
                        onClick={() => handleUploadAvatar()}
                      >
                        Upload
                      </button>
                    </span>
                    <span className="image-preview-content secondaryColor">
                      {/* {
                        avatarUrls != "" &&(<img src={avatarUpload} className="image-preview" alt="No Image"/>)
                      } */}
                      <img src={avatarUpload} alt="No Image" />
                    </span>
                    <div className="setting-save-button">
                      <button
                        id="botSettings-bot-saveChanges"
                        className="primaryButton primaryButtonColor"
                        onClick={() => handleSave()}
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </TabPane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};

export default BotSettings;
