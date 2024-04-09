import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Accordion, Dropdown, Nav, Tabs, Tab } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import axios from "axios";
import { useRecoilState, useRecoilValue } from "recoil";
import AssetUi from "./AssetUi/AssetUi";
import EntitityRelationIcon from "../../assets/Icons/entityrelation.svg";
import { ReactComponent as Publish } from "../../assets/NewIcon/Publish.svg";
import { ReactComponent as Er } from "../../assets/NewIcon/Er.svg";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { ReactComponent as simulateCs } from "../../assets/NewIcon/simulateCs.svg";
import { ReactComponent as Interaction } from "../../assets/NewIcon/Interaction.svg";
import {
  DateTime,
  simulate,
  DropdownIcon,
  FileUpload,
  LogoIcon,
  Number,
  RadioBtn,
  Rating,
  Section,
  TextBox,
  UploadFile,
  CheckboxIcon,
  Grid,
  ImgIcon,
  Signature,
  LocationIcon,
  LinkIcon,
  QrCode,
  MathIcon,
  PlayIcon,
  MapIcon,
  GroupIcon,
} from "../../assets";
import { RiLoader4Line } from "react-icons/ri";
import ErrorScreenContainer from "../ErrorScreen/ErrorScreenContainer";
import MainbodySectionContainer from "../MainbodySection/MainbodySectionContainer";
import MappingFormToBpmnContainer from "../MappingFormToBpmn/MappingFormToBpmnContainer";
import MainbodySection from "../MainbodySection/MainbodySection";
import {
  configAtom,
  autoSaveFeatureAtom,
  isSavingEnabledState,
} from "../../state/atom";
import "./RightSidebar.css";
import Deploy from "../Deploy/Deploy";

import TextBoxUi from "../FormBuilder/TextBox/TextBoxUi";
import NumberUi from "../FormBuilder/Number/NumberUi";
import DateTimeUi from "../FormBuilder/DateTime/DateTime";
import DropdownUi from "../FormBuilder/Dropdown/DropdownUi";
import SectionUi from "../FormBuilder/Section/SectionUi";
import ListUi from "../FormBuilder/List/ListUi";
import RadioButtonUi from "../FormBuilder/RadioButton/RadioButtonUi";
import RatingUi from "../FormBuilder/Rating/RatingUi";
import FileUploadUi from "../FormBuilder/FileUpload/FileUploadUi";
import CheckboxUi from "../FormBuilder/Checkbox/CheckboxUi";
import DataGridUi from "../FormBuilder/DataGrid/DataGridUi";
import ImageUploadUi from "../FormBuilder/ImageUpload/ImageUploadUi";
import ESignatureUi from "../FormBuilder/ESignature/ESignatureUi";
import LocationUi from "../FormBuilder/Location/LocationUi";
import LinkUi from "../FormBuilder/Link/LinkUi";
import QRCodeUi from "../FormBuilder/QRCode/QRCodeUi";
import MathExpUi from "../FormBuilder/MathExp/MathExpUi";
import LabelUi from "../FormBuilder/Label/LabelUi";
import FormBuilderTabPaneContainer from "../FormBuilderTabPane/FormBuilderTabPaneContainer";
import DataModeller from "../DataModeler/DataModeller";
import BpmnDesigner from "../BPMNDesigner/BpmnDesigner";
import DNMDesigner from "../DNMDesigner/DNMDesigner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";

import {
  activeTabNameState,
  openFilesState,
  loggedInUserState,
} from "../../state/atom";
import HomePageTabPaneContainer from "../HomePageTabPane/HomePageTabPaneContainer";
import ButtonUi from "../FormBuilder/Button/ButtonUi";
import IntellisheetUi from "../FormBuilder/Intellisheet/IntellisheetUi";
import ER from "../ErDiagram/ER";
import { autoSave } from "../../state/atom";
import { useTranslation } from "react-i18next";

