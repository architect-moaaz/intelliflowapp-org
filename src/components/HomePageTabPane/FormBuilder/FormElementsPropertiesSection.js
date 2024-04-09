import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

import MediaProperties from "./Media/MediaProperties";
import TimerProperties from "./Timer/TimerProperties";
import DataGridProperties from "./DataGrid/DataGridProperties";
import LocationProperties from "./Location/LocationProperties";
import LinkProperties from "./Link/LinkProperties";
import QRCodeProperties from "./QRCode/QRCodeProperties";
import LabelProperties from "./Label/LabelProperties";
import ActionProperties from "./Action/ActionProperties";
import ToDoProperties from "./ToDo/ToDoProperties";
import DraggableModalDialog from "./DraggableModalDialog";
import AccordionProperties from "./Accordion/AccordionProperties";
import TabProperties from "./Tab/TabProperties";
import MenuProperties from "./Menu/MenuProperties";
import RecentActivitiesProperties from "./RecentActivities/RecentActivitiesProperties";
import EmbedProperties from "./Embed/EmbedProperties";

const FormElementsPropertiesSection = ({
  element,
  layout,
  setLayout,
  showSection,
  setShowSection,
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const handleSectionClose = () => setShowSection(false);

  const placeholderChange = (event, key, inputvalue) => {
    var text;
    if (inputvalue != null) {
      text = inputvalue;
    } else {
      text = event?.target.value;
    }
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          [key]: text,
        };
      }
      return item;
    });
    setLayout({ layout: [...temp] });
  };

  if (element) {
    return (
      <div className="FormElementsPropertiesSection">
        <Modal show={showModal} animation={false} id="form-element-properties-modal" onHide={handleClose}>
          <Modal.Header className="header-main-nav">
            <Modal.Title id="contained-modal-title-vcenter">
              Form Data
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <pre>{JSON.stringify(layout, undefined, 2)}</pre>
            {layout.layout[0].fieldName}
          </Modal.Body>
        </Modal>

        <Modal
          show={showSection}
          animation={false}
          onHide={handleSectionClose}
          className="ModalPropertySection"
          backdrop={true}
          dialogAs={DraggableModalDialog}
          backdropClassName="FormElementsBackdrop"
          id="form-modal-properties-modal"
        >
          {/* <Resizable
            className="modal-resizable"
            defaultSize={{ width: "auto", height: "auto" }}
          > */}
          <Modal.Header className="header-main-nav">
            <Modal.Title id="contained-modal-title-vcenter">
              <h5>
                {element?.elementType} Properties
                <Link to="#" className="close-box" id="closem-modal-link" onClick={handleSectionClose}>
                  <Icon icon="eva:close-fill" />
                </Link>
              </h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-properties-box customScrollBar">
              {layout?.layout.map((item) => {
                if (item.edit === true) {
                  switch (item.elementType) {
                    case "label":
                      return (
                        <LabelProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "timer":
                      return (
                        <TimerProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "media":
                      return (
                        <MediaProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key, inputvalue) =>
                            placeholderChange(event, key, inputvalue)
                          }
                        />
                      );
                    case "qrcode":
                      return (
                        <QRCodeProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "location":
                      return (
                        <LocationProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "dataGrid":
                      return (
                        <DataGridProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "link":
                      return (
                        <LinkProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "action":
                      return (
                        <ActionProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "todo":
                      return (
                        <ToDoProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "accordion":
                      return (
                        <AccordionProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "tab":
                      return (
                        <TabProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "menu":
                      return (
                        <MenuProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "recentActivities":
                      return (
                        <RecentActivitiesProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    case "embed":
                      return (
                        <EmbedProperties
                          element={item}
                          layout={layout}
                          setLayout={setLayout}
                          handleShow={handleShow}
                          placeholderChange={(event, key) =>
                            placeholderChange(event, key)
                          }
                        />
                      );
                    default:
                      return <div>Hello</div>;
                  }
                }
              })}
            </div>
          </Modal.Body>
          {/* </Resizable> */}
        </Modal>
      </div>
    );
  } else {
    return null;
  }
};

export default FormElementsPropertiesSection;
