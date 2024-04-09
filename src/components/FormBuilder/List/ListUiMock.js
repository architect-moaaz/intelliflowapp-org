import React from "react";
import { Droppable } from "react-drag-and-drop";
import RGL, { WidthProvider } from "react-grid-layout";
import parse from "html-react-parser";
import IcomoonReact from "icomoon-react";

import iconSet from "../../../assets/icons.json";

import TextBoxUiMock from "../TextBox/TextBoxUiMock";
import NumberUiMock from "../Number/NumberUiMock";
import DateTimeUiMock from "../DateTime/DateTimeUiMock";

const ReactGridLayout = WidthProvider(RGL);

const ListUiMock = ({
  item,
  deleteItem,
  layout,
  setLayout,
  isDraggingOverElement,
  setIsDraggingOverElement,
  onClick,
  renderWidth,
  renderHeight,
  forceUpdate,
  setElement,
}) => {
  // console.log("item",item)
  const defaultProps = {
    isDraggable: true,
    isResizable: true,
    items: 5,
    rowHeight: 50,
    preventCollision: false,
    cols: 24,
    compactType: null,
  };

  const onListDrop = (data) => {
    const temp = JSON.parse(data.element);

    if (temp.elementType === "section") return;

    const randomNum = Math.round(Math.random() * 999999999);
    const today = new Date();
    const date = today.toISOString();

    const newItem = {
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
      dateFormat: null,
      ratingType: null,
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
    };

    if (temp.elementType == "image") {
      newItem.isUrlAvailable = false;
      newItem.imageUrl = null;
      newItem.imageDataTemp = null;
    }

    if (temp.elementType == "file") {
      newItem.allowedFileTypes = [];
    }

    if (item?.stack?.some((item) => item.x === 0 && item.y === 0)) {
      setLayout({
        layout: layout.layout.map((lay) => {
          if (lay.id === item.id) {
            return {
              ...lay,
              h: lay.h + newItem.h,
              stack: lay?.stack
                .map((stack) => {
                  if (stack.x === 0) {
                    return { y: stack.y++, ...stack };
                  }

                  return stack;
                })
                .concat([newItem]),
            };
          } else {
            return lay;
          }
        }),
      });
    } else {
      const tempStack = item?.stack?.length
        ? [...item?.stack, { ...newItem }]
        : [{ ...newItem }];
      setLayout({
        layout: layout.layout.map((lay) => {
          if (lay.id === item.id) {
            return {
              ...lay,
              h: lay.h + newItem.h,
              stack: [...tempStack],
            };
          } else {
            return lay;
          }
        }),
      });
    }
    forceUpdate();
    setIsDraggingOverElement("container");
  };

  const onSectionDragOver = (e) => {
    e.preventDefault();
    if (isDraggingOverElement === "container")
      setIsDraggingOverElement("section");
  };

  const onSectionDragLeave = (e) => {
    e.preventDefault();
    if (isDraggingOverElement === "section")
      setIsDraggingOverElement("container");
  };

  const onSectionLayoutChange = (newLayout) => {
    // console.log({ newLayout });
  };

  const deleteSectionItem = (e, id, stack) => {
    e.preventDefault();
    setElement(null);

    const tempStack = item?.stack?.filter((stack) => stack.id !== id);
    const tempLayoutData = layout.layout.map((lay) => {
      if (lay.id === item.id) {
        return {
          ...lay,
          stack: [...tempStack],
        };
      } else return lay;
    });

    // setLayout({ layout: [...tempLayoutData] });
    layout.layout = [...tempLayoutData];

    uncheckFromDataModelList(stack.processVariableName.split(".")[3]);
  };

  const uncheckFromDataModelList = (entiityName) => {

    let tempLayout = [...layout.layout];

    tempLayout = tempLayout.map((tempelement, index) => {
      if (tempelement.id == item.id) {
        let listTemplateTemp = tempelement.listTemplate;
        delete listTemplateTemp[`${entiityName}`];
        tempelement.listTemplate = listTemplateTemp;
        if (
          tempelement.dataGridProperties.cols &&
          tempelement.dataGridProperties.cols.length != 0
        ) {
          tempelement.dataGridProperties.cols =
            tempelement.dataGridProperties.cols.map((entity, eindex) => {
              if (entiityName == entity.name) {
                entity.required = false;
                return entity;
              } else {
                return entity;
              }
            });
        }
        return tempelement;
      }
      return {
        tempelement,
      };
    });

    setLayout({ layout: [...tempLayout] });
  };

  return (
    <Droppable
      types={["element"]}
      // onDrop={onListDrop}
      onDragOver={onSectionDragOver}
      onDragLeave={onSectionDragLeave}
    >
      <div
        key={item.id}
        style={{
          background: "#D8D8D8",
          border: "1px solid #E5E5E5",
          "box-sizing": "border-box",
          "border-radius": "5px",
          padding: "5px",
        }}
      >
        <div className="sectionContainer">
          <div onClick={() => onClick(item)}>
            {item.fieldName ? parse(item.fieldName) : "List"}
            <IcomoonReact
              className="mock-ui-del-icon"
              iconSet={iconSet}
              color="#C4C4C4"
              size={20}
              icon="DeleteIcon"
              onClick={() => deleteItem()}
              id="sectionUiMock-delete-IcomoonReact"
            />
          </div>
          <div>
            <ReactGridLayout
              {...defaultProps}
              onLayoutChange={onSectionLayoutChange}
            >
              {item?.stack?.map((stack) => {
                switch (stack.elementType) {
                  case "text":
                    return (
                      <div
                        key={stack.i}
                        data-grid={stack}
                        onClick={() => onClick(item, stack.id)}
                        id="formDropSection-text"
                      >
                        <TextBoxUiMock
                          deleteItem={(e, id) =>
                            deleteSectionItem(e, id, stack)
                          }
                          item={stack}
                          id="formDropSection-delete-TextBoxUiMock"
                        />
                      </div>
                    );
                  case "number":
                    return (
                      <div
                        key={stack.i}
                        data-grid={stack}
                        onClick={() => onClick(item, stack.id)}
                        id="formDropSection-number"
                      >
                        <NumberUiMock
                          deleteItem={(e, id) =>
                            deleteSectionItem(e, id, stack)
                          }
                          item={stack}
                          id="formDropSection-delete-NumberUiMock"
                        />
                      </div>
                    );
                  case "date":
                    return (
                      <div
                        key={stack.i}
                        data-grid={stack}
                        onClick={() => onClick(item, stack.id)}
                        id="formDropSection-date"
                      >
                        <DateTimeUiMock
                          deleteItem={(e, id) =>
                            deleteSectionItem(e, id, stack)
                          }
                          item={stack}
                          id="formDropSection-delete-DateTimeUiMock"
                        />
                      </div>
                    );

                  case "list":
                    return (
                      <div
                        key={item.i}
                        data-grid={item}
                        onClick={() => onClick(stack)}
                        // className={
                        //   active == item.i && showSection == true
                        //     ? "UiMockContainerClick"
                        //     : "UiMockContainer"
                        // }
                        id="formDropSection-section"
                      >
                        <ListUiMock
                          deleteItem={() => deleteItem(item)}
                          item={stack}
                          id="formDropSection-delete-SectionUiMock"
                          layout={layout}
                          setLayout={setLayout}
                          isDraggingOverElement={isDraggingOverElement}
                          setIsDraggingOverElement={setIsDraggingOverElement}
                          onClick={onClick}
                          renderWidth={renderWidth}
                          renderHeight={renderHeight}
                          forceUpdate={forceUpdate}
                        />
                      </div>
                    );

                  default:
                    console.log("default");
                    return (
                      <div
                        key={item.i}
                        data-grid={item}
                        onClick={() => onClick(item)}
                        id="formDropSection-default"
                      >
                        {stack.elementType}
                      </div>
                    );
                }
              })}
            </ReactGridLayout>
          </div>
        </div>
      </div>
    </Droppable>
  );
};

export default ListUiMock;
