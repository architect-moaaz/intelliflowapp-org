import React, { useCallback, useState } from "react";
import { Droppable } from "react-drag-and-drop";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import ButtonUiMock from "./Button/ButtonUiMock";
import CheckboxUiMock from "./Checkbox/CheckboxUiMock";
import DataGridUiMock from "./DataGrid/DataGridUiMock";
import DateTimeUiMock from "./DateTime/DateTimeUiMock";
import DropDownUiMock from "./Dropdown/DropDownUiMock";
import ESignatureUiMock from "./ESignature/ESignatureUiMock";
import FileUploadUiMock from "./FileUpload/FileUploadUiMock";
import "./Form.css";
import ImageUploadUiMock from "./ImageUpload/ImageUploadUiMock";
import IntellisheetUiMock from "./Intellisheet/IntellisheetUiMock";
import LabelUiMock from "./Label/LabelUiMock";
import LinkUiMock from "./Link/LinkUiMock";
import ListUiMock from "./List/ListUiMock";
import LocationUiMock from "./Location/LocationUiMock";
import MathExpUiMock from "./MathExp/MathExpUiMock";
import NumberUiMock from "./Number/NumberUiMock";
import QRCodeUiMock from "./QRCode/QRCodeUiMock";
import RadioButtonUiMock from "./RadioButton/RadioButtonUiMock";
import RatingUiMock from "./Rating/RatingUiMock";
import SectionUiMock from "./Section/SectionUiMock";
import TextBoxUiMock from "./TextBox/TextBoxUiMock";

