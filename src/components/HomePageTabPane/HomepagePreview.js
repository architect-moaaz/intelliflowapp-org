import React, { useState, useEffect, useRef } from "react";
import { Modal } from "react-responsive-modal";
import QRCode from "react-qr-code";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { ReactComponent as Dashboard } from "../../assets/images/Dashboard.svg";
import { useTranslation } from "react-i18next";
import {
  rightArrow,
  // Dashboard,
  recentPendingIco,
  recentCompleteIco,
} from "../../assets";
import Table from "../DataTable/Table";
import "bootstrap/dist/css/bootstrap.css";
import "./HomepagePreview.css";

export default function HomepagePreview({
  previewModel,
  closePreviewModel,
  formPreviewData,
  formProp
}) {
  const [t, i18n] = useTranslation("common");
  const ItemPlacer = ({ i, x, y, h, w, children }) => {
    return (
      <div
        className="form-group"
        key={i}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: `${(x / 12) * 100}%`,
          top: `${(y / 10) * 100}%`,
          height: `${(h / 10) * 100}%`,
          width: `${(w / 12) * 100}%`,
          textAlign: "center",
          padding: "10px",
        }}
      >
        {children}
      </div>
    );
  };
  const homePreviewProp = formProp
  console.log("homePreviewProp", homePreviewProp);
  const [generateBackgroundImage, setGenerateBackgroundImage] = useState();

  const fetchImage = async () => {
    const url = `${process.env.REACT_APP_CDS_ENDPOINT}appLogo/image/${
      homePreviewProp?.backgroundImage
    }?Authorization=${localStorage.getItem(
      "token"
    )}&workspace=${localStorage.getItem("workspace")}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }

      const imageBlob = await response.blob();

      const imageFile = new File([imageBlob], "image.jpg", {
        type: "image/jpg",
      });

      setGenerateBackgroundImage(imageFile);
    } catch (error) {
      console.error(error);
      setGenerateBackgroundImage(null);
    }
  };

  useEffect(() => {
    if (homePreviewProp?.backgroundImage?.length > 0) {
      fetchImage();
    }
  }, [homePreviewProp]);

  const homepagePreviewStyle = {
    display: "flex",
    // marginHorizontal: "20px",
    marginLeft: "20px",
    marginRight: "20px",
    marginTop: "20px",
    paddingVertical: "80px",
    position: "relative",
    height: "calc(100vh - 9vh)",
    overflow: "auto",
    fontFamily:  `${homePreviewProp?.fontFamily}`,  
  } 
  if (homePreviewProp?.backgroundColor?.length > 0) {
    homepagePreviewStyle.backgroundColor = homePreviewProp?.backgroundColor;
  }
  else if (
    homePreviewProp?.backgroundImage?.length > 0 &&
    generateBackgroundImage
  )
  {
    homepagePreviewStyle.backgroundImage = `url(${URL.createObjectURL(
      generateBackgroundImage
    )})`;
    homepagePreviewStyle.backgroundRepeat = "no-repeat";
    homepagePreviewStyle.backgroundSize = "cover ";
}

  
  const RenderLabel = ({ item }) => (
    <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
      <p className="secondaryColor">{parse(item.fieldName ?? "Label")}</p>
    </ItemPlacer>
  );

  const RenderTimer = ({ item }) => {
    const countDownDate = new Date(item?.date ?? new Date()).getTime();

    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [end, setEnd] = useState(null);

    useEffect(() => {
      const myfunc = setInterval(function () {
        var now = new Date().getTime();
        var timeleft = countDownDate - now;

        if (timeleft) {
          setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
          setHours(
            Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          );
          setMinutes(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
          setSeconds(Math.floor((timeleft % (1000 * 60)) / 1000));

          if (timeleft < 0) {
            setDays(0);
            setHours(0);
            setMinutes(0);
            setSeconds(0);
            setEnd("Time UP!!");
            clearInterval(myfunc);
          }
        }
      }, 1000);

      return () => clearInterval(myfunc);
    }, []);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        {item.fieldName && <p> {parse(item.fieldName)}</p>}
        {end ?? `${days}d ${hours}h ${minutes}m ${seconds}s`}
      </ItemPlacer>
    );
  };

  const RenderMedia = ({ item }) => {
    const renderMedia = () => {
      const mediaType = getMediaType();

      switch (mediaType) {
        case "image":
          return (
            <img
              style={{ padding: "5px", height: "100%", width: "100%" }}
              alt="uploaded"
              src={
                item.mediaUploaded
                  ? process.env.REACT_APP_CDS_ENDPOINT +
                    item.mediaUrl +
                    `?Authorization=${localStorage.getItem(
                      "token"
                    )}&workspace=${localStorage.getItem("workspace")}`
                  : URL.createObjectURL(item?.mediaUrl)
              }
            />
          );

        case "audio":
          return (
            <div>
              <audio
                src={
                  item.mediaUploaded
                    ? process.env.REACT_APP_CDS_ENDPOINT +
                      item.mediaUrl +
                      `?Authorization=${localStorage.getItem(
                        "token"
                      )}&workspace=${localStorage.getItem("workspace")}`
                    : URL.createObjectURL(item?.mediaUrl)
                }
                controls
                autoPlay={item.autoPlay}
              />
            </div>
          );

        case "video":
          return (
            <video width="100%" height="100%" controls autoPlay={item.autoPlay}>
              <source
                src={
                  item.mediaUploaded
                    ? process.env.REACT_APP_CDS_ENDPOINT +
                      item.mediaUrl +
                      `?Authorization=${localStorage.getItem(
                        "token"
                      )}&workspace=${localStorage.getItem("workspace")}`
                    : URL.createObjectURL(item?.mediaUrl)
                }
                type={item.mediaType}
              />
            </video>
          );

        default:
          return (
            <h1 className="primaryColor" style={{ alignText: "center" }}>
              Select Media
            </h1>
          );
      }
    };

    const getMediaType = () => {
      if (item.mediaType === "audio/mpeg") return "audio";

      if (item.mediaType === "image/png" || item.mediaType === "image/jpeg")
        return "image";

      if (item.mediaType === "video/mp4") return "video";

      return item.mediaType;
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div style={{ height: "90%", width: "100%" }}>{renderMedia()}</div>
      </ItemPlacer>
    );
  };

  const RenderQRCode = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div>
          <QRCode
            size={156}
            style={{ height: "auto", maxWidth: "75%", width: "75%" }}
            value={item?.fieldName ?? "Hello"}
          />
        </div>
      </ItemPlacer>
    );
  };

  const RenderLocation = ({ item }) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lng);
    const zoom = parseFloat(item.zoomLevel);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        {item.fieldName && <p> {parse(item.fieldName)}</p>}
        <iframe
          title={item.fieldName}
          src={`http://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`}
          height="80%"
          width="80%"
        ></iframe>
      </ItemPlacer>
    );
  };

  const RenderDataGrid = ({ item }) => {
    const [datagridChanges, setdatagridChanges] = useState([]);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          className="customScrollBar"
          style={{ height: "90%", width: "100%", overflow: "auto" }}
        >
          <Table
            dataGridProperties={item.dataGridProperties}
            datagridChanges={datagridChanges}
            setdatagridChanges={setdatagridChanges}
            fieldName={item.fieldName?.replace(/(<([^>]+)>)/gi, "")}
            accessibilityprop={item.accessibility}
            gridColumns={item.dataGridProperties.cols}
          />
        </div>
      </ItemPlacer>
    );
  };

  const RenderLink = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <a>
          <p
            className="secondaryColor"
            style={{
              backgroundColor: "#0D3C84",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {parse(item.fieldName ?? "Please enter a link")}
          </p>
        </a>
      </ItemPlacer>
    );
  };

  const RenderAction = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <Link to="#">
          <p
            className="secondaryColor"
            style={{
              backgroundColor: "#0D3C84",
              color: "white",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            {parse(item.fieldName ?? "Action Name")}
          </p>
        </Link>
      </ItemPlacer>
    );
  };

  const RenderToDo = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div style={{
          border: "2px solid #c4c4c4",
          borderRadius: "10px",
          background: "white",
          padding: "12px"
        }}>
          <h1 className="primaryColor" style={{ alignSelf: "center" }}>
            To Do List
          </h1>
          <ul style={{ overflow: "auto", height: "90%" }}>
            {[1, 2, 3].map((item) => (
              <li className="tod" key={item}>
                <i class="todo-line"></i>
                App - Action required for User
                <Link id="todo-right-arrow" className="open-todo" to="#">
                  <img
                    id="todo-right-arrow-img"
                    alt="Right-Arrow"
                    src={rightArrow}
                  />
                </Link>
                <Link id="todo-close" className="close-todo-homepage" to="#">
                  <img
                    id="todo-close-img"
                    style={{ height: "100%", width: "100%" }}
                    src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
                    alt="close"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </ItemPlacer>
    );
  };

  const RenderAccordion = ({ item }) => {
    const RenderAccordions = ({ acc, index }) => {
      return (
        <Accordion.Item eventKey={index}>
          <Accordion.Header>
            <div style={{ color: "#ff5711" }}>{acc.accordionName}</div>
          </Accordion.Header>
          <Accordion.Body>
            {acc?.items?.map((des) => (
              <p className="secondaryColor">{des.description}</p>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      );
    };

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div>
          <p className="secondaryColor">
            {parse(item.fieldName ?? "Accordion Name")}
          </p>
          <div class="accordion" id="accordionExample">
            <Accordion defaultActiveKey={0} flush>
              {item.accordionProperties[0] &&
                item.accordionProperties.map((item, index) => (
                  <RenderAccordions acc={item} index={index} />
                ))}
            </Accordion>
          </div>
        </div>
      </ItemPlacer>
    );
  };

  const RenderTab = ({ item }) => {
    const [key, setKey] = useState(0);

    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div className="tab-wrapper" style={{
          background: "white"
        }}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(parseInt(k))}
            className="mb-3 "
          >
            {item.tabProperties.map((tab, index) => (
              <Tab
                eventKey={index}
                title={
                  <div
                    style={{
                      padding: "5px",
                      color: index === key ? "#ff5711" : "#0D3C84",
                    }}
                  >
                    {tab.tabName}
                  </div>
                }
              >
                {tab.items.map((des) => (
                  <p className="secondaryColor" id={des.id}>
                    {des.description}
                  </p>
                ))}
              </Tab>
            ))}
          </Tabs>
        </div>
      </ItemPlacer>
    );
  };

  const RenderMenu = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          style={{
            border: "2px solid #c4c4c4",
            padding: ".5rem",
            borderRadius: "10px",
            background: "white",
          }}
        >
          <ul
            style={{
              display: "flex",
              flexDirection: item.isVertical ? "column" : "row",
              alignItems: "center",
              // overflow: "auto",
              height: "100%",
              width: "100%",
              padding: ".5rem",
              margin: "0 0 .5rem 0",
            }}
          >
            <li style={{ marginLeft: "5px" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {/* <img alt="#" className="dashboardSvg mt-1" src={Dashboard} /> */}
                <Dashboard className="svg-stroke iconSvgStrokeColor iconStrokehover" />

                <h6 className="dashboardText ">{t("Dashboard")}</h6>
              </div>
              <div className="sidebarborder" style={{ marginTop: "5px" }}></div>
            </li>
            <li style={{ marginLeft: "5px" }}>
              <h6 className="dashboardText mt-1" style={{ color: "#0D3C84" }}>
                Process 1
              </h6>
              <div className="sidebarborder" style={{ marginTop: "5px" }}></div>
            </li>
            <li style={{ marginLeft: "5px" }}>
              <h6 className="dashboardText mt-1" style={{ color: "#0D3C84" }}>
                Process 2
              </h6>
              <div className="sidebarborder" style={{ marginTop: "5px" }}></div>
            </li>
          </ul>
        </div>
      </ItemPlacer>
    );
  };

  const RenderRecentActivitiesTab = ({ item }) => {
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          className="customScrollBar recent-activity-wrapper"
          style={{
            overflow: "auto",
            height: "100%",
            background: "white"
          }}
        >
          <h3 className="primaryColor">Recent Activities</h3>
          {[1, 2, 3, 4, 5, 6].map((item, index) => {
            let date = new Date();
            let status = index === 0 ? "Pending status" : "Completed";

            return (
              <Link className="btn btn-edit">
                <div key={index} className="card-wrap Grid-View-card-wrap">
                  <div className="card-item recent-activity-item">
                    <img
                      src={
                        status === "Pending status"
                          ? recentPendingIco
                          : recentCompleteIco
                      }
                      alt={
                        status === "Completed"
                          ? recentPendingIco
                          : recentCompleteIco
                      }
                      className="pendingimage"
                    />
                    {/* <div className="card-info"> */}
                    <p className="dateandtimeforrecentaction secondaryColor">
                      {date.toLocaleDateString()}
                    </p>
                    {/* </div> */}
                    <div className="card-name">
                      <p
                        style={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          margin: "0px",
                        }}
                        className="recentActionProcessName secondaryColor"
                      >
                        Application {item}
                      </p>
                    </div>
                    <div className="card-status">
                      <h6 className="primaryColor">{status}</h6>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ItemPlacer>
    );
  };

  const RenderEmbed = ({ item }) => {
    const type = item?.mediaType;
    const src = item?.mediaUrl;
    return (
      <ItemPlacer i={item.i} x={item.x} y={item.y} h={item.h} w={item.w}>
        <div
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <embed type={type} src={src} width="90%" height="90%" />
        </div>
      </ItemPlacer>
    );
  };

  const RenderAllElements = ({ item }) => {
    if (item.elementType === "label") return <RenderLabel item={item} />;
    if (item.elementType === "timer") return <RenderTimer item={item} />;
    if (item.elementType === "media") return <RenderMedia item={item} />;
    if (item.elementType === "qrcode") return <RenderQRCode item={item} />;
    if (item.elementType === "location") return <RenderLocation item={item} />;
    if (item.elementType === "dataGrid") return <RenderDataGrid item={item} />;
    if (item.elementType === "link") return <RenderLink item={item} />;
    if (item.elementType === "action") return <RenderAction item={item} />;
    if (item.elementType === "todo") return <RenderToDo item={item} />;
    if (item.elementType === "accordion")
      return <RenderAccordion item={item} />;
    if (item.elementType === "tab") return <RenderTab item={item} />;
    if (item.elementType === "menu") return <RenderMenu item={item} />;
    if (item.elementType === "recentActivities")
      return <RenderRecentActivitiesTab item={item} />;
    if (item.elementType === "embed") return <RenderEmbed item={item} />;
  };

  // console.log({ formPreviewData });

  return (
    <Modal
      id="custom-form-preview-modal"
      open={previewModel}
      onClose={closePreviewModel}
      classNames={{
        modal: "homepagePreviewCustomModal",
      }}
    >
      <div
        className="customScrollBar"
        style={homepagePreviewStyle}
      >
        
        {formPreviewData.map((item) => (
          <RenderAllElements item={item} />
        ))}
      </div>
    </Modal>
  );
}
