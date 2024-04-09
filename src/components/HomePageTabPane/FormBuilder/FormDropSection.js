import React, { useCallback, useState } from "react";

import { Droppable } from "react-drag-and-drop";

import RGL, { WidthProvider } from "react-grid-layout";

import IcomoonReact from "icomoon-react";

import iconSet from "../../../assets/icons.json";

import "./Form.css";

import AccordionUiMock from "./Accordion/AccordionUiMock";
import ActionUiMock from "./Action/ActionUiMock";
import DataGridUiMock from "./DataGrid/DataGridUiMock";
import EmbedUiMock from "./Embed/EmbedUiMock";
import LabelUiMock from "./Label/LabelUiMock";
import LinkUiMock from "./Link/LinkUiMock";
import LocationUiMock from "./Location/LocationUiMock";
import MediaUiMock from "./Media/MediaUiMock";
import MenuUiMock from "./Menu/MenuUiMock";
import QRCodeUiMock from "./QRCode/QRCodeUiMock";
import RecentActivitiesUiMock from "./RecentActivities/RecentActivitiesUiMock";
import TabUiMock from "./Tab/TabUiMock";
import TimerUiMock from "./Timer/TimerUiMock";
import ToDoUiMock from "./ToDo/ToDoUiMock";

const ReactGridLayout = WidthProvider(RGL);

export default function FormDropSection({
  setElement,
  layout,
  setLayout,
  setShowSection,
  showSection,
  formProp,
}) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);
  const [active, setActive] = useState(null);
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
      case "dataGrid":
        return 4;
      case "qrcode":
        return 2.5;
      case "location":
        return 4;
      case "accordion":
        return 4;
      case "tab":
        return 4;
      case "menu":
        return 4;
      case "link":
        return 4;
      case "action":
        return 4;
      default:
        return 4;
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
      case "media":
        return 1;
      case "accordion":
        return 1;
      case "tab":
        return 2;
      case "todo":
        return 3;
      case "recentActivities":
        return 4;
      case "embed":
        return 1;
      default:
        return 1;
    }
  };

  const formPropertiesHomepageVal = formProp;

  const onDrop = (data) => {
    const temp = JSON.parse(data.element);
    const randomNum = Math.round(Math.random() * 999999999);
    const today = new Date();
    const date = today.toISOString();
    const itemWidth = renderWidth(temp.elementType);
    const itemHeight = renderHeight(temp.elementType);
    const isMenuAvailable = layout?.layout.some(
      (item) => item.elementType === "menu"
    );

    const isrecentActivitiesAvailable = layout?.layout.some(
      (item) => item.elementType === "recentActivities"
    );

    const istodoAvailable = layout?.layout.some(
      (item) => item.elementType === "todo"
    );
    if (
      (temp.elementType !== "menu" || !isMenuAvailable) &&
      (temp.elementType !== "recentActivities" ||
        !isrecentActivitiesAvailable) &&
      (temp.elementType !== "todo" || !istodoAvailable)
    ) {
      const newItem = {
        x: 0,
        y: 0,
        w: itemWidth,
        h: itemHeight,
        i: randomNum,
        elementType: temp.elementType,
        fieldType: "text",
        placeholder: null,
        edit: false,
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
        dataGridProperties: {
          dataModelName: null,
          cols: [],
          filters: [],
        },
        mediaUrl: null,
        mediaType: null,
        workflowName: null,
        lat: null,
        lng: null,
        zoomLevel: null,
        linkUrl: null,
        mediaUploaded: false,
        autoPlay: false,
        accordionProperties: [],
        tabProperties: [],
        actionType: null,
        isVertical: null,
      };

      setLayout({
        layout: [...layout.layout, { ...newItem }],
      });
    }
  };

  const onClick = (element) => {
    const temp = layout.layout.map((item) => {
      if (item.i === element.i) {
        return {
          ...item,
          edit: true,
        };
      } else {
        return {
          ...item,
          edit: false,
        };
      }
    });
    setLayout({ layout: [...temp] });
    setShowSection(true);
    forceUpdate();
    setActive(element.i);
  };

  const deleteItem = (data) => {
    setElement(null);
    const temp = layout.layout.filter((item) => item.i != data?.i);
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

    setLayout({ layout: [...tempLayout] });
  };

  return (
    <Droppable
      types={["element"]}
      onDrop={onDrop}
      className="h-100"
    >
      <ReactGridLayout {...defaultProps} onLayoutChange={onLayoutChange}>
        {layout?.layout.map((item) => {
          switch (item.elementType) {
            case "label":
              return (
                <div
                  id="element-label"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <LabelUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "timer":
              return (
                <div
                  id="element-timer"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <TimerUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "media":
              return (
                <div
                  id="element-media"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <MediaUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "qrcode":
              return (
                <div
                  id="element-qr-code"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <QRCodeUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "location":
              return (
                <div
                  id="element-location"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <LocationUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "dataGrid":
              return (
                <div
                  id="element-data-grid"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <DataGridUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "link":
              return (
                <div
                  id="element-link"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <LinkUiMock deleteItem={() => deleteItem(item)} item={item} />
                </div>
              );
            case "action":
              return (
                <div
                  id="element-action"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <ActionUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "todo":
              return (
                <div
                  id="element-todo"
                  key={item.i}
                  data-grid={item}
                  // onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <ToDoUiMock deleteItem={() => deleteItem(item)} item={item} />
                </div>
              );
            case "accordion":
              return (
                <div
                  id="element-accordion"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <AccordionUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "tab":
              return (
                <div
                  id="element-tab"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <TabUiMock deleteItem={() => deleteItem(item)} item={item} />
                </div>
              );
            case "menu":
              return (
                <div
                  id="element-menu"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <MenuUiMock deleteItem={() => deleteItem(item)} item={item} />
                </div>
              );
            case "recentActivities":
              return (
                <div
                  id="element-recent-activities"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <RecentActivitiesUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            case "embed":
              return (
                <div
                  id="element-embed"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                  className={
                    active == item.i && showSection == true
                      ? "UiMockContainerClick"
                      : "UiMockContainer"
                  }
                >
                  <EmbedUiMock
                    deleteItem={() => deleteItem(item)}
                    item={item}
                  />
                </div>
              );
            default:
              return (
                <div
                  id="default-element"
                  key={item.i}
                  data-grid={item}
                  onClick={() => onClick(item)}
                >
                  <div className="mockElement ">
                    <div>
                      <h1>{item.fieldName ?? "Default"}</h1>
                    </div>
                    <IcomoonReact
                      className="mock-ui-del-icon"
                      iconSet={iconSet}
                      color="#C4C4C4"
                      size={20}
                      icon="DeleteIcon"
                      onClick={() => deleteItem(item)}
                      id="delete-icon-mock"
                    />
                  </div>
                </div>
              );
          }
        })}
      </ReactGridLayout>
    </Droppable>
  );
}