const ReactGridLayout = WidthProvider(RGL);
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const FormDropSection = ({
  setElement,
  layout,
  setLayout,
  setShowSection,
  showSection,
  element,
  undoArray,
  setUndoArray,
}) => {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [active, setActive] = useState(null);
  const [isDraggingOverElement, setIsDraggingOverElement] =
    useState("container");

  const defaultProps = {
    isDraggable: true,
    isResizable: true,
    rowHeight: 50,
    preventCollision: true,
    cols: 24,
    compactType: null,
    allowOverlap: false,
  };

  const renderWidth = (type) => {
    switch (type) {
      case "section":
        return 24;
      case "list":
        return 24;
      case "dataGrid":
        return 12;
      case "qrcode":
        return 5;
      case "button":
        return 4;
      case "link":
        return 8;
      case "location":
        return 4;
      case "intellisheet":
        return 10;
      case "esign":
        return 4;
      default:
        return 8;
    }
  };

  const renderHeight = (type) => {
    switch (type) {
      case "dataGrid":
        return 5;
      case "qrcode":
        return 4;
      case "location":
        return 4;
      case "intellisheet":
        return 6;
      case "esign":
        return 4;
      case "list":
        return 1;
      default:
        return 1;
    }
  };

  const onDrop = (data) => {
    if (isDraggingOverElement === "container") {
      const temp = JSON.parse(data.element);
      const randomNum = Math.round(Math.random() * 999999999);
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const date = today.toISOString();
      let newItem = {
        x: 0,
        y: 0,
        w: renderWidth(temp.elementType),
        h: renderHeight(temp.elementType),
        i: randomNum,
        id: randomNum,
        elementType: temp.elementType,
        fieldType: "text",
        placeholder: null,
        required: false,
        isWholeNumber: null,
        isDecimalNumber: null,
        edit: false,
        multiSelect: false,
        VAxis: false,
        minChoices: null,
        maxChoices: null,
        choices: [],
        fieldName: null,
        date: date,
        accessibility: {
          writeUsers: [],
          readUsers: [],
          hideUsers: [],
          writeGroups: [],
          readGroups: [],
          hideGroups: [],
        },
        prefix: null,
        suffix: null,
        ratingType: "star",
        ratingScale: 5,
        rating: null,
        fileType: null,
        minFilesLimit: null,
        maxFilesLimit: null,
        minFileSize: null,
        maxFileSize: null,
        processVariableName: null,
        minLength: null,
        maxLength: null,
        dateRangeStart: date,
        dateRangeEnd: date,
        dataGridProperties: {
          dataModelName: null,
          cols: [],
          filters: [],
        },
        eSignatureProperties: {
          penColor: null,
          width: null,
          height: null,
        },
        isMathExpression: false,
        actionType: null,
        selectedDataModel: null,
        selectedDataField: null,
        bgColor: null,
        toolTip: null,
        useTime: false,
        timeFormat: "hh:mm",
        dateFormat: "dd MMMM yyyy",
        formula: "",
        isDraggable: true,
        useCurrentDate: false,
      };

      if (temp.elementType == "image") {
        newItem.isUrlAvailable = false;
        newItem.imageUrl = null;
        newItem.imageDataTemp = null;
      }

      if (temp.elementType == "file") {
        newItem.allowedFileTypes = [];
      }

      if (temp.elementType == "list") {
        newItem.stack = [];
        newItem.dataGridProperties.cols = null;
        newItem.listTemplate = {};
        newItem.isIncreaseable = true;
      }

      setLayout({
        layout: [...layout.layout, { ...newItem }],
      });
    }
  };

  const onClick = (element, stackId) => {
    let temp = [];
    if (stackId) {
      temp = layout.layout.map((item) => {
        if (item.id === element.id) {
          return {
            ...item,
            edit: true,
            stack: [
              ...item.stack.map((stackElement) => {
                if (stackElement.id === stackId) {
                  return {
                    ...stackElement,
                    edit: true,
                  };
                } else {
                  return { ...stackElement, edit: false };
                }
              }),
            ],
          };
        } else {
          return {
            ...item,
            edit: false,
          };
        }
      });
    } else {
      temp = layout.layout.map((item) => {
        if (item.id === element.id) {
          return {
            ...item,
            edit: true,
          };
        }
        return {
          ...item,
          edit: false,
        };
      });
    }

    setLayout({ layout: [...temp] });
    setShowSection(true);
    setActive(element.i);
  };

  const deleteItem = (data) => {
    setElement(null);
    const temp = layout.layout.filter((item) => item.id != data?.id);
    layout.layout = [...temp];
    setLayout(layout);
  };

  const onLayoutChange = (receivedLayout) => {
    let tempLayout = [];

    receivedLayout.map((RL) => {
      layout.layout.map((PL) => {
        if (RL.i == PL.i) {
          let temp = { ...PL };

          temp.h = RL.h;
          temp.isBounded = RL.isBounded;
          temp.w = RL.w;
          temp.x = RL.x;
          temp.y = RL.y;
          temp.isDraggable = RL.isDraggable;
          temp.isResizable = RL.isResizable;
          temp.maxH = RL.maxH;
          temp.maxW = RL.maxW;
          temp.minH = RL.minH;
          temp.minW = RL.minW;
          temp.moved = RL.moved;
          temp.resizeHandles = RL.resizeHandles;
          temp.static = RL.static;

          tempLayout.push({ ...temp });
        }
      });
    });

    setUndoArray((prev) => {
      return [...prev, [...layout.layout]];
    });
    setLayout({ layout: [...tempLayout] });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Droppable
      types={["element"]}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="h-100"
      id="formDropSection-onDrop-Droppasble"
    >
      <ReactGridLayout
        {...defaultProps}
        id="formDropSection-layoutChange-ReactGridLayout"
        layout={layout}
        onLayoutChange={onLayoutChange}
        // cols={{ lg: 24, md: 24, sm: 24, xs: 24, xxs: 24 }}
        // draggableCancel="true"
      >
        {layout?.layout.map((item) => {
          switch (item.elementType) {
            case "label":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-label"
                >
                  <LabelUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-LabelUiMock"
                  />
                </div>
              );
            case "text":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-text"
                >
                  <TextBoxUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-TextBoxUiMock"
                  />
                </div>
              );
            case "number":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-number"
                >
                  <NumberUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-NumberUiMock"
                  />
                </div>
              );
            case "date":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-date"
                >
                  <DateTimeUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-DateTimeUiMock"
                  />
                </div>
              );
            case "dropdown":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-dropdown"
                >
                  <DropDownUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-DropDownUiMock"
                  />
                </div>
              );
            case "section":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-section"
                >
                  <SectionUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-SectionUiMock"
                    layout={layout}
                    setLayout={setLayout}
                    isDraggingOverElement={isDraggingOverElement}
                    setIsDraggingOverElement={setIsDraggingOverElement}
                    onClick={onClick}
                    renderWidth={renderWidth}
                    renderHeight={renderHeight}
                    forceUpdate={forceUpdate}
                    setElement={setElement}
                  />
                </div>
              );
            case "list":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  // onDoubleClick={() => onClick(item)}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-section"
                >
                  <ListUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-SectionUiMock"
                    layout={layout}
                    setLayout={setLayout}
                    isDraggingOverElement={isDraggingOverElement}
                    setIsDraggingOverElement={setIsDraggingOverElement}
                    onClick={onClick}
                    renderWidth={renderWidth}
                    renderHeight={renderHeight}
                    forceUpdate={forceUpdate}
                    setElement={setElement}
                  />
                </div>
              );
            case "radio":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-radio"
                >
                  <RadioButtonUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-RadioButtonUiMock"
                  />
                </div>
              );
            case "rating":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-rating"
                >
                  <RatingUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    layout={layout}
                    setLayout={setLayout}
                    id="formDropSection-delete-RatingUiMock"
                  />
                </div>
              );
            case "file":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-file"
                >
                  <FileUploadUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    layout={layout}
                    setLayout={setLayout}
                    id="formDropSection-delete-FileUploadUiMock"
                  />
                </div>
              );
            case "checkbox":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-checkbox"
                >
                  <CheckboxUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-CheckboxUiMock"
                  />
                </div>
              );
            case "dataGrid":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-dataGrid"
                >
                  <DataGridUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-DataGridUiMock"
                  />
                </div>
              );
            case "image":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-image"
                >
                  <ImageUploadUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-ImageUploadUiMock"
                  />
                </div>
              );
            case "qrcode":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-qrcode"
                >
                  <QRCodeUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-QRCodeUiMock"
                  />
                </div>
              );
            case "esign":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-esign"
                >
                  <ESignatureUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-ESignatureUiMock"
                  />
                </div>
              );
            case "location":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-location"
                >
                  <LocationUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-LocationUiMock"
                  />
                </div>
              );
            case "link":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-link"
                >
                  <LinkUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-LinkUiMock"
                  />
                </div>
              );
            case "mathexp":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-mathexp"
                >
                  <MathExpUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-MathExpUiMock"
                  />
                </div>
              );
            case "button":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-button"
                >
                  <ButtonUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-ButtonUiMock"
                  />
                </div>
              );
            case "intellisheet":
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                  id="formDropSection-intellisheet"
                >
                  <IntellisheetUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                    id="formDropSection-delete-IntellisheetUiMock"
                  />
                </div>
              );
            default:
              return (
                <div
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  id="formDropSection-default"
                >
                  Hello
                </div>
              );
          }
        })}
      </ReactGridLayout>
    </Droppable>
  );
};

export default FormDropSection;
