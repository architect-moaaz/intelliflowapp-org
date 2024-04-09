import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { IntelliflowLogo } from "../../assets";
import { ReactComponent as FormBuilder } from "../../assets/NewIcon/FormBuilder.svg";
import { ReactComponent as WorkFlow } from "../../assets/NewIcon/WorkFlow.svg";
import { ReactComponent as BusinessRule } from "../../assets/NewIcon/BusinessRule.svg";
import { ReactComponent as DataModeler } from "../../assets/NewIcon/DataModeler.svg";
import { ReactComponent as HomePage } from "../../assets/NewIcon/homepage.svg";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { Accordion } from "react-bootstrap";
import { getAllResources } from "../..//services/fileExploreCom.action";
import "./FileExploerCom.css";
import { useRecoilState } from "recoil";
import { activeTabNameState, sidebarDataState } from "../../state/atom";
import { useTranslation } from "react-i18next";

const FileExploerCom = ({ openFileInTab }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [sidebarData, setSidebarData] = useRecoilState(sidebarDataState);
  const [searchValue, setSearchValue] = useState("");
  const [activeTabName, setActiveTabName] = useRecoilState(activeTabNameState);
  const [openAccordian, setOpenAccordian] = useState("");
  let displayName = localStorage.getItem("displayName");
  let idDisplayName = displayName?.replace(/ /g, "-");
  const [t, i18n] = useTranslation("common");

  const onMenuToggle = (sidebar, e) => {
    setOpenAccordian(e);
    setSidebarToggle(sidebar);
  };
  // console.log("sidebarToggle", sidebarToggle);

  const changeActiveKey = (e) => {
    setOpenAccordian(e);
  };

  const doGetAllResources = async () => {
    await getAllResources().then((resp) => {
      setSidebarData(resp.data);
    });
  };

  const openFileInNewTab = (e, file, id) => {
    e.preventDefault();
    localStorage.setItem("selectedForm", file.resourceName);
    openFileInTab(file);
    setActiveTabName(file.resourceName);
    // toggleorange(id);
    // console.log("page", e ,file);
  };

  const renderLock = (item) => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniApp: localStorage.getItem("appName"),
      fileName: item.resourceName,
      fileType: item.resourceType,
      userId: localStorage.getItem("username"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/lockAsset",
        postData
      )
      .then((res) => {
        doGetAllResources();
      })
      .catch((e) => console.log(e));
  };

  const renderUnlock = (item) => {
    const userId = localStorage.getItem("username");
    if (item.lockOwner === userId) {
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniApp: localStorage.getItem("appName"),
        fileName: item.resourceName,
        fileType: item.resourceType,
        userId: userId,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/releaseAsset",
          postData
        )
        .then((res) => {
          doGetAllResources();
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <>
      <ul
        // onClick={onMenuToggle}
        className={cx("main-sidebar BodyColor", { showSidebar: sidebarToggle })}
      >
        <li
          className=""
          onClick={() => onMenuToggle(true, "")}
          id="fileExplorerCom-menuToggleTrue-li"
        >
          <Link className="menu-icon-left" id="fileExplorerCom-rightArrow-link" to="#">
            <Icon icon="ic:sharp-keyboard-double-arrow-right"  className="iconSvgFillColor"/>
          </Link>
        </li>
        <li
          className=""
          onClick={() => onMenuToggle(true, "0")}
          id="fileExplorerCom-menuToggleTrue0-li"
        >
          <Link id="fileExplorerCom-formBuilder-link" to="#">
            {/* <Icon icon="jam:screen" /> */}
            <FormBuilder className="svg-fill iconSvgFillColor iconFillhover" />

            {/* <img
              id="formor"
              className="nosidebarorange"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3nG27t-A8I1iMKjPChXAq0Z2fpeg-v9So8BZBFHNNtGPDWPO3naQ9RXG-BWQkvYQ3us&usqp=CAU"
            /> */}
          </Link>
        </li>
        <li
          className=""
          onClick={() => onMenuToggle(true, "1")}
          id="fileExplorerCom-menuToggleTrue1-li"
        >
          <Link id="fileExplorerCom-workFlow-link BodyColor" to="#">
            {/* <Icon icon="octicon:workflow-24" /> */}
            <WorkFlow className="svg-stroke iconStrokehover iconSvgStrokeColor" />

            {/* <img
              id="wfor"
              className="nosidebarorange"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3nG27t-A8I1iMKjPChXAq0Z2fpeg-v9So8BZBFHNNtGPDWPO3naQ9RXG-BWQkvYQ3us&usqp=CAU"
            /> */}
          </Link>
        </li>
        <li
          className=""
          onClick={() => onMenuToggle(true, "2")}
          id="fileExplorerCom-menuToggleTrue2-li BodyColor"
        >
          <Link id="fileExplorerCom-businessRule-link BodyColor" to="#">
            <BusinessRule className="svg-stroke iconStrokehover iconSvgStrokeColor" />

            {/* <img
              id="bror"
              className="nosidebarorange"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3nG27t-A8I1iMKjPChXAq0Z2fpeg-v9So8BZBFHNNtGPDWPO3naQ9RXG-BWQkvYQ3us&usqp=CAU"
            /> */}
          </Link>
        </li>
        <li
          className=""
          onClick={() => onMenuToggle(true, "3")}
          id="fileExplorerCom-menuToggleTrue3-li"
        >
          <Link id="fileExplorerCom-dataModeler-link" to="#">
            <DataModeler className="svg-fill iconFillhover iconSvgFillColor" />

            {/* <img
              id="dmnor"
              className="nosidebarorange"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3nG27t-A8I1iMKjPChXAq0Z2fpeg-v9So8BZBFHNNtGPDWPO3naQ9RXG-BWQkvYQ3us&usqp=CAU"
            /> */}
          </Link>
        </li>
        <li
          className=""
          onClick={() => onMenuToggle(true, "4")}
          id="fileExplorerCom-menuToggleTrue3-li"
        >
          <Link id="fileExplorerCom-dataModeler-link" to="#">
            <HomePage className="svg-fill iconFillhover iconSvgFillColor" />

            {/* <img
              id="dmnor"
              className="nosidebarorange"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH3nG27t-A8I1iMKjPChXAq0Z2fpeg-v9So8BZBFHNNtGPDWPO3naQ9RXG-BWQkvYQ3us&usqp=CAU"
            /> */}
          </Link>
        </li>
      </ul>
      <div
        className={cx("main-open-sidebar BodyColor", {
          showSidebar: sidebarToggle,
        })}
      >
        <Link
        to="#"
          className="menu-icon-right"
          id="fileExplorerCom-menuToggleFalse-link"
          onClick={() => onMenuToggle(false, "")}
        >
          <span
            className="ellipsis secondaryColor"
            data-tip
            data-for={idDisplayName}
          >
            {localStorage.getItem("displayName")}
          </span>
          <Icon icon="ic:sharp-keyboard-double-arrow-left" />
        </Link>
        <ReactTooltip
          id={idDisplayName}
          place="bottom"
          effect="solid"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          // effect="float"
        >
          {localStorage.getItem("displayName")}
        </ReactTooltip>
        <div className="search">
          <Link id="fileExplorerCom-iconSearch-link" to="#">
            <Icon icon="akar-icons:search" />
          </Link>
          <input
            type="search"
            placeholder={t("search")}
            // style={{ borderRadius: "10px" }}
            onChange={(e) => setSearchValue(e.target.value)}
            id="fileExplorerCom-search-input"
          />
        </div>

        <Accordion
          defaultActiveKey="0"
          className="open-sidebar AppDesignerRightSideAccordion BodyColor"
          activeKey={openAccordian}
          id="fileExplorerCom-openAccordian-Accordion"
        >
          <Accordion.Item
            eventKey="0"
            className="AppDesignerRightSideAccordionItem BodyColor"
            id="fileExplorerCom-changeActiveKey0-accordionItem"
            onClick={() => changeActiveKey("0")}
          >
            <Accordion.Header className="AppDesignerRightSideAccordionHeader BodyApp">
              <Icon icon="jam:screen" className="assetExplorerIcon" />
              <span className="secondaryColor">{t("Form Builder")}</span>
              <b>
                <Icon
                  icon="bxs:down-arrow"
                  className="leftsidebar-down-arrow"
                  style={{ color: "#0D3C84" }}
                />
              </b>
            </Accordion.Header>
            <span className="AppDesignerRightSideAccordionBodyContainer BodyColor customScrollBar secondaryColor">
              {sidebarData?.form
                ?.filter((e) =>
                  e.resourceName
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")
                    .includes(searchValue.toLowerCase())
                )
                ?.map((item, index) => {
                  let tempIdName = item.resourceName.replace(/\.[^/.]+$/, "");
                  let idName = item.resourceName.replace(/ |\.[^/.]+$/g, "-");
                  return (
                    <Accordion.Body
                      key={idName}
                      className="AppDesignerRightSideAccordionBody"
                    >
                      <ul>
                        <li className="import-link">
                          <Link
                          to="#"
                            onClick={(e) => openFileInNewTab(e, item, "formor")}
                            data-tip
                            data-for={idName}
                            id="fileExplorerCom-formBuilder-link"
                          >
                            <ReactTooltip
                              className="tooltipCustom"
                              id={idName}
                              place="bottom"
                              effect="solid"
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </ReactTooltip>
                            <Icon
                              icon="jam:screen"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#0d3c84" }
                              }
                            />
                            <span
                              className="openSidebarAccordResourceName secondaryColor"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#3C3C3C" }
                              }
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </span>
                          </Link>
                          {item.lockStatus ? (
                            <div data-tip data-for="lock-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:lock-alt"
                                id="fileExplorerCom-unlockformBuilder-icon"
                                onClick={() => renderUnlock(item)}
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="lock-icon"
                                place="left"
                                effect="solid"
                              >
                                {item.lockOwner ===
                                localStorage.getItem("username")
                                  ? "Locked"
                                  : `Locked by ${item.lockOwner}`}
                              </ReactTooltip>
                            </div>
                          ) : (
                            <div data-tip data-for="edit-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:message-square-edit"
                                onClick={() => renderLock(item)}
                                id="fileExplorerCom-lockformBuilder-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="edit-icon"
                                place="left"
                                effect="solid"
                              >
                                Unlock
                              </ReactTooltip>
                            </div>
                          )}

                          {/* <Link className="green-check" >
                          <Icon icon="mdi:check-decagram-outline" />
                        </Link> */}
                        </li>
                      </ul>
                    </Accordion.Body>
                  );
                })}
            </span>
          </Accordion.Item>
          <Accordion.Item
            eventKey="1"
            className="AppDesignerRightSideAccordionItem "
            id="fileExplorerCom-changeActiveKe1-accordionItem"
            onClick={() => changeActiveKey("1")}
          >
            <Accordion.Header className="AppDesignerRightSideAccordionHeader BodyColor">
              <Icon icon="octicon:workflow-24" />
              <span className="secondaryColor">{t("Work Flow")}</span>
              <b>
                <Icon
                  icon="bxs:down-arrow"
                  className="leftsidebar-down-arrow"
                />
              </b>
            </Accordion.Header>
            <span className="AppDesignerRightSideAccordionBodyContainer customScrollBar BodyColor secondaryColor">
              {sidebarData?.bpmn
                ?.filter((e) =>
                  e.resourceName
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")
                    .includes(searchValue.toLowerCase())
                )
                ?.map((item, index) => {
                  let tempIdName = item.resourceName.replace(/\.[^/.]+$/, "");
                  let idName = item.resourceName.replace(/ |\.[^/.]+$/g, "-");
                  return (
                    <Accordion.Body
                      key={idName}
                      className="AppDesignerRightSideAccordionBody BodyColor"
                    >
                      <ul>
                        <li className="import-link BodyColor">
                          <Link
                          to="#"
                            onClick={(e) => openFileInNewTab(e, item, "wfor")}
                            data-tip
                            data-for={idName}
                            id="fileExplorerCom-workflow-link"
                          >
                            <ReactTooltip
                              className="tooltipCustom"
                              id={idName}
                              place="bottom"
                              effect="solid"
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </ReactTooltip>
                            <Icon
                              icon="octicon:workflow-24"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#0d3c84" }
                              }
                            />
                            <span
                              className="openSidebarAccordResourceName secondaryColor"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#3C3C3C" }
                              }
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </span>
                          </Link>
                          {item.lockStatus ? (
                            <div data-tip data-for="lock-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:lock-alt"
                                onClick={() => renderUnlock(item)}
                                id="fileExplorerCom-unlockWorkflow-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="lock-icon"
                                place="left"
                                effect="solid"
                              >
                                {item.lockOwner ===
                                localStorage.getItem("username")
                                  ? "Locked"
                                  : `Locked by ${item.lockOwner}`}
                              </ReactTooltip>
                            </div>
                          ) : (
                            <div data-tip data-for="edit-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:message-square-edit"
                                onClick={() => renderLock(item)}
                                id="fileExplorerCom-lockWorkflow-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="edit-icon"
                                place="left"
                                effect="solid"
                              >
                                Unlock
                              </ReactTooltip>
                            </div>
                          )}
                        </li>
                      </ul>
                    </Accordion.Body>
                  );
                })}
            </span>
          </Accordion.Item>
          <Accordion.Item
            eventKey="2"
            className="AppDesignerRightSideAccordionItem "
            id="fileExplorerCom-changeActiveKey2-accordionItem"
            onClick={() => changeActiveKey("2")}
          >
            <Accordion.Header className="AppDesignerRightSideAccordionHeader BodyColor">
              <Icon icon="carbon:flow-data" />
              <span className="secondaryColor">{t("Business Rules")}</span>
              <b>
                <Icon
                  icon="bxs:down-arrow"
                  className="leftsidebar-down-arrow"
                />
              </b>
            </Accordion.Header>
            <span className="AppDesignerRightSideAccordionBodyContainer customScrollBar BodyColor secondaryColor">
              {sidebarData?.dmn
                ?.filter((e) =>
                  e.resourceName
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")
                    .includes(searchValue.toLowerCase())
                )
                ?.map((item, index) => {
                  let tempIdName = item.resourceName.replace(/\.[^/.]+$/, "");
                  let idName = item.resourceName.replace(/ |\.[^/.]+$/g, "-");
                  return (
                    <Accordion.Body
                      key={idName}
                      className="AppDesignerRightSideAccordionBody"
                    >
                      <ul>
                        <li className="import-link BodyColor">
                          <Link
                            to="#"
                            onClick={(e) => openFileInNewTab(e, item, "bror")}
                            data-tip
                            data-for={idName}
                            id="fileExplorerCom-businessRule-link"
                          >
                            <ReactTooltip
                              className="tooltipCustom"
                              id={idName}
                              place="bottom"
                              effect="solid"
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </ReactTooltip>
                            <Icon
                              icon="carbon:flow-data"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#0d3c84" }
                              }
                            />
                            <span
                              className="openSidebarAccordResourceName secondaryColor"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#3C3C3C" }
                              }
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </span>
                          </Link>
                          {item.lockStatus ? (
                            <div data-tip data-for="lock-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:lock-alt"
                                onClick={() => renderUnlock(item)}
                                id="fileExplorerCom-unlockBusinessRule-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="lock-icon"
                                place="left"
                                effect="solid"
                              >
                                {item.lockOwner ===
                                localStorage.getItem("username")
                                  ? "Locked"
                                  : `Locked by ${item.lockOwner}`}
                              </ReactTooltip>
                            </div>
                          ) : (
                            <div data-tip data-for="edit-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:message-square-edit"
                                onClick={() => renderLock(item)}
                                id="fileExplorerCom-lockBusinessRule-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="edit-icon"
                                place="left"
                                effect="solid"
                              >
                                Unlock
                              </ReactTooltip>
                            </div>
                          )}
                        </li>
                      </ul>
                    </Accordion.Body>
                  );
                })}
            </span>
          </Accordion.Item>
          <Accordion.Item
            eventKey="3"
            className="AppDesignerRightSideAccordionItem "
            id="fileExplorerCom-changeActiveKey3-accordionItem"
            onClick={() => changeActiveKey("3")}
          >
            <Accordion.Header className="AppDesignerRightSideAccordionHeader BodyColor">
              <Icon icon="bx:bx-data" />
              <span className="secondaryColor">{t("Data Model")}</span>
              <b>
                <Icon
                  icon="bxs:down-arrow"
                  className="leftsidebar-down-arrow"
                />
              </b>
            </Accordion.Header>
            <span className="AppDesignerRightSideAccordionBodyContainer customScrollBar BodyColor secondaryColor">
              {sidebarData?.datamodel
                ?.filter((e) =>
                  e.resourceName
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")
                    .includes(searchValue.toLowerCase())
                )
                ?.map((item, index) => {
                  let tempIdName = item.resourceName.replace(/\.[^/.]+$/, "");
                  let idName = item.resourceName.replace(/ |\.[^/.]+$/g, "-");
                  return (
                    <Accordion.Body
                      key={idName}
                      className="AppDesignerRightSideAccordionBody"
                    >
                      <ul>
                        <li className="import-link BodyColor">
                          <Link
                            to="#"
                            onClick={(e) => openFileInNewTab(e, item, "dmnor")}
                            data-tip
                            data-for={idName}
                            id="fileExplorerCom-dataModel-link"
                          >
                            <ReactTooltip
                              className="tooltipCustom"
                              id={idName}
                              place="bottom"
                              effect="solid"
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </ReactTooltip>
                            <Icon
                              icon="bx:bx-data"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#0d3c84" }
                              }
                            />

                            <span
                              className="openSidebarAccordResourceName secondaryColor"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#3C3C3C" }
                              }
                            >
                              {item.resourceName.replace(/\.[^/.]+$/, "")}
                            </span>
                          </Link>
                          {item.lockStatus ? (
                            <div data-tip data-for="lock-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:lock-alt"
                                onClick={() => renderUnlock(item)}
                                id="fileExplorerCom-unlockdataModel-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="lock-icon"
                                place="left"
                                effect="solid"
                              >
                                {item.lockOwner ===
                                localStorage.getItem("username")
                                  ? "Locked"
                                  : `Locked by ${item.lockOwner}`}
                              </ReactTooltip>
                            </div>
                          ) : (
                            <div data-tip data-for="edit-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:message-square-edit"
                                onClick={() => renderLock(item)}
                                id="fileExplorerCom-lockdataModel-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="edit-icon"
                                place="left"
                                effect="solid"
                              >
                                Unlock
                              </ReactTooltip>
                            </div>
                          )}
                        </li>
                      </ul>
                    </Accordion.Body>
                  );
                })}
            </span>
          </Accordion.Item>
          <Accordion.Item
            eventKey="4"
            className="AppDesignerRightSideAccordionItem "
            id="fileExplorerCom-changeActiveKey4-accordionItem"
            onClick={() => changeActiveKey("4")}
          >
            <Accordion.Header className="AppDesignerRightSideAccordionHeader BodyColor">
              <HomePage className="svg-fill" />
              <span className="secondaryColor">{t("Home Page")}</span>
              <b>
                <Icon
                  icon="bxs:down-arrow"
                  className="leftsidebar-down-arrow"
                />
              </b>
            </Accordion.Header>
            <span className="AppDesignerRightSideAccordionBodyContainer customScrollBar BodyColor secondaryColor">
              {sidebarData?.page
                ?.filter((e) =>
                  e.resourceName
                    .toLowerCase()
                    .replace(/\.[^/.]+$/, "")
                    .includes(searchValue.toLowerCase())
                )
                ?.map((item, index) => {
                  let tempIdName = item.resourceName.replace(/\.[^/.]+$/, "");
                  let idName = item.resourceName.replace(/ |\.[^/.]+$/g, "-");
                  return (
                    <Accordion.Body
                      key={idName}
                      className="AppDesignerRightSideAccordionBody"
                    >
                      <ul>
                        <li className="import-link BodyColor">
                          <Link
                          to="#"
                            onClick={(e) => openFileInNewTab(e, item, "dmnor")}
                            data-tip
                            data-for={idName}
                            id="fileExplorerCom-homePage-link"
                          >
                            <ReactTooltip
                              className="tooltipCustom"
                              id={idName}
                              place="bottom"
                              effect="solid"
                            >
                              {tempIdName}
                            </ReactTooltip>
                            {/* <img
                              src={HomePage}
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#0d3c84" }
                              }
                            /> */}
                            <HomePage className="svg-fill iconSvgFillColor" />

                            <span
                              className="openSidebarAccordResourceName secondaryColor"
                              style={
                                item.lockStatus == true
                                  ? { color: "#8A8A8A" }
                                  : { color: "#3C3C3C" }
                              }
                            >
                              {tempIdName}
                            </span>
                          </Link>
                          {item.lockStatus ? (
                            <div data-tip data-for="lock-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:lock-alt"
                                onClick={() => renderUnlock(item)}
                                id="fileExplorerCom-unlockHomePage-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="lock-icon"
                                place="left"
                                effect="solid"
                              >
                                {item.lockOwner ===
                                localStorage.getItem("username")
                                  ? "Locked"
                                  : `Locked by ${item.lockOwner}`}
                              </ReactTooltip>
                            </div>
                          ) : (
                            <div data-tip data-for="edit-icon">
                              <Icon
                                className="edit-icon"
                                icon="bx:message-square-edit"
                                onClick={() => renderLock(item)}
                                id="fileExplorerCom-lockHomePage-icon"
                              />
                              <ReactTooltip
                                className="tooltipCustom"
                                id="edit-icon"
                                place="left"
                                effect="solid"
                              >
                                Unlock
                              </ReactTooltip>
                            </div>
                          )}
                        </li>
                      </ul>
                    </Accordion.Body>
                  );
                })}
            </span>
          </Accordion.Item>
        </Accordion>
        {/* <div className="asset-btn">
          <Link  className="btn btn-blue">
            {" "}
            <Icon icon="bx:import" /> Import Asset
          </Link>
          <Link  className="btn btn-blue">
            <Icon icon="fluent:add-12-filled" /> Add Asset
          </Link>
        </div> */}
        {/* <Link  className="main-sidebar-logo">
          <span>
            <img alt="#" src={IntelliflowLogo} />
          </span>
          <i>V1.1.2</i>
        </Link> */}
      </div>
    </>
  );
};
export default FileExploerCom;
