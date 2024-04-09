import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import {
  BooleanIcon,
  DataModelIcon,
  DateIcon,
  DatetimeIcon,
  DeleteIco,
  FilterIco,
  FloatIcon,
  IntegerIcon,
  PlusIco,
  StringIco,
  YourLogo,
  downloadCs,
} from "../../assets";
import { ReactComponent as Delete } from "../../assets/NewIcon/Delete.svg";
import { ReactComponent as Duplicate } from "../../assets/NewIcon/Duplicate.svg";
import { ReactComponent as GroupIcon } from "../../assets/NewIcon/GroupIcon.svg";
import { ReactComponent as Mapping } from "../../assets/NewIcon/Mapping.svg";
import { ReactComponent as Overview } from "../../assets/NewIcon/Overview.svg";
import { ReactComponent as Redo } from "../../assets/NewIcon/Redo.svg";
import { ReactComponent as Save } from "../../assets/NewIcon/Save.svg";
import { ReactComponent as SaveAsADraft } from "../../assets/NewIcon/SaveAsADraft.svg";
import { ReactComponent as Undo } from "../../assets/NewIcon/Undo.svg";
import { autoSave, openFilesState } from "../../state/atom";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import GroupIconPopup from "../Popups/GroupIconPopup/GroupIconPopup";
import "./DataModeller.css";
import DataModellerMapping from "./DataModellerMapping";

