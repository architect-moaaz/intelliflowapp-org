import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Tab } from "bootstrap";
import { Accordion, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import ErrorScreenContainer from "../ErrorScreen/ErrorScreenContainer";
import FormDropSection from "./FormDropSection";
import FormElementsPropertiesSection from "./FormElementsPropertiesSection";
import axios from "axios";
import { YourLogo, CancelIcon } from "../../assets";
import { ReactComponent as Mobile } from "../../assets/NewIcon/Mobile.svg";
import { ReactComponent as MobileWeb } from "../../assets/NewIcon/Mobile&web.svg";
import { ReactComponent as Web } from "../../assets/NewIcon/web.svg";
import "./FormBuilderTabPane.css";
import { useRecoilValue } from "recoil";
import { formbuilderErrorsState } from "../../state/atom";
import Errors from "../FormBuilderErrors/Errors";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import { Modal } from "react-bootstrap";
import useErrorValue from "../hooks/useErrorValues";
import { ToastContainer, toast } from "react-toastify";

import TextBoxUi from "./TextBox/TextBoxUi";
import NumberUi from "./Number/NumberUi";
import DateTimeUi from "./DateTime/DateTime";
import DropdownUi from "./Dropdown/DropdownUi";
import SectionUi from "./Section/SectionUi";
import LabelUi from "./Label/LabelUi";
import RadioButtonUi from "./RadioButton/RadioButtonUi";
import ButtonUi from "./Button/ButtonUi";
import LinkUi from "./Link/LinkUi";
import ImageUploadUi from "./ImageUpload/ImageUploadUi";
import CheckboxUi from "./Checkbox/CheckboxUi";

const LoginTabPane = ({ element, setElement, layout, setLayout, open }) => {
  const [showSection, setShowSection] = useState(false);
  const [mappedBpmnName, setMappedBpmnName] = useState("");
  const [mappedTaskName, setMappedTaskName] = useState("");
  const [mappedTaskType, setMappedTaskType] = useState("");
  const formbuilderErrors = useRecoilValue(formbuilderErrorsState);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { totalErrorsNumber, totalWarningsNumber } = useErrorValue();
  const [zoomValue, setZoomValue] = useState(100);
  const [mapChanges, setMapChanges] = useState(1);
  const [showMappingDeleteModal, setShowMappingDeleteModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // mapping();
    }, 1000);
  }, [open, mapChanges]);

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
      case "radio":
        return <RadioButtonUi item={item} key={index} />;
      case "checkbox":
        return <CheckboxUi item={item} key={index} />;
      case "image":
        return <ImageUploadUi item={item} key={index} />;
      case "link":
        return <LinkUi item={item} key={index} />;
      case "button":
        return <ButtonUi item={item} key={index} />;

        break;
    }
  };

  const [elements, setElements] = useState(null);
  useEffect(() => {
    var formElementsData = {
      coreElements: [
        {
          id: "959198127",
          elementType: "label",
          placeholder: "",
          required: "true",
        },
        // {
        //   id: "203149589",
        //   elementType: "text",
        //   placeholder: "Place your text here",
        //   required: "true",
        // },
        // {
        //   id: "890726310",
        //   elementType: "number",
        //   placeholder: "Number",
        //   required: "true",
        // },
        // {
        //   id: "623382009",
        //   elementType: "date",
        //   placeholder: "Date & Time",
        //   required: "true",
        // },
        // {
        //   id: "613609421",
        //   elementType: "dropdown",
        //   placeholder: "Drop Down",
        //   required: "true",
        // },
        // {
        //   id: "902965771",
        //   elementType: "section",
        //   placeholder: "Section",
        //   required: "true",
        // },
        // {
        //   id: "902965675",
        //   elementType: "list",
        //   placeholder: "list",
        //   required: "true",
        // },
        // {
        //   id: "533377879",
        //   elementType: "radio",
        //   placeholder: "Radio Button",
        //   required: "true",
        // },
        // {
        //   id: "600374693",
        //   elementType: "rating",
        //   placeholder: "Rating",
        //   required: "true",
        // },
        // {
        //   id: "239526292",
        //   elementType: "file",
        //   placeholder: "File Upload",
        //   required: "true",
        // },
        // {
        //   id: "887177023",
        //   elementType: "checkbox",
        //   placeholder: "Checkbox",
        //   required: "true",
        // },
        {
          id: "309318518",
          elementType: "image",
          placeholder: "Image Upload",
          required: "true",
        },
        // {
        //   id: "3093185939",
        //   elementType: "button",
        //   placeholder: "Button",
        //   required: "true",
        // },
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

  const zoomInPage = () => {
    setZoomValue((zoomValue) => zoomValue + 5);
  };
  const zoomOutPage = () => {
    setZoomValue((zoomValue) => zoomValue - 5);
  };

  console.log("elements", element);
  return (
    <>
      <div className="login-formbuilder-container loginCustom-body-wrap">
        <div className="formbuilder-rightsidebar-container">
          {/* <div className="fileExplorer-main" style={{ width: "13%" }}> */}
          <div className="formbuilder-sidebar BodyColor">
            {/* <div className="formbuilder-search">
              <Link id="form-builder-search-bar">
                <Icon icon="akar-icons:search" />
              </Link>
              <input
                id="form-builder-search-input"
                type="text"
                placeholder="Search"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div> */}
            <Accordion
              className="formbuilder-sidebar-accordion BodyColor customScrollBar"
              defaultActiveKey={["0"]}
              alwaysOpen
            >
              <Accordion.Item className="BodyColor" eventKey="0">
                <Accordion.Header>
                  Elements
                  <Icon
                    icon="ic:sharp-keyboard-double-arrow-down"
                    className="formbuilder-coreUIDropdown"
                    // style={{ marginLeft: "80px" }}
                  />
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="formbuiler-sidebar-wrap">
                    {elements?.coreElements
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
            </Accordion>
          </div>
        </div>
        <div
          className="formbuilder-main-body-wrap bgimage customScrollBar BodyColor"
          // style={{ width: "87%" }}
          style={{
            width: `calc(100% - 180px + ${zoomValue}px)`,
            zoom: `${zoomValue}%`,
          }}
        >
          {/* <MainbodySectionContainer /> */}
          <FormDropSection
            setElement={setElement}
            layout={layout}
            setLayout={setLayout}
            showSection={showSection}
            setShowSection={setShowSection}
            element={element}
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
      {/* </div> */}
      {/* <div className="error-footer-wrap hidden">
        <ErrorScreenContainer isDisplayError={isDisplayError} />
        <ul className="error-footer-links ">
          <li>
            <Link to="" onClick={showErrors}>
              16 Errors
            </Link>
          </li>
          <li>
            <Link to="" onClick={showErrors}>
              8 Warnings
            </Link>
          </li>
        </ul>
      </div> */}
      <div
        className=" appdesigner-asset-footer  BodyColor"
        style={{ backgroundColor: "#fff", width: "100%" }}
      >
        <div className="appdesigner-footer-left col-md-10">
          {/* <div className="row">
            <div
              id="form-builder-footer-error"
              className="formbuilder-footer-error"
              style={{ borderBottom: "1px solid #F5F5F5" }}
              // onClick={onErrorsClick}
            >
              <span>{totalErrorsNumber} Errors</span>
              <span> | </span>
              <span>{totalWarningsNumber} Warnings</span>
            </div>
          </div> */}
          <div className="row">
            <div className="appdesigner-footer-start">
              {/* <div className="formbuilder-footer-status ">
                <div className="mapped">
                  {mappedTaskType == "PT" ? (
                    <Icon icon="bi:link" />
                  ) : (
                    <Icon icon="flat-color-icons:broken-link" />
                  )}
                  {displaymappinginfo()}
                </div>
              </div> */}
              {/* <div
                className="formbuilder-footer-status"
                id="form-buider-footer-status"
              >
                My App uploaded at 18:00
              </div> */}
              <div className="FormBuilder-zoom-view-device zoom-view-device">
                {/* <div className="d-flex justify-content-center mx-2">
                  <div>
                    <Link to="#" className="text-orange">
                    
                      <MobileWeb className="svg-fill" />
                    </Link>
                  </div>
                  <div>
                    <Link to="#" className="text-orange px-2 ">
                     
                      <Mobile className="svg-stroke" />
                    </Link>
                  </div>

                  <div>
                    <Link to="#">
                      
                      <Web className="svg-fill" />
                    </Link>
                  </div>
                </div> */}
                <div className="formbuilder-footer-zoom-view-prop">
                  <div>
                    <Link to="#">
                      <Icon
                        id="form-builder-zoom-minus"
                        height={15}
                        width={15}
                        icon="akar-icons:minus"
                        style={{ color: "#0D3C84" }}
                        onClick={zoomOutPage}
                      />
                    </Link>
                  </div>
                  <div
                    className="formbuilder-footer-zoom-view-status"
                    style={{ fontSize: "12px", textDecoration: "none" }}
                  >
                    <Link
                      id="form-builder-zoom-value"
                      style={{ textDecoration: "none", color: "#0D3C84" }}
                    >
                      {zoomValue}%
                    </Link>
                  </div>
                  <div>
                    <Link id="form-builder-zoom-plus">
                      <Icon
                        id="form-builder-zoom-plus-icon"
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
          </div>
        </div>
        <div className="appdesigner-footer-right-logo">
          {/* <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          > */}
          <img
            id="your-logo-img"
            src={YourLogo}
            className="YourLogoHere"
            crossOrigin="anonymous"
          />
          {/* </div> */}
        </div>
      </div>
    </>
  );
};

export default LoginTabPane;
