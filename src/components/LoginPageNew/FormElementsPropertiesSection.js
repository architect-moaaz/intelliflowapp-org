import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import TextBoxProperties from "./TextBox/TextBoxProperties";
import DropdownProperties from "./Dropdown/DropdownProperties";
import RadioButtonProperties from "./RadioButton/RadioButtonProperties";
import NumberProperties from "./Number/NumberProperties";
import FileUploadProperties from "./FileUpload/FileUploadProperties";
import ImageUploadProperties from "./ImageUpload/ImageUploadProperties";
import DateTImeProperties from "./DateTime/DateTImeProperties";
import SectionProperties from "./Section/SectionProperties";
import ListProperties from "./List/ListProperties";
import RatingProperties from "./Rating/RatingProperties";
import CheckboxProperties from "./Checkbox/CheckboxProperties";
import DataGridProperties from "./DataGrid/DataGridProperties";
import ESignatureProperties from "./ESignature/ESignatureProperties";
import LocationProperties from "./Location/LocationProperties";
import LinkProperties from "./Link/LinkProperties";
import QRCodeProperties from "./QRCode/QRCodeProperties";
import LabelProperties from "./Label/LabelProperties";
import MathExpProperties from "./MathExp/MathExpProperties";
import DraggableModalDialog from "./DraggableModalDialog";
import ButtonProperties from "./Button/ButtonProperties";
import IntellisheetProperties from "./Intellisheet/IntellisheetProperties";

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
  const handleSectionClose = () => {
    setShowSection(false);

    const layoutTemp = layout.layout.map((lay) => {
      return {
        ...lay,
        edit: false,
        stack: lay?.stack?.length
          ? lay.stack.map((stack) => {
              return {
                ...stack,
                edit: false,
              };
            })
          : [],
      };
    });

    setLayout({ layout: [...layoutTemp] });
  };

  const placeholderChange = (event, key, inputvalue) => {
    var text;

    if (inputvalue != null) {
      text = inputvalue;
    } else {
      text = event?.target.value;
    }

    const temp = layout.layout.map((item) => {
      if (item.edit) {
        if (item?.stack?.length) {
          const stackTemp = item.stack.filter((stack) => stack.edit === true);
          if (stackTemp?.length) {
            return {
              ...item,
              stack: item.stack?.map((stack) => {
                if (stack.edit) {
                  return {
                    ...stack,
                    [key]: text,
                  };
                }
                return stack;
              }),
            };
          } else {
            return {
              ...item,
              [key]: text,
            };
          }
        } else {
          return {
            ...item,
            [key]: text,
          };
        }
      }
      return item;
    });

    setLayout({ layout: [...temp] });
  };

  if (element) {
    return (
      <div className="FormElementsPropertiesSection">
        <Modal
          show={showModal}
          animation={false}
          onHide={handleClose}
          id="loginformElementPropertiesSection-formElement-modal"
        >
          <Modal.Header className="header-main-nav">
            <Modal.Title id="contained-modal-title-vcenter">
              Form Data
            </Modal.Title>
          </Modal.Header >
          <Modal.Body>
            <pre>{JSON.stringify(layout, undefined, 2)}</pre>
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
          id="loginformElementPropertiesSection-ModalPropertySection-modal"
        >
          {/* <Resizable
            className="modal-resizable"
            defaultSize={{ width: "auto", height: "auto" }}
          > */}
          <Modal.Header className="header-main-nav">
            <Modal.Title id="contained-modal-title-vcenter">
              <h5>
                {element?.elementType} Properties
                <Link
                to="#"
                  id="loginformElementPropertiesSection-properties-link"
                  className="close-box"
                  onClick={handleSectionClose}
                >
                  <Icon icon="eva:close-fill" />
                </Link>
              </h5>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-properties-box customScrollBar">
              {layout?.layout.map((item) => {
                if (item.edit === true) {
                  if (item?.stack?.length) {
                    const isStackEdit = item.stack.filter(
                      (stack) => stack.edit === true
                    );
                    if (isStackEdit?.length) {
                      switch (isStackEdit[0].elementType) {
                        case "label":
                          return (
                            <LabelProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-label-LabelProperties"
                            />
                          );
                        case "text":
                          return (
                            <TextBoxProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-text-TextBoxProperties"
                            />
                          );
                        case "number":
                          return (
                            <NumberProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-number-NumberProperties"
                            />
                          );
                        case "date":
                          return (
                            <DateTImeProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-date-DateTImeProperties"
                            />
                          );
                        case "dropdown":
                          return (
                            <DropdownProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-dropdown-DropdownProperties"
                            />
                          );
                        case "radio":
                          return (
                            <RadioButtonProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-radio-RadioButtonProperties"
                            />
                          );
                        case "rating":
                          return (
                            <RatingProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-rating-RatingProperties"
                            />
                          );
                        case "file":
                          return (
                            <FileUploadProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-file-FileUploadProperties"
                            />
                          );
                        case "checkbox":
                          return (
                            <CheckboxProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-checkbox-CheckboxProperties"
                            />
                          );
                        case "image":
                          return (
                            <ImageUploadProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key, inputvalue) =>
                                placeholderChange(event, key, inputvalue)
                              }
                              id="loginformElementPropertiesSection-image-ImageUploadProperties"
                            />
                          );
                        case "button":
                          return (
                            <ButtonProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-button-ButtonProperties"
                            />
                          );
                        case "intellisheet":
                          return (
                            <IntellisheetProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-intellisheet-IntellisheetProperties"
                            />
                          );
                        case "dataGrid":
                          return (
                            <DataGridProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-dataGrid-DataGridProperties"
                            />
                          );
                        case "esign":
                          return (
                            <ESignatureProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-esign-ESignatureProperties"
                            />
                          );
                        case "link":
                          return (
                            <LinkProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-link-LinkProperties"
                            />
                          );
                        case "qrcode":
                          return (
                            <QRCodeProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-qrcode-QRCodeProperties"
                            />
                          );
                        case "mathexp":
                          return (
                            <MathExpProperties
                              element={isStackEdit[0]}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-mathexp-MathExpProperties"
                            />
                          );
                        // case "section":
                        //   return (
                        //     <SectionProperties
                        //       element={item}
                        //       layout={layout}
                        //       setLayout={setLayout}
                        //       handleShow={handleShow}
                        //       placeholderChange={(event, key) =>
                        //         placeholderChange(event, key)
                        //       }
                        //       id="loginformElementPropertiesSection-section-SectionProperties"
                        //     />
                        //   );
                        // case "location":
                        //   return (
                        //     <LocationProperties
                        //       element={item}
                        //       layout={layout}
                        //       setLayout={setLayout}
                        //       handleShow={handleShow}
                        //       placeholderChange={(event, key) =>
                        //         placeholderChange(event, key)
                        //       }
                        //       id="loginformElementPropertiesSection-location-LocationProperties"
                        //     />
                        //   );

                        default:
                          return <div>Hello</div>;
                      }
                    } else {
                      switch (item.elementType) {
                        case "text":
                          return (
                            <TextBoxProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-text-TextBoxProperties"
                            />
                          );
                        case "dropdown":
                          return (
                            <DropdownProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-dropdown-DropdownProperties"
                            />
                          );
                        case "radio":
                          return (
                            <RadioButtonProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-radio-RadioButtonProperties"
                            />
                          );
                        case "number":
                          return (
                            <NumberProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-number-NumberProperties"
                            />
                          );
                        case "file":
                          return (
                            <FileUploadProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-file-FileUploadProperties"
                            />
                          );
                        case "image":
                          return (
                            <ImageUploadProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key, inputvalue) =>
                                placeholderChange(event, key, inputvalue)
                              }
                              id="loginformElementPropertiesSection-image-ImageUploadProperties"
                            />
                          );
                        case "date":
                          return (
                            <DateTImeProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-date-DateTImeProperties"
                            />
                          );
                        case "section":
                          return (
                            <SectionProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-section-SectionProperties"
                            />
                          );
                          case "list":
                            return (
                              <ListProperties
                                element={item}
                                layout={layout}
                                setLayout={setLayout}
                                handleShow={handleShow}
                                placeholderChange={(event, key) =>
                                  placeholderChange(event, key)
                                }
                                id="loginformElementPropertiesSection-section-SectionProperties"
                              />
                            );
                        
                        case "rating":
                          return (
                            <RatingProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-rating-RatingProperties"
                            />
                          );
                        case "checkbox":
                          return (
                            <CheckboxProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-checkbox-CheckboxProperties"
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
                              id="loginformElementPropertiesSection-dataGrid-DataGridProperties"
                            />
                          );
                        case "esign":
                          return (
                            <ESignatureProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-esign-ESignatureProperties"
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
                              id="loginformElementPropertiesSection-location-LocationProperties"
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
                              id="loginformElementPropertiesSection-link-LinkProperties"
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
                              id="loginformElementPropertiesSection-qrcode-QRCodeProperties"
                            />
                          );
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
                              id="loginformElementPropertiesSection-label-LabelProperties"
                            />
                          );
                        case "mathexp":
                          return (
                            <MathExpProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-mathexp-MathExpProperties"
                            />
                          );
                        case "button":
                          return (
                            <ButtonProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-button-ButtonProperties"
                            />
                          );
                        case "intellisheet":
                          return (
                            <IntellisheetProperties
                              element={item}
                              layout={layout}
                              setLayout={setLayout}
                              handleShow={handleShow}
                              placeholderChange={(event, key) =>
                                placeholderChange(event, key)
                              }
                              id="loginformElementPropertiesSection-intellisheet-IntellisheetProperties"
                            />
                          );
                        default:
                          return <div>Hello</div>;
                      }
                    }
                  } else {
                    switch (item.elementType) {
                      case "text":
                        return (
                          <TextBoxProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-text-TextBoxProperties"
                          />
                        );
                      case "dropdown":
                        return (
                          <DropdownProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-dropdown-DropdownProperties"
                          />
                        );
                      case "radio":
                        return (
                          <RadioButtonProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-radio-RadioButtonProperties"
                          />
                        );
                      case "number":
                        return (
                          <NumberProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-number-NumberProperties"
                          />
                        );
                      case "file":
                        return (
                          <FileUploadProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-file-FileUploadProperties"
                          />
                        );
                      case "image":
                        return (
                          <ImageUploadProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key, inputvalue) =>
                              placeholderChange(event, key, inputvalue)
                            }
                            id="loginformElementPropertiesSection-image-ImageUploadProperties"
                          />
                        );
                      case "date":
                        return (
                          <DateTImeProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-date-DateTImeProperties"
                          />
                        );
                      case "section":
                        return (
                          <SectionProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-section-SectionProperties"
                          />
                        );
                      case "list":
                        return (
                          <ListProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-section-SectionProperties"
                          />
                        );
                      case "rating":
                        return (
                          <RatingProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-rating-RatingProperties"
                          />
                        );
                      case "checkbox":
                        return (
                          <CheckboxProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-checkbox-CheckboxProperties"
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
                            id="loginformElementPropertiesSection-dataGrid-DataGridProperties"
                          />
                        );
                      case "esign":
                        return (
                          <ESignatureProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-esign-ESignatureProperties"
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
                            id="loginformElementPropertiesSection-location-LocationProperties"
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
                            id="loginformElementPropertiesSection-link-LinkProperties"
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
                            id="loginformElementPropertiesSection-qrcode-QRCodeProperties"
                          />
                        );
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
                            id="loginformElementPropertiesSection-label-LabelProperties"
                          />
                        );
                      case "mathexp":
                        return (
                          <MathExpProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-mathexp-MathExpProperties"
                          />
                        );
                      case "button":
                        return (
                          <ButtonProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-button-ButtonProperties"
                          />
                        );
                      case "intellisheet":
                        return (
                          <IntellisheetProperties
                            element={item}
                            layout={layout}
                            setLayout={setLayout}
                            handleShow={handleShow}
                            placeholderChange={(event, key) =>
                              placeholderChange(event, key)
                            }
                            id="loginformElementPropertiesSection-intellisheet-IntellisheetProperties"
                          />
                        );
                      default:
                        return <div>Hello</div>;
                    }
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