const RightSidebar = ({ closeFileInTab, doGetAllResources }) => {
  const [t, i18n] = useTranslation("common");
  const [isERPopupOpen, setERPopupOpen] = useState(false);
  const openFiles = useRecoilValue(openFilesState);
  const [isDisplayError, setIsDisplayError] = useState(false);
  const [activeTabName, setActiveTabName] = useRecoilState(activeTabNameState);
  const [key, setKey] = useState("frm");
  const [deploymentPopup, setdeploymentPopup] = useState(false);

  const isLoading = useRecoilValue(autoSave);
  const showDeploymentPopup = () => {
    setdeploymentPopup(true);
  };

  const openFileAPopup = () => {
    setERPopupOpen(true);
  };
  const closeFileAPopup = () => {
    setERPopupOpen(false);
  };

  const handelCloseDeployment = (MainbodySection) => {
    setdeploymentPopup(MainbodySection);
  };
  const changeActiveTab = (item) => {
    setActiveTabName(
      item ? item : openFiles[openFiles.length - 1]?.resourceName
    );
  };

  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  useEffect(() => {
    changeActiveTab();
  }, [openFiles]);

  const [elements, setElements] = useState(null);

  const showErrors = () => {
    setIsDisplayError(!isDisplayError);
  };

  useEffect(() => {
    var formElementsData = {
      coreElements: [
        {
          id: "959198127",
          elementType: "label",
          placeholder: "",
          required: "true",
        },
        {
          id: "203149589",
          elementType: "text",
          placeholder: "Place your text here",
          required: "true",
        },
        {
          id: "890726310",
          elementType: "number",
          placeholder: "Number",
          required: "true",
        },
        {
          id: "623382009",
          elementType: "date",
          placeholder: "Date & Time",
          required: "true",
        },
        {
          id: "613609421",
          elementType: "dropdown",
          placeholder: "Drop Down",
          required: "true",
        },
        {
          id: "902965771",
          elementType: "section",
          placeholder: "Section",
          required: "true",
        },
        {
          id: "902965675",
          elementType: "list",
          placeholder: "list",
          required: "true",
          style: "height:100%",
        },
        {
          id: "533377879",
          elementType: "radio",
          placeholder: "Radio Button",
          required: "true",
        },
        {
          id: "600374693",
          elementType: "rating",
          placeholder: "Rating",
          required: "true",
        },
        {
          id: "239526292",
          elementType: "file",
          placeholder: "File Upload",
          required: "true",
        },
        {
          id: "887177023",
          elementType: "checkbox",
          placeholder: "Checkbox",
          required: "true",
        },
        {
          id: "309318518",
          elementType: "image",
          placeholder: "Image Upload",
          required: "true",
        },
        {
          id: "3093185939",
          elementType: "button",
          placeholder: t("Button"),
          required: "true",
        },
        {
          id: "6742175555",
          elementType: "intellisheet",
          placeholder: "Intellisheet",
          required: "true",
        },
      ],
      layoutElements: [
        {
          id: "404391136",
          elementType: "dataGrid",
          placeholder: "Data Grid",
          required: "true",
        },
      ],
      advancedElements: [
        // {
        //   id: "687935542",
        //   elementType: "esign",
        //   placeholder: "E Signature",
        //   required: "true",
        // },
        // {
        //   id: "418759057",
        //   elementType: "location",
        //   placeholder: "Location",
        //   required: "true",
        // },
        {
          id: "687935542",
          elementType: "esign",
          placeholder: "E Signature",
          required: "true",
        },
        // {
        //   id: "418759057",
        //   elementType: "location",
        //   placeholder: "Location",
        //   required: "true",
        // },
        {
          id: "941642541",
          elementType: "link",
          placeholder: "Link",
          required: "true",
        },
        {
          id: "258893233",
          elementType: "qrcode",
          placeholder: "QR Code",
          required: "true",
        },
        {
          id: "674217238",
          elementType: "mathexp",
          placeholder: "Math Exp.",
          required: "true",
        },
        // {
        //   id: "203982932",
        //   elementType: "image",
        //   placeholder: "Image Upload",
        //   required: "true",
        // },
      ],
    };
    setElements(formElementsData);
    // axios.get(process.env.REACT_APP_API_ENDPOINT + `form`).then((res) => {
    //   setElements(JSON.parse(JSON.stringify(res.data[0])));
    // });
  }, []);

  const templateElements = ["grid", "image"];

  const renderElements = (item, index) => {
    switch (item.elementType) {
      case "label":
        return <LabelUi item={item} />;
      case "text":
        return <TextBoxUi item={item} key={index} />;
      case "number":
        return <NumberUi item={item} key={index} />;
      case "date":
        return <DateTimeUi item={item} key={index} />;
      case "dropdown":
        return <DropdownUi item={item} key={index} />;
      case "section":
        return <SectionUi item={item} key={index} />;
      case "list":
        return <ListUi item={item} key={index} />;
      case "radio":
        return <RadioButtonUi item={item} key={index} />;
      case "rating":
        return <RatingUi item={item} key={index} />;
      case "file":
        return <FileUploadUi item={item} key={index} />;
      case "checkbox":
        return <CheckboxUi item={item} key={index} />;
      case "dataGrid":
        return <DataGridUi item={item} key={index} />;
      case "image":
        return <ImageUploadUi item={item} key={index} />;
      case "esign":
        return <ESignatureUi item={item} key={index} />;
      case "location":
        return <LocationUi item={item} key={index} />;
      case "link":
        return <LinkUi item={item} key={index} />;
      case "qrcode":
        return <QRCodeUi item={item} key={index} />;
      case "mathexp":
        return <MathExpUi item={item} key={index} />;
      case "button":
        return <ButtonUi item={item} key={index} />;
      case "intellisheet":
        return <IntellisheetUi item={item} key={index} />;
      default:
        break;
    }
  };

  const switchTab = (item) => {
    if (item.resourceType === "form") {
      localStorage.setItem("selectedForm", item.resourceName);
    } else if (item.resourceType === "page") {
      localStorage.setItem("selectedForm", item.resourceName);
    }
    changeActiveTab(item.resourceName);
  };

  const mouseDownHandlerTabClose = (event, item) => {
    if (event.button === 1) {
      closeFileInTab(item);
    }
  };

  const [isSavingEnabled, setSavingEnabled] =
    useRecoilState(isSavingEnabledState);

  const handleToggleChange = (e) => {
    localStorage.setItem("AutoSavefeature", e);
    console.log("toggleValue", e);
    setSavingEnabled(e);
  };
  return (
    <>
      {/* <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <div className="main-work-flow BodyColor">
        <Tab.Container id="left-tabs-example" activeKey={activeTabName}>
          <div className="main-work-topbar BodyColor">
            <Nav
              variant="pills"
              className="main-pages-tabs row customScrollBar"
            >
              {openFiles?.map((item, index) => {
                let fileNameString = item.resourceName.split(".");
                let fileName = fileNameString[0];
                let fileNameIcon = fileNameString[1];
                return (
                  <Nav.Item
                    key={item.resourceName}
                    data-tip
                    data-for={fileName}
                    className="col primaryButton BodyColor"
                  >
                    <Nav.Link
                      id="rightSidebar-leftSide-item"
                      eventKey={item.resourceName}
                      onClick={() => switchTab(item)}
                      onMouseDown={(event) =>
                        mouseDownHandlerTabClose(event, item)
                      }
                      className="BodyColor"
                    >
                      <Icon
                        icon={
                          fileNameIcon === "frm"
                            ? "jam:screen"
                            : fileNameIcon === "dmn"
                            ? "carbon:flow-data"
                            : fileNameIcon === "java"
                            ? "bx:bx-data"
                            : fileNameIcon === "bpmn" || "bpmn2"
                            ? "octicon:workflow-24"
                            : ""
                        }
                      />
                      {/* {fileName?.slice(0, 13)} */}
                      <span className="FormBuilderTabName">{fileName}</span>
                      <Icon
                        className="close-tabs-icon"
                        icon="ep:close-bold"
                        onClick={() => {
                          closeFileInTab(item);
                        }}
                        id="rightSidebar-close-tab-icon"
                      />
                      <ReactTooltip id={fileName} place="bottom" effect="solid">
                        {fileName}
                      </ReactTooltip>
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
            <div className="tab-setting-main">
              <>
                <ul className="pages-tab-setting">
                  {/* <li data-tip data-for="autoSave">
                    <div>
                      {isLoading && (
                        <div className="autosave-loader">
                          <RiLoader4Line className="spinner" />
                        </div>
                        <div className="autosave-loader">
                          <RiLoader4Line className="spinner" />
                        </div>
                      )}
                    </div>
                    <ReactTooltip
                      id="autoSave"
                      className="tooltipCustom"
                      arrowColor="rgba(0, 0, 0, 0)"
                      place="bottom"
                      effect="solid"
                    >
                      Auto Save
                    </ReactTooltip>
                  </li> */}
                  <li data-tip data-for="autoSave">
                    <div className="rightSidebar-autoSave" id="autoSave-feature">
                      <BootstrapSwitchButton
                        checked={
                          localStorage.getItem("AutoSavefeature") == "true"
                            ? true
                            : false
                        }
                        size="sm"
                        onChange={(e) => handleToggleChange(e)}
                        id="addUser-userDataEnabled-BootstrapSwitchButton"
                      />
                    </div>
                    <ReactTooltip
                      id="autoSave"
                      className="tooltipCustom"
                      arrowColor="rgba(0, 0, 0, 0)"
                      place="bottom"
                      effect="solid"
                    >
                     {t("Auto Save")}
                    </ReactTooltip>
                  </li>
                  {loggedInUser.enabled_menus?.menus_enabled?.includes(
                    "APPDESIGNER_CREATEASSET"
                  ) && (
                    <li data-tip data-for="AddAsset">
                      <AssetUi
                        doGetAllResources={doGetAllResources}
                        id="rightSidebar-addAssets"
                      />
                      <ReactTooltip
                        id="AddAsset"
                        className="tooltipCustom"
                        arrowColor="rgba(0, 0, 0, 0)"
                        place="bottom"
                        effect="solid"
                      >
                       {t(" Add Asset")}
                      </ReactTooltip>
                    </li>
                  )}
                  <li style={{ borderLeft: "2px solid #E5E5E5" }}>
                    <Link
                    to="#"
                      data-tip
                      data-for="Simulate"
                      id="rightSidebar-simulate"
                    >
                      <img
                        className="svg-stroke-comingSoonIcon"
                        src={simulate}
                      />
                      {/* <Interaction className="svg-stroke-comingSoonIcon"/> */}
                      {/* <simulateCs /> */}
                    </Link>
                    <ReactTooltip
                      id="Simulate"
                      className="tooltipCustom"
                      arrowColor="rgba(0, 0, 0, 0)"
                      place="bottom"
                      effect="solid"
                    >
                      {t("comingSoon")}
                    </ReactTooltip>
                  </li>
                  {loggedInUser.enabled_menus?.menus_enabled?.includes(
                    "APPDESIGNER_PUBLISH"
                  ) && (
                    <li style={{ borderRight: "2px solid #E5E5E5" }}>
                      <Link
                      to="#"
                        onClick={showDeploymentPopup}
                        data-tip
                        data-for="Publish"
                        id="rightSidebar-publish"
                      >
                        <Publish className="svg-fill iconFillhover iconSvgFillColor" />
                      </Link>
                      <ReactTooltip
                        id="Publish"
                        className="tooltipCustom"
                        arrowColor="rgba(0, 0, 0, 0)"
                        place="bottom"
                        effect="solid"
                      >
                        {t("Publish")}
                      </ReactTooltip>
                      <Deploy
                        showDeployment={deploymentPopup}
                        closeDeploymentPopup={handelCloseDeployment}
                        id="rightSidebar-deploy"
                      />
                    </li>
                  )}

                  <li>
                    <Link
                    to="#"
                      onClick={openFileAPopup}
                      data-tip
                      data-for="Entity Relationship"
                      id="rightSidebar-entityRelationship"
                    >
                      <Er className="svg-stroke iconStrokehover iconSvgStrokeColor erdiagram" />
                    </Link>
                    <ReactTooltip
                      id="Entity Relationship"
                      className="tooltipCustom"
                      arrowColor="rgba(0, 0, 0, 0)"
                      place="left"
                      effect="solid"
                    >
                      {t("Er Diagram")}
                    </ReactTooltip>
                  </li>
                </ul>
              </>
            </div>
          </div>
          <Tab.Content className="RightSideBarTabContent BodyColor">
            {openFiles?.map((item) => {
              let type = item.resourceType;

              if (type === "form") {
                return (
                  <Tab.Pane
                    eventKey={item.resourceName}
                    key={item.resourceName}
                  >
                    <FormBuilderTabPaneContainer
                      data={item}
                      elements={elements}
                      isDisplayError={isDisplayError}
                      showErrors={showErrors}
                      templateElements={templateElements}
                      renderElements={renderElements}
                      doGetAllResources={doGetAllResources}
                      closeFileInTab={closeFileInTab}
                    />
                  </Tab.Pane>
                );
              }

              if (type === "page") {
                return (
                  <Tab.Pane
                    eventKey={item.resourceName}
                    key={item.resourceName}
                  >
                    <HomePageTabPaneContainer
                      data={item}
                      isDisplayError={isDisplayError}
                      showErrors={showErrors}
                      doGetAllResources={doGetAllResources}
                      closeFileInTab={closeFileInTab}
                    />
                  </Tab.Pane>
                );
              }

              if (type === "bpmn") {
                return (
                  <Tab.Pane
                    eventKey={item.resourceName}
                    key={item.resourceName}
                  >
                    <BpmnDesigner
                      data={item}
                      // elements={elements}
                      // isDisplayError={isDisplayError}
                      // showErrors={showErrors}
                      // templateElements={templateElements}
                      // renderElements={renderElements}
                      doGetAllResources={doGetAllResources}
                      closeFileInTab={closeFileInTab}
                    />
                  </Tab.Pane>
                );
              }

              if (type === "dmn") {
                return (
                  <Tab.Pane
                    eventKey={item.resourceName}
                    key={item.resourceName}
                  >
                    <DNMDesigner
                      data={item}
                      // elements={elements}
                      // isDisplayError={isDisplayError}
                      // showErrors={showErrors}
                      // templateElements={templateElements}
                      // renderElements={renderElements}
                      doGetAllResources={doGetAllResources}
                      closeFileInTab={closeFileInTab}
                    />
                  </Tab.Pane>
                );
              }

              if (type === "datamodel") {
                return (
                  <Tab.Pane
                    eventKey={item.resourceName}
                    key={item.resourceName}
                  >
                    <DataModeller
                      data={item}
                      doGetAllResources={doGetAllResources}
                      // elements={elements}
                      // isDisplayError={isDisplayError}
                      // showErrors={showErrors}
                      // templateElements={templateElements}
                      // renderElements={renderElements}
                      closeFileInTab={closeFileInTab}
                    />
                  </Tab.Pane>
                );
              }
            })}
          </Tab.Content>
        </Tab.Container>
        <CommonModelContainer
          modalTitle={`${localStorage.getItem("displayName")} - ER Diagram`}
          show={isERPopupOpen}
          handleClose={closeFileAPopup}
          className="erDiagram-popup"
        >
          <div>
            <ER />
          </div>
        </CommonModelContainer>
      </div>
    </>
  );
};
export default RightSidebar;