const DataModeller = ({ data, doGetAllResources, setLayout }) => {
  const [t, i18n] = useTranslation("common");
  const [elements, setElements] = useState(null);
  const [elementsList, setElementsList] = useState(null);
  const [openFiles, setOpenFiles] = useRecoilState(openFilesState);
  const [dropList, setDropList] = useState([]);
  const [element, setElement] = useState("");
  const [type, setType] = useState("");
  const [dropDownSearch, setDropDownSearch] = useState([]);
  const [filtershown, setfiltershown] = useState(false);
  const [open, setOpen] = useState(false);
  const [isGroupPopupOpen, setIsGroupPopupOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataModelerSaveDraft, setDataModelerSaveDraft] = useState(false);
  const [dataModelName, setDataModelName] = useState(null);
  const [isSaving, setIsSaving] = useRecoilState(autoSave);
  const AutosaveFrequency = localStorage.getItem("AutoSaveFrequency");
  const AutoSavefeature =
    localStorage.getItem("AutoSavefeature") == "true" ? true : false;
  const [pageSaved, setPageSaved] = useState(1);
  const [undoArray, setUndoArray] = useState([]);
  const [redoArray, setRedoArray] = useState([]);

  const handleSavedraft = () => {
    // setSave(true)
    setDataModelerSaveDraft(true);
  };

  const openDeleteModal = () => {
    setShowDeleteModal(!showDeleteModal);
  };

  const deleteFile = async () => {
    const id = toast.loading("Deleting Data Model....");
    try {
      const inputJson = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: "datamodel",
      };
      axios
        .delete(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/deleteFile",
          { data: inputJson }
        )
        .then((response) => {
          openDeleteModal();
          doGetAllResources();
          toast.update(id, {
            render: "Deleted Data Model Successfully!",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          const tempFiles = openFiles.filter(
            (item) => item.resourceName !== data.resourceName
          );
          setOpenFiles([...tempFiles]);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    apiGet();

    const json5 = require("json5");
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName,
      fileType: data.resourceType,
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/fetchFile/meta",
        postData
      )
      .then((res) => {
        if (res.data.data != null) {
          var inputDataStr = res.data.data;
          inputDataStr = inputDataStr.replaceAll("=", ":");
          var dataInput = json5.parse(inputDataStr);

          const tempData = dataInput.map((e) => {
            if (e.isCollection == true && e.isPrimitive == true) {
              return {
                id: Math.random(Math.floor(0, 999999)),
                element: e.name,
                type: "List",
                primitive: true,
                collectionType: e.type,
              };
            } else if (e.isCollection == true && e.isPrimitive == false) {
              return {
                id: Math.random(Math.floor(0, 999999)),
                element: e.name,
                type: "List",
                primitive: false,
                collectionType: e.type,
              };
            } else {
              return {
                id: Math.random(Math.floor(0, 999999)),
                element: e.name,
                type: e.type,
                mandatory: e.mandatory,
              };
            }
          });
          setDropList([...tempData]);
        }
      });
  }, []);

  useEffect(() => {
    if (dataModelName != null) {
      var elementData = {
        dataType: [
          {
            label: "Integer",
            options: [
              {
                value: "Integer",
                label: "Integer",
              },
            ],
          },
          {
            label: "Float",
            options: [
              {
                value: "Float",
                label: "Float",
              },
            ],
          },
          {
            label: "Other",
            options: [
              {
                value: "String",
                label: "String",
              },

              {
                value: "Date",
                label: "Date",
              },
              {
                value: "Boolean",
                label: "Boolean",
              },

              {
                value: "DateTime",
                label: "DateTime",
              },
            ],
          },
          {
            label: "Collection",
            options: [
              {
                value: "List",
                label: "List",
              },
            ],
          },
          // {
          //   label: "Data Model",
          //   options: dataModelName?.map((e) => {
          //     return {
          //       value: e.resourceName.replace(/\.[^/.]+$/, ""),
          //       label: e.resourceName.replace(/\.[^/.]+$/, ""),
          //     };
          //   }),
          // },
        ],
      };
      var elementDataList = {
        dataType: [
          {
            label: "Integer",
            options: [
              {
                value: "Integer",
                label: "Integer",
              },
            ],
          },
          {
            label: "Float",
            options: [
              {
                value: "Float",
                label: "Float",
              },
            ],
          },
          {
            label: "Other",
            options: [
              {
                value: "String",
                label: "String",
              },

              {
                value: "Date",
                label: "Date",
              },
              {
                value: "Boolean",
                label: "Boolean",
              },

              {
                value: "DateTime",
                label: "DateTime",
              },
            ],
          },
          {
            label: "Data Model",
            options: dataModelName
              ?.filter(
                (item) =>
                  item.resourceName !== localStorage.getItem("selectedForm")
              )
              .map((e) => {
                return {
                  value: e.resourceName,
                  label: e.resourceName,
                };
              }),
          },
        ],
      };

      setElements(elementData);
      setElementsList(elementDataList);
    }
  }, [dataModelName]);

  const apiGet = () => {
    const data = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
    };
    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/getResources",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        setDataModelName(res.data.data.datamodel);
      })
      .catch((e) => console.log(e));
  };

  const onSave = async (autoSaveData = false) => {
    // const id = toast.loading("Saving Data Model....");
    const dataModelProperties = dropList.map((item) => {
      if (item.type == "List") {
        return {
          name: item.element,
          type: item?.collectionType?.replace(/\.[^/.]+$/, ""),
          primitive: item.isPrimitive,
          collectionType: item.type,
          mandatory: item?.mandatory ? item?.mandatory : false,
          // type: item?.type,
        };
      } else {
        return {
          name: item.element,
          type: item.type,
          mandatory: item?.mandatory ? item?.mandatory : false,
        };
      }
    });
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: data.resourceName.replace(/\.[^/.]+$/, ""),
      fileType: data.resourceType,
      dataModelProperties: dataModelProperties,
    };

    axios
      .post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
        "modellerService/datamodeller/createFile",
        postData,
        { headers: { "Content-Type": "application/json" } }
      )
      .then((response) => {
        if (autoSaveData == false) {
          const id = toast.loading(t("Saving Data Model...."));
          toast.update(id, {
            render: t("Saved Data Model Successfully!"),
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
        }
        const postData = {
          workspaceName: localStorage.getItem("workspace"),
          miniApp: localStorage.getItem("appName"),
          fileName: data.resourceName,
          fileType: data.resourceType,
          userId: localStorage.getItem("username"),
        };
        axios
          .post(
            process.env.REACT_APP_MODELLER_API_ENDPOINT +
            "modellerService/releaseAsset",
            postData
          )
          .then((res) => console.log("then2", res))
          .catch((error) => console.log("error", error));
      })
      .catch((e) => {
        if (autoSaveData == false) {
          const id = toast.loading("Saving Data Model....");
          toast.update(id, {
            render: t("Error Saving Data"),
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        }
      });
  };

  useEffect(() => {
    let autoSaveInterval = null;
    if (AutoSavefeature) {
      autoSaveInterval = setInterval(() => {
        renderOnSave();
      }, (AutosaveFrequency ? AutosaveFrequency : 10) * 1000);

      return () => clearInterval(autoSaveInterval);
    } else {
      if (autoSaveInterval) clearInterval(autoSaveInterval);
    }
  }, [AutoSavefeature, pageSaved]);

  useEffect(() => {
    setPageSaved(pageSaved + 1);
  }, [dropList]);

  const renderOnSave = () => {
    setPageSaved((prev) => prev + 1);
    onSave(true);
  };

  // function useInterval(callback, delay) {
  //   const savedCallback = useRef();

  //   useEffect(() => {
  //     savedCallback.current = callback;
  //   }, [callback]);

  //   useEffect(() => {
  //     function tick() {
  //       savedCallback.current();
  //     }

  //     let id = setInterval(tick, delay);
  //     return () => clearInterval(id);
  //   }, [delay]);
  // }
  // useInterval(function () {
  //   onSave(true);
  // }, 10000);

  const convertStringToByteArray = (str) => {
    String.prototype.encodeHex = function () {
      var bytes = [];
      for (var i = 0; i < this.length; ++i) {
        bytes.push(this.charCodeAt(i));
      }
      return bytes;
    };

    var byteArray = str.encodeHex();
    return byteArray;
  };

  const onSaveasDraft = async () => {
    try {
      const id = toast.loading("Saving Data Model Draft....");
      const dataModelProperties = dropList.map((item) => {
        return {
          name: item.element,
          type: item.type,
        };
      });
      const tempStr = dataModelProperties.toString();
      var byteData = convertStringToByteArray(tempStr);
      const postData = {
        workspaceName: localStorage.getItem("workspace"),
        miniAppName: localStorage.getItem("appName"),
        fileName: data.resourceName,
        fileType: data.resourceType,
        comment: "Process to Launch SpaceX rocket",
        fileContent: byteData,
      };
      axios
        .post(
          process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/saveAsDraft",
          postData,
          { headers: { "Content-Type": "application/json" } }
        )
        .then((res) => {
          toast.update(id, {
            render: "Saved Data Model Successfully as Draft!",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "success",
            isLoading: false,
          });
          const postData = {
            workspaceName: localStorage.getItem("workspace"),
            miniApp: localStorage.getItem("appName"),
            fileName: data.resourceName,
            fileType: data.resourceType,
            userId: localStorage.getItem("username"),
          };
          axios
            .post(
              process.env.REACT_APP_MODELLER_API_ENDPOINT +
              "modellerService/releaseAsset",
              postData
            )
            .then((res) => {
              setDataModelerSaveDraft(false);
            });
        })
        .catch((e) => {
          toast.update(id, {
            render: "Error Saving Data",
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            type: "error",
            isLoading: false,
          });
        });
    } catch (e) {
      console.log("this is catch error", { e });
    }
  };

  const onElementChange = (event) => {
    setElement(event.target.value);
  };

  const onTypeChange = (data) => {
    setType(data.value);
  };

  const onClick = (e) => {
    e.preventDefault();
    const newValue = element.split(" ").join("_");
    const id = Math.round(Math.random() * 299);

    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });

    setDropList([
      ...dropList,
      { id: id, element: newValue, type: type, mandatory: false },
    ]);

    setElement("");
  };

  const updateValue = (e, id) => {
    const newState = dropList.map((obj) => {
      if (obj.id === id) {
        if (e.value == "List") {
          return {
            ...obj,
            type: e.value.replace(/\.[^/.]+$/, ""),
            isCollection: true,
          };
        } else {
          return {
            ...obj,
            type: e.value.replace(/\.[^/.]+$/, ""),
            isCollection: false,
            isPrimitive: true,
          };
        }
      }
      return obj;
    });

    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });

    setDropList(newState);
  };

  const mandatoryValue = (e, id) => {
    const newState = dropList.map((obj) => {
      if (obj.id === id) {
        if (e.value == "List") {
          return {
            ...obj,
            mandatory: !obj.mandatory,
            isCollection: true,
          };
        } else {
          return {
            ...obj,
            mandatory: !obj.mandatory,
            isCollection: false,
            isPrimitive: true,
          };
        }
      }
      return obj;
    });
    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });
    setDropList([...newState]);
    setLayout({ layout: [...newState] });
  };

  const updateValueList = (e, id) => {
    const newStateList = dropList.map((obj) => {
      if (obj.id === id) {
        if (e.value.includes(".java")) {
          return {
            ...obj,
            collectionType: e.value,
            isPrimitive: false,
          };
        } else {
          return {
            ...obj,
            collectionType: e.value,
            isPrimitive: true,
          };
        }
      }

      return obj;
    });

    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });

    setDropList(newStateList);
  };

  const editTask = (id, value) => {
    const newValue = value.split(" ").join("_");
    const newState = dropList.map((obj) => {
      if (obj.id === id) {
        return { ...obj, element: newValue };
      }
      return obj;
    });
    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });
    setDropList(newState);
  };

  const handleRemove = (id) => {
    const filteredList = dropList.filter((item) => item.id !== id);
    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });
    setDropList(filteredList);
  };

  const handleRemoveAll = (e) => {
    e.preventDefault();
    setUndoArray((prev) => {
      return [...prev, [...dropList]];
    });
    setDropList([]);
  };

  const handlefilter = (e) => {
    e.preventDefault();

    if (filtershown == true) {
      setfiltershown(false);
    } else {
      setfiltershown(true);
    }
  };

  const handleFilterData = (e) => {
    setDropDownSearch(e.map((e) => e.value));
  };

  const handleButtonClick = () => {
    setOpen(true);
  };

  const handleCall = (MainbodySection) => {
    setOpen(MainbodySection);
  };

  const handleGroupIconButtonClick = () => {
    setIsGroupPopupOpen(true);
  };

  const handleCallGroupPopup = (MainbodySection) => {
    setIsGroupPopupOpen(MainbodySection);
  };

  const renderIcons = (item) => {
    switch (item.type) {
      case "String":
        return StringIco;
      case "Integer":
        return IntegerIcon;
      case "Boolean":
        return BooleanIcon;
      case "Date":
        return DateIcon;
      case "Date Time":
        return DatetimeIcon;
      case "Float":
        return FloatIcon;
      case "DataModel":
        return DataModelIcon;
      default:
        return "";
    }
  };

  const renderUndo = (e) => {
    if (undoArray.length) {
      let tempUndoArray = [...undoArray];
      let tempDropList = tempUndoArray.pop();

      tempUndoArray.length
        ? setUndoArray([...tempUndoArray])
        : setUndoArray([]);

      setRedoArray((prev) => {
        return [...prev, [...dropList]];
      });
      setDropList([...tempDropList]);
    }
  };

  const renderRedo = (e) => {
    if (redoArray.length) {
      let tempRedoArray = [...redoArray];
      let tempDropList = tempRedoArray.pop();

      tempRedoArray.length
        ? setRedoArray([...tempRedoArray])
        : setRedoArray([]);

      setUndoArray((prev) => {
        return [...prev, [...dropList]];
      });
      setDropList([...tempDropList]);
    }
  };

  return (
    <div className="dataModeller BodyColor">
      <form className="dataModellerForm">
        <div className="dataModellerFormContainer">
          <h3 className="DataModellerHeader">Entity</h3>
          <h3 className="DataModellerHeader">
            Field Type
            <button
              className="dataModeller-filter"
              onClick={(e) => handlefilter(e)}
            >
              <img src={FilterIco} alt="Filter Icon" />
            </button>
          </h3>
          <h3 className="DataModellerHeader-mandatory">Mandatory</h3>
          <div className="deleteIconHeader">
            <Delete
              className="deleteAllDm"
              onClick={(e) => handleRemoveAll(e)}
            />
          </div>
        </div>
        {filtershown == true && (
          <Select
            className="filtertype basic-multi-select"
            options={elements?.dataType}
            onChange={handleFilterData}
            isMulti
            classNamePrefix="select"
          />
        )}
        <div className="DataModellerContent customScrollBar">
          {dropList
            ?.filter((user) =>
              dropDownSearch?.length === 0
                ? user
                : dropDownSearch?.includes(user.type)
            )
            ?.map((item, index) => {
              const newItem = {
                label: item.type,
                value: item.type,
              };
              const newItemList = {
                label: item.collectionType?.replace(/\.[^/.]+$/, ""),
                value: item.collectionType?.replace(/\.[^/.]+$/, ""),
              };
              return (
                <div className="DataModellerContent-Data">
                  <div className="DataModellerContent-Data-row">
                    <div className="map1 ">
                      <span
                        id="dataModeller-entityfield"
                        className="contentEditable-datamodeller secondaryColor"
                        contenteditable="true"
                        onBlur={(e) =>
                          editTask(item.id, e.currentTarget.textContent)
                        }
                      >
                        {item.element}
                      </span>
                    </div>
                  </div>
                  <div className="DataModellerContent-Data-row BodyColor">
                    <div className="map2">
                      <span className="render">
                        <img src={renderIcons(item)} alt="" />

                        <Select
                          classNamePrefix="react-select-datamodel"
                          menuPlacement="auto"
                          value={newItem}
                          onChange={(e) => updateValue(e, item.id)}
                          options={elements?.dataType}
                          className="datamodellerFieldtype"
                          // classNamePrefix={"my-custom-react-select"}
                          menuPortalTarget={document.body}
                          styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          }}
                          // menuIsOpen={true}
                          key={`FieldType-${index}`}
                          id={`FieldType-${index}`}
                        />

                        {item.type == "List" && (
                          <Select
                            classNamePrefix="react-select-datamodel"
                            menuPlacement="auto"
                            value={newItemList}
                            onChange={(e) => updateValueList(e, item.id)}
                            options={elementsList?.dataType}
                            className="datamodellerFieldtype"
                            menuPortalTarget={document.body}
                            styles={{
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="DataModellerContent-Data-row-mandatory BodyColor">
                    <input
                      id="mandatory-value"
                      name="mandatory-checkbox"
                      className="mandatory-div"
                      type="checkbox"
                      onClick={(e) => mandatoryValue(e, item.id)}
                      checked={item.mandatory}
                    />
                  </div>
                  <div className="DataModellerContent-Data-row-delete">
                    <Link onClick={() => handleRemove(item.id)} to="#">
                      <button className="Deletebutton BodyColor">
                        <img
                          src={DeleteIco}
                          alt="Delete Icon"
                          style={{ height: "20px" }}
                        />
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
        <button className="DataModellerplus" onClick={(e) => onClick(e)} id="dataModeller-PlusButton">
          <img src={PlusIco} alt="plus Icon" />
        </button>
      </form>

      <div
        className="appdesigner-rightside-menu BodyColor"
        style={{ top: "0px" }}
      >
        <ul className="appdesigner-rightside-menu-link">
          <li>
            <Link
              data-tip
              data-for="undo"
              to="#"
              onClick={(e) => {
                if (undoArray.length) renderUndo(e);
              }}
            >
              <Undo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="undo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Undo")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              data-tip
              data-for="redo"
              to="#"
              onClick={(e) => {
                if (redoArray.length) renderRedo(e);
              }}
            >
              <Redo className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="redo"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Redo")}
            </ReactTooltip>
          </li>
          <li>
            <Link onClick={openDeleteModal} data-tip data-for="delete" to="#">
              <Delete className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="delete"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Delete")}
            </ReactTooltip>
          </li>
          <li>
            <Link data-tip data-for="copy" to="#">
              <Duplicate className="svg-stroke-comingSoonIcon" />
            </Link>
            <ReactTooltip
              id="copy"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => {
                data.lockStatus
                  ? data.lockOwner === localStorage.getItem("username")
                    ? onSave()
                    : console.log("Not the owner")
                  : onSave();
              }}
              data-tip
              data-for="save"
            >
              <Save className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="save"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {data.lockStatus
                ? data.lockOwner === localStorage.getItem("username")
                  ? t("Save")
                  : `Locked by ${data.lockOwner}`
                : t("Save")}
            </ReactTooltip>
          </li>
          <li>
            <Link onClick={onSaveasDraft} data-tip data-for="saveDraft" to="#">
              <SaveAsADraft className="svg-fill iconFillhover iconSvgFillColor" />
            </Link>
            <ReactTooltip
              id="saveDraft"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Save As Draft")}
            </ReactTooltip>
          </li>
          <li>
            <Link to="#" data-tip data-for="Download">
              <img src={downloadCs} />
              {/* <Download1 className="svg-stroke-comingSoonIcon" /> */}
            </Link>
            <ReactTooltip
              id="Download"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("comingSoon")}
            </ReactTooltip>
          </li>
          <li>
            <Link onClick={handleButtonClick} to="#">
              <Mapping
                className="svg-fill iconFillhover iconSvgFillColor"
                data-tip
                data-for="Mapping"
              />
            </Link>
            <ReactTooltip
              id="Mapping"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Mapping")}
            </ReactTooltip>
            <DataModellerMapping
              buttonClick={open}
              BpmnDmnModal={handleCall}
              data={data}
            />
          </li>
          <li>
            <Link
              onClick={() => handleGroupIconButtonClick()}
              data-tip
              data-for="Generate"
              to="#"
            >
              <GroupIcon className="svg-stroke iconStrokehover iconSvgStrokeColor" />
            </Link>
            <ReactTooltip
              id="Generate"
              place="left"
              className="tooltipCustom"
              arrowColor="rgba(0, 0, 0, 0)"
              effect="solid"
            >
              {t("Generate")}
            </ReactTooltip>
            <GroupIconPopup
              data={data.data}
              buttonClick={isGroupPopupOpen}
              RightSidebarToMainbodySection={handleCallGroupPopup}
              doGetAllResources={doGetAllResources}
            />
          </li>
        </ul>
        <Link className="credit-card-link" data-tip data-for="Overview" to="#">
          <Overview className="svg-fill-comingSoonIcon" />
        </Link>
        <ReactTooltip
          id="Overview"
          place="left"
          className="tooltipCustom"
          arrowColor="rgba(0, 0, 0, 0)"
          effect="solid"
        >
          {t("comingSoon")}
        </ReactTooltip>
      </div>
      <CommonModelContainer
        modalTitle={t("Delete Data Model")}
        show={showDeleteModal}
        handleClose={openDeleteModal}
        className="deletedatamodel-modal"
      >
        <h6 className="deletedata">
          {t("Do you want to delete")}{" "}
          {data.resourceName.substring(0, data.resourceName.length - 5)}{" "}
        </h6>

        <div className=" deletebtn">
          <button
            className="canceldatasecondaryButton secondaryButtonColor"
            onClick={openDeleteModal}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={() => deleteFile()}
            className="deletedataprimaryButton primaryButtonColor"
          >
            {t("Confirm")}
          </button>
        </div>
      </CommonModelContainer>
      <div
        className=" appdesigner-asset-footer  "
        style={{ backgroundColor: "#fff" }}
      >
        <div className="appdesigner-footer-left col-md-10 BodyColor">
          <div className="row">
            <div className="appdesigner-footer-start">
              <div className="Datamodeller-zoom-view-device zoom-view-device">
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
                <div className="appdesigner-footer-zoom-view-prop"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="appdesigner-footer-right appdesigner-footer-right-logo">
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
        </div>
      </div>
    </div>
  );
};

export default DataModeller;
