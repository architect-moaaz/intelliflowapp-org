import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Accordion, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import FormDropSection from "./FormBuilder/FormDropSection";
import FormElementsPropertiesSection from "./FormBuilder/FormElementsPropertiesSection";
import YourLogo from "../../assets/images/your-logo.png";
import { ReactComponent as Mobile } from "../../assets/NewIcon/Mobile.svg";
import { ReactComponent as MobileWeb } from "../../assets/NewIcon/Mobile&web.svg";
import { ReactComponent as Web } from "../../assets/NewIcon/web.svg";
import "./HomePageTabPane.css";
import { CancelIcon, DeleteIco } from "../../assets";
import { ReactComponent as DeleteAll } from "../../assets/NewIcon/Delete.svg";
import { useRecoilValue } from "recoil";
import { formbuilderErrorsState } from "../../state/atom";
import LabelUi from "./FormBuilder/Label/LabelUi";
import TimerUi from "./FormBuilder/Timer/TimerUi";
import DataGridUi from "./FormBuilder/DataGrid/DataGridUi";
import MediaUi from "./FormBuilder/Media/MediaUi";
import LocationUi from "./FormBuilder/Location/LocationUi";
import LinkUi from "./FormBuilder/Link/LinkUi";
import QRCodeUi from "./FormBuilder/QRCode/QRCodeUi";
import ActionUi from "./FormBuilder/Action/ActionUi";
import ToDoUi from "./FormBuilder/ToDo/ToDoUi";
import AccordionUi from "./FormBuilder/Accordion/AccordionUi";
import TabUi from "./FormBuilder/Tab/TabUi";
import MenuUi from "./FormBuilder/Menu/MenuUi";
import RecentActivitiesUi from "./FormBuilder/RecentActivities/RecentActivitiesUi";
import EmbedUi from "./FormBuilder/Embed/EmbedUi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { formPropertiesHomePage } from "../../state/atom";
import FormBug from "../../assets/images/formBG.jpg"
export default function HomePageTabPane({
  data,
  element,
  setElement,
  layout,
  setLayout,
  isDisplayError,
  showErrors,
  formProp,
}) {
  const [showSection, setShowSection] = useState(false);
  const [mappedRoleId, setMappedRoleId] = useState([]);
  const [mappedPage, setMappedPage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [mappedTaskType, setMappedTaskType] = useState("");
  const formbuilderErrors = useRecoilValue(formbuilderErrorsState);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [mapChanges, setMapChanges] = useState(1);
  const [zoomValue, setZoomValue] = useState(100);
  const [removeRoleMapping, setRemoveRoleMapping] = useState("");
  const [showMappingModal, setShowMappingModal] = useState(false);
  var homepageSelected = localStorage.getItem("selectedForm");
  const [showMappingDeleteModal, setShowMappingDeleteModal] = useState(false);
  const [searchElementValue, setSearchElementValue] = useState("");
  const [t, i18n] = useTranslation("common");
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();

  const elements = [
    {
      id: "959198127",
      elementType: "label",
      placeholder: t("Label"),
      required: "true",
    },
    // {
    //   id: "623382009",
    //   elementType: "timer",
    //   placeholder: "Countdown / Timer",
    //   required: "true",
    // },
    {
      id: "309318518",
      elementType: "media",
      placeholder: "Media",
      required: "true",
    },
    {
      id: "258893233",
      elementType: "qrcode",
      placeholder: "QR Code",
      required: "true",
    },
    // {
    //   id: "418759057",
    //   elementType: "location",
    //   placeholder: "Location",
    //   required: "true",
    // },
    {
      id: "404391136",
      elementType: "dataGrid",
      placeholder: "Data Grid",
      required: "true",
    },
    {
      id: "941642541",
      elementType: "link",
      placeholder: "Link",
      required: "true",
    },
    {
      id: "093795731",
      elementType: "action",
      placeholder: "Action",
      required: "true",
    },
    {
      id: "069695731",
      elementType: "todo",
      placeholder: "To-Do",
      required: "true",
    },
    {
      id: "069695732",
      elementType: "accordion",
      placeholder: "Accordion",
      required: "true",
    },
    {
      id: "069695733",
      elementType: "tab",
      placeholder: "Tab",
      required: "true",
    },
    {
      id: "0696957393",
      elementType: "menu",
      placeholder: "Menu",
      required: "true",
    },
    {
      id: "06969573941",
      elementType: "recentActivities",
      placeholder: "Recent Activities",
      required: "true",
    },
    {
      id: "069695739414515",
      elementType: "embed",
      placeholder: "Embed",
      required: "true",
    },
  ];



  const templateElements = [];

  const assignRole = () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/workflow/rolemapping/" +
        localStorage.getItem("workspace") +
        "/" +
        localStorage.getItem("appName"),
      headers: {},
    };

    axios(config)
      .then(function (response) {
        const pageRoleId = [];
        response.data.data.forEach((element) => {
          if (homepageSelected == element.page) {
            pageRoleId.push(element.roleid);
          }
        });
        setMappedRoleId([...pageRoleId]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    assignRole();
  }, []);

  useEffect(() => {
    if (mappedRoleId?.length === 0) {
      setShowMappingModal(false);
    }
  }, [mappedRoleId]);

  const removeRole = () => {
    var config = {
      method: "POST",
      url:
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/role/mapping/delete",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        roleId: removeRoleMapping,
      },
    };
    axios(config)
      .then(function (response) {
        console.log("delete", response);
        toast.success("Role Removed Successfully", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        assignRole();

        if (mappedRoleId.length !== 0) {
          setShowMappingModal(true);
        }
      })
      .catch((e) => {
        console.log({ e });
        toast.error("Error while removing the Role", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
    setShowMappingDeleteModal(false);
  };

  const displaymappinginfo = () => {
    // console.log("mapping", mappedRoleId);
    if (mappedRoleId?.length === 0) {
      return (
        <>
          {" "}
          <span className="secondaryColor" id="role-mapping-not-mapped">
            {t("Not Mapped")}
          </span>
        </>
      );
    } else if (mappedRoleId.length !== 0) {
      return (
        <>
          <span
            className="secondaryColor"
            id="role-mapping-info-span"
            style={{
              display: "flex",
              minWidth: "max-content",
              width: "max-content",
              cursor: "pointer",
            }}
            onClick={() => setShowMappingModal(true)}
          >
            {t("Assign Role Info")}
          </span>
        </>
      );
    }
  };

  const renderElements = (item, index) => {
    switch (item.elementType) {
      case "label":
        return <LabelUi item={item} />;
      case "timer":
        return <TimerUi item={item} key={index} />;
      case "media":
        return <MediaUi item={item} key={index} />;
      case "qrcode":
        return <QRCodeUi item={item} key={index} />;
      case "location":
        return <LocationUi item={item} key={index} />;
      case "dataGrid":
        return <DataGridUi item={item} key={index} />;
      case "link":
        return <LinkUi item={item} key={index} />;
      case "action":
        return <ActionUi item={item} key={index} />;
      case "todo":
        return <ToDoUi item={item} key={index} />;
      case "accordion":
        return <AccordionUi item={item} key={index} />;
      case "tab":
        return <TabUi item={item} key={index} />;
      case "menu":
        return <MenuUi item={item} key={index} />;
      case "recentActivities":
        return <RecentActivitiesUi item={item} key={index} />;
      case "embed":
        return <EmbedUi item={item} key={index} />;
      default:
        return <h1>{item.placeholder}</h1>;
    }
  };

  const zoomInPage = () => {
    setZoomValue((zoomValue) => zoomValue + 5);
  };

  const zoomOutPage = () => {
    setZoomValue((zoomValue) => zoomValue - 5);
  };

  const closeMappingModal = () => {
    setShowMappingModal(false);
  };
  const onMappingDeleteModalClose = () => {
    setShowMappingDeleteModal(false);
    setShowMappingModal(true);
  };
  const onMappingDeleteIconClick = (e) => {
    setShowMappingDeleteModal(true);
    setRemoveRoleMapping(e);
    setShowMappingModal(false);
    e.preventDefault();
  };

  const homePagePropertiesVal = formProp 
  // console.log("homePagePropertiesVal", homePagePropertiesVal)
  console.log("homepage prop ", homePagePropertiesVal);

  useEffect(() => {
    const fetchImage = async () => {
      const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
        homePagePropertiesVal?.backgroundImage
      }?Authorization=${localStorage.getItem(
        "token"
      )}&workspace=${localStorage.getItem("workspace")}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch the image");
        }

        const AppImageBlob = await response.blob();
        const AppImageBlobImage = new File([AppImageBlob], "image.jpg", {
          type: "image/jpg",
        });
        setGenerateBackgroundImage(AppImageBlobImage);
      } catch (error) {
        console.error(error);
        setGenerateBackgroundImage(null);
      }
    };

    fetchImage();
  }, [homePagePropertiesVal?.backgroundImage]);


  const style = {
    width: `calc(100% - 180px + ${zoomValue}px)`,
    zoom: `${zoomValue}%`,
    height: "100%",
    position: "relative",    
    fontFamily:  `${homePagePropertiesVal?.fontFamily}`,  
  }
  if(homePagePropertiesVal?.backgroundColor?.length > 0){
    style.backgroundColor = homePagePropertiesVal.backgroundColor 
  }else if (
    homePagePropertiesVal?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  ) {
    style.backgroundImage = `url(${URL.createObjectURL(
      generateBackgroundImage
    )})`;
    style.backgroundRepeat = "no-repeat";
    style.backgroundSize = "cover";
  } else {
    style.backgroundColor = "";
    style.backgroundImage = `url(${FormBug})`;
    style.backgroundRepeat = "repeat";
    style.backgroundSize = "25%";
  }
  console.log("style",style);

  return (
    <>
      <div className="files-body-wrap">
        <div className="fileExplorer-main" style={{ width: "180px" }}>
          {/* <div className="fileExplorer-main" style={{ width: "13%" }}> */}
          <div className="fileExplorer-sidebar BodyColor">
            <div className="fileExplorer-search">
              <Link id="file-explorer-link">
                <Icon icon="akar-icons:search" />
              </Link>
              <input
                id="file-explorer-input"
                type="search"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t("search")}
              />
            </div>
            <Accordion
              className="sidebar-accordion customScrollBar"
              defaultActiveKey={["0"]}
              alwaysOpen
            >
              <Accordion.Item className="BodyColor" eventKey="0">
                <Accordion.Header>
                  {t("Elements")}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="coreUIDropdown"
                    // style={{ marginLeft: "80px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="fileExplorer-sidebar-wrap">
                    {elements
                      ?.filter((e) =>
                        e.elementType
                          .toLowerCase()
                          .replace(/\.[^/.]+$/, "")
                          .includes(searchValue.toLowerCase())
                      )

                      ?.map((item, index) => renderElements(item, index))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>
                  {t("Templates")}
                  {templateElements
                    ?.filter((e) =>
                      e.elementType
                        .toLowerCase()
                        .replace(/\.[^/.]+$/, "")
                        .includes(searchValue.toLowerCase())
                    )
                    ?.map((item, index) => renderElements(item, index))}
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="coreUIDropdown"
                    // style={{ marginLeft: "53px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="fileExplorer-sidebar-wrap">
                    {templateElements.map((item, index) =>
                      renderElements(item, index)
                    )}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
        <div
        // bgimage 
          className="main-body-wrap  customScrollBar "
          // style={{ width: "87%" }}

          style={style}        
          
        >
          {/* <MainbodySectionContainer /> */}
          <FormDropSection
            setElement={setElement}
            layout={layout}
            setLayout={setLayout}
            showSection={showSection}
            setShowSection={setShowSection}
            formProp={formProp}
          />
        </div>
        <FormElementsPropertiesSection
          element={element}
          layout={layout}
          setLayout={setLayout}
          showSection={showSection}
          setShowSection={setShowSection}
        />
      </div>
      <div
        className=" appdesigner-asset-footer BodyColor "
        style={{ backgroundColor: "#fff" }}
      >
        <Col md={10}>
          {/* <Row>
            <div
              className="my-1 py-1 error-font"
              style={{ borderBottom: "1px solid #F5F5F5" }}
            >
              <span>
                {formbuilderErrors.forms[data.resourceName]
                  ? formbuilderErrors.forms[data.resourceName]
                      .dataVariableErrors.length +
                    formbuilderErrors.forms[data.resourceName].fieldNameErrors
                      .length +
                    formbuilderErrors.forms[data.resourceName].ratingFieldErrors
                      .length
                  : 0}{" "}
                Errors
              </span>
              <span> | </span>
              <span>0 Warnings</span>
            </div>
          </Row> */}
          <Row>
            <div className="appdesigner-footer-start">
              <div className="page-footer-status ">
                <div className="mapped">
                  {mappedRoleId?.length === 0 ? (
                    <Icon icon="flat-color-icons:broken-link" />
                  ) : (
                    <Icon icon="bi:link" />
                  )}
                  {displaymappinginfo()}
                </div>
              </div>
              <div
                className="col-md-4"
                style={{ fontSize: "12px", color: "#0D3C84" }}
              >
                {t("My App uploaded at 18:00")}
              </div>
              <div
                className=" col-md-2 zoom-view-device"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <div className="d-flex justify-content-center mx-2">
                  <div>
                    <Link
                      id="homePage-mobile-web"
                      className="text-orange"
                      to="#"
                    >
                      {/* <Icon
                        icon="mdi:responsive"
                        style={{ color: "#0D3C84" }}
                      /> */}
                      <MobileWeb className="svg-fill-comingSoonIcon" />
                    </Link>
                  </div>
                  <div>
                    <Link
                      id="homePage-mobile"
                      className="text-orange px-2 "
                      to="#"
                    >
                      {/* <Icon
                        icon="akar-icons:mobile-device"
                        style={{ color: "#0D3C84" }}
                      /> */}
                      <Mobile className="svg-stroke-comingSoonIcon" />
                    </Link>
                  </div>

                  <div>
                    <Link id="homePage-web" to="#">
                      {/* <Icon
                        icon="fluent:desktop-24-regular"
                        style={{ color: "#0D3C84" }}
                      /> */}
                      <Web className="svg-fill-comingSoonIcon" />
                    </Link>
                  </div>
                </div>
                <div
                  className="col-md-3 px-5 "
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "baseline",
                    justifyContent: "center",
                    background: "#D9D9D9",
                    borderRadius: "5px",
                  }}
                >
                  <div>
                    <Link id="page-builder-zoom-minus" to="#">
                      <Icon
                        height={15}
                        width={15}
                        icon="akar-icons:minus"
                        style={{ color: "#0D3C84" }}
                        onClick={zoomOutPage}
                      />
                    </Link>
                  </div>
                  <div
                    className="px-2"
                    style={{ fontSize: "12px", textDecoration: "none" }}
                  >
                    <Link
                      to="#"
                      id="page-builder-zoom-value"
                      style={{ textDecoration: "none", color: "#0D3C84" }}
                    >
                      {zoomValue}%
                    </Link>
                  </div>
                  <div>
                    <Link id="page-builder-plus-icon" to="#">
                      <Icon
                        height={15}
                        width={15}
                        icon="akar-icons:plus"
                        style={{ color: "#0D3C84" }}
                        onClick={zoomInPage}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Col>
        <Col
          md={2}
          style={{
            display: "flex",
            flexDirection: "row",
            placeContent: "end",
            placeItems: "center",
          }}
        >
          {/* <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          > */}
          <img
            src={YourLogo}
            className="YourLogoHere"
            crossOrigin="anonymous"
          />
          {/* </div> */}
        </Col>
      </div>
      <CommonModelContainer
        modalTitle={`Assign Role Info for ${homepageSelected.replace(
          /\.[^/.]+$/,
          ""
        )}`}
        className="assign-role-info-modal"
        show={showMappingModal}
        handleClose={closeMappingModal}
        size="md"
      >
        <Modal.Body>
          <ul className="mappingInfo_modal customScrollBar">
            <table>
              <tbody>
                {mappedRoleId?.map((role) => {
                  return (
                    <tr style={{ width: "100%" }}>
                      <td style={{ width: "80%" }}>{role.toUpperCase()}</td>
                      <td style={{ width: "20%" }}>
                        <img
                          src={CancelIcon}
                          onClick={() => onMappingDeleteIconClick(role)}
                          style={{ height: "1.8rem", width: "1.8rem" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </ul>
        </Modal.Body>
      </CommonModelContainer>
      <CommonModelContainer
        id="remove-mapping-model"
        modalTitle={t("Are you sure you want to remove the Role?")}
        show={showMappingDeleteModal}
        handleClose={onMappingDeleteModalClose}
        className="remove-mapping-modal"
      >
        <div
          className="page-delete-modal-buttons-container"
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: ".2rem",
          }}
        >
          <button
            id="delete-role-yes-btn"
            className="primaryButton primaryButtonColor"
            onClick={removeRole}
          >
            {t("Yes")}
          </button>
          <button
            id="delete-role-cancel-btn"
            className="primaryButton primaryButtonColor"
            onClick={onMappingDeleteModalClose}
          >
            {t("Cancel")}
          </button>
        </div>
      </CommonModelContainer>
    </>
  );
}
