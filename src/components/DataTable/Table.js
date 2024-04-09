import { Icon } from "@iconify/react";
import { OData } from "@odata/client";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { JsonToExcel } from "react-json-to-excel";
import { Link } from "react-router-dom";
import {
  useBlockLayout,
  useFlexLayout,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from "react-table";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import {
  AddNewColDatagrid,
  CopyIconBrand,
  DeleteIconBrand,
  EditIconBrand,
  TableArrowIcon,
  TableExtremeNextBtn,
  TableExtremePrevBtn,
  TableNextBtn,
  TablePrevBtn,
  TableSearchCrossIcon,
  TableSearchIcon,
  TableSelectColumnIcon,
  TableSortIcon,
} from "../../assets";
import AccessibilityPopup from "../AccessibilityPopup/AccessibilityPopup";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import "./Table.css";

import { useTranslation } from "react-i18next";
import SortIconDown from "../../assets/datagridIcons/SortIconDown";
import SortIconUp from "../../assets/datagridIcons/SortIconUp";
import { loggedInUserState } from "../../state/atom";
import NextArrow from "./../../assets/datagridIcons/NextArrow";
import NextExtremeArrow from "./../../assets/datagridIcons/NextExtremeArrow";
import PrevArrow from "./../../assets/datagridIcons/PrevArrow";
import PreviousExtremeArrow from "./../../assets/datagridIcons/PreviousExtremeArrow";

const Table = ({
  dataGridProperties,
  datagridChanges,
  setdatagridChanges,
  fieldName,
  accessibilityprop,
  // gridColumns,
  disabledStatus,
  processVariableName,
  captureValue,
  formData,
  currentElement,
  getODataFilteredValuesRenderForm,
}) => {
  const [newCol, setNewCol] = useState("");
  const [data, setData] = useState([]);

  const [columns, setColumns] = useState([]);
  const [tempIds, settempIds] = useState([]);
  const [editableId, setEditableId] = useState(false);
  const [editableCellIndex, setEditableCellIndex] = useState(false);
  const [t, i18n] = useTranslation("common");
  const [myEmail, setMyEmail] = useState(localStorage.getItem("username"));
  const [myGroups, setMyGroups] = useState(
    JSON.parse(localStorage.getItem("groups"))
  );

  const [pageIndexLocal, setPageIndexLocal] = useState(0);
  const [pageSizeLocal, setPageSizeLocal] = useState(5); // const[pageDataLocal, setPageDataLocal] = useState([])

  const [userFinalRootAccessibility, setUserFinalRootAccessibility] =
    useState(null);

  const [rowIndex, setRowIndex] = useState([]);
  const [currentColumn, setCurrentColumn] = useState("");
  const [currentSortDirection, setCurrentSortDirection] = useState("");

  const [refresher, setRefresher] = useState(false);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);

  const [extremePreviousActive, setExtremePreviousActive] = useState(false);
  const [previousActive, setPreviousActive] = useState(false);
  const [extremeNextActive, setExtremeNextActive] = useState(false);
  const [nextActive, setNextActive] = useState(false);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const [filters, setFilters] = useState([]);

  const dependencies = dataGridProperties?.filters?.map((dep) => {
    if (dep.useProcessVariable) {
      return dep.value;
    }
  });

  const togglePaginationButton = (toggleAction) => {
    setRowIndex([]);
    switch (toggleAction) {
      case "ExtremePrevious":
        setExtremePreviousActive(true);
        setPreviousActive(false);
        setNextActive(false);
        setExtremeNextActive(false);
        break;

      case "Previous":
        setExtremePreviousActive(false);
        setPreviousActive(true);
        setNextActive(false);
        setExtremeNextActive(false);
        break;

      case "Next":
        setExtremePreviousActive(false);
        setPreviousActive(false);
        setNextActive(true);
        setExtremeNextActive(false);
        break;

      case "ExtremeNext":
        setExtremePreviousActive(false);
        setPreviousActive(false);
        setNextActive(false);
        setExtremeNextActive(true);
        break;

      default:
        break;
    }
  };

  const accessibilityCode = {
    write: "writePermission",
    read: "readOnlyPermission",
    hide: "hidePermission",
    notApplicable: "notApplicable",
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (dependencies?.includes(currentElement)) getData();
  }, [refresher, formData]);

  async function getData() {
    let userFinalRootAccessibilityTemp =
      determineRootFinalAccessibility(accessibilityprop);
    setUserFinalRootAccessibility(userFinalRootAccessibilityTemp);

    try {
      setData([]);
      var getDataGridDataAPI = await getODataFilteredValuesRenderForm(
        dataGridProperties?.filters,
        dataGridProperties?.dataModelName
      );

      if (getDataGridDataAPI.length != 0) {
        setData([...getDataGridDataAPI]);
      }

      const makeCols = (data) => {
        const requiredCols = data.filter((item) => item.required === true);
        const tempCol = requiredCols.map((item) => {
          return {
            Header: item.displayName ? item.displayName : item.name,
            accessor: item.name, // accessor is the "key" in the data
            type: item.type,
            headerAccessibility: item?.accessibility,
          };
        });
        setColumns([...tempCol]);
      };
      makeCols(dataGridProperties.cols);
    } catch (error) {
      console.error("error", error);
    }
  }

  function getProcessVariableValue(receivedData) {
    let value = "";
    if (formData[receivedData]) value = formData[receivedData];
    return value;
  }

  function getSessionValue(receivedValue) {
    let value = "";
    if (receivedValue === "_sessionEmployeeName") {
      value = loggedInUser?.username;
    } else if (receivedValue === "_sessionEmployeeID") {
      value = loggedInUser.id;
    } else {
      value = loggedInUser.email;
    }
    return value;
  }

  const OdataApiCall = async (
    field,
    operator,
    receivedValue,
    useSession,
    useProcessVariable,
    appName,
    tableName
  ) => {
    let value = null;

    if (useSession) value = getSessionValue(receivedValue);
    else if (useProcessVariable) value = getProcessVariableValue(receivedValue);
    else value = receivedValue;

    const odataApiPromise = new Promise(async (resolve, reject) => {
      let apiEndpoint = `${
        process.env.REACT_APP_DATA_ENDPOINT
      }/query/${localStorage.getItem("workspace")}/${appName}/${tableName}`;
      let operation;
      let queryFilter;
      switch (operator) {
        case "=":
          operation = "eq";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case ">":
          operation = "gt";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case "<":
          operation = "lt";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case ">=":
          operation = "ge";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case "<=":
          operation = "le";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case "!=":
          operation = "ne";
          queryFilter = isNaN(value)
            ? `${field} ${operation} '${value}'`
            : `${field} ${operation} ${value}`;
          break;
        case "like":
          queryFilter = `substringof('${value}',${field})`;
          break;
        default:
          break;
      }

      const queryUrl = `${apiEndpoint}?$filter=${queryFilter}`;

      await axios
        .get(queryUrl)
        .then((response) => {
          resolve(response.data.value);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return odataApiPromise;
  };

  const getOdataFilteredValues = async (allFilters) => {
    const appName = localStorage.getItem("appName");
    const collectionName = dataGridProperties.dataModelName.replace(
      /\.[^/.]+$/,
      ""
    );

    if (allFilters.length === 0) {
      const allData = await axios.get(
        `${process.env.REACT_APP_DATA_ENDPOINT}/query/${localStorage.getItem(
          "workspace"
        )}/${appName}/${collectionName}`
      );
      return allData.data.value;
    }

    var filteredData = [];

    for (let i = 0; i < allFilters.length; i++) {
      const values = await OdataApiCall(
        allFilters[i].field,
        allFilters[i].operator,
        allFilters[i].value,
        allFilters[i]?.useSession || false,
        allFilters[i]?.useProcessVariable || false,
        appName,
        collectionName
      );
      values.map((element) => {
        filteredData.push(element);
      });
    }

    // let uniqueDataFormFilteredData = filteredData.reduce((previousResultsArr, currentElementValue) => {
    //   let exists = false;
    //     for(let i=0;i<previousResultsArr.length;i++){
    //         if(previousResultsArr[i]._id === currentElementValue._id){
    //             exists = true;
    //         }
    //     }
    //     if(exists == false){
    //         previousResultsArr.push(currentElementValue);
    //     }
    //     return previousResultsArr;
    //   }, []);

    return filteredData;
  };

  const userAccessibility = (accessibilityData) => {
    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < accessibilityData.hideUsers.length; i++) {
      let tempUsername = accessibilityData.hideUsers[i].username;
      if (tempUsername === myEmail) {
        hasHideAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.readUsers.length; i++) {
      let tempUsername = accessibilityData.readUsers[i].username;
      if (tempUsername === myEmail) {
        hasReadAccess = true;
      }
    }

    for (let i = 0; i < accessibilityData.writeUsers.length; i++) {
      let tempUsername = accessibilityData.writeUsers[i].username;
      if (tempUsername === myEmail) {
        hasWriteAccess = true;
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.notApplicable;
  };

  const groupAccessibility = (accessibilityData) => {
    let tempMyGroups = myGroups.map((group) => {
      return group.name;
    });

    if (tempMyGroups.length == 0) {
      return accessibilityCode.notApplicable;
    }

    let hasWriteAccess = false;
    let hasReadAccess = false;
    let hasHideAccess = false;

    for (let i = 0; i < tempMyGroups.length; i++) {
      for (let j = 0; j < accessibilityData.hideGroups.length; j++) {
        let tempGroupname = accessibilityData.hideGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasHideAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.readGroups.length; j++) {
        let tempGroupname = accessibilityData.readGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasReadAccess = true;
        }
      }

      for (let j = 0; j < accessibilityData.writeGroups.length; j++) {
        let tempGroupname = accessibilityData.writeGroups[j].name;
        if (tempGroupname === tempMyGroups[i]) {
          hasWriteAccess = true;
        }
      }
    }

    if (hasWriteAccess == true) {
      return accessibilityCode.write;
    } else if (hasWriteAccess == false && hasReadAccess == true) {
      return accessibilityCode.read;
    } else if (
      hasReadAccess == false &&
      hasReadAccess == false &&
      hasHideAccess == true
    ) {
      return accessibilityCode.hide;
    }

    return accessibilityCode.notApplicable;
  };

  const determineRootFinalAccessibility = (accessibilityData) => {
    const userPreviledges = userAccessibility(accessibilityData);
    const groupPreviledges = groupAccessibility(accessibilityData);

    let accessibilityStatus;

    if (
      groupPreviledges == accessibilityCode.notApplicable &&
      userPreviledges == accessibilityCode.notApplicable
    ) {
      return accessibilityCode.write;
    } else if (
      groupPreviledges == accessibilityCode.notApplicable &&
      userPreviledges != accessibilityCode.notApplicable
    ) {
      if (userPreviledges === accessibilityCode.write) {
        accessibilityStatus = accessibilityCode.write;
      } else if (userPreviledges == accessibilityCode.read) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (userPreviledges === accessibilityCode.hide) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    } else if (
      groupPreviledges != accessibilityCode.notApplicable &&
      userPreviledges == accessibilityCode.notApplicable
    ) {
      if (groupPreviledges === accessibilityCode.write) {
        accessibilityStatus = accessibilityCode.write;
      } else if (groupPreviledges == accessibilityCode.read) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (groupPreviledges === accessibilityCode.hide) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    } else {
      if (
        userPreviledges === accessibilityCode.write ||
        groupPreviledges === accessibilityCode.write
      ) {
        accessibilityStatus = accessibilityCode.write;
      } else if (
        userPreviledges === accessibilityCode.read &&
        groupPreviledges === accessibilityCode.read
      ) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (
        userPreviledges === accessibilityCode.hide &&
        groupPreviledges === accessibilityCode.hide
      ) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    }
  };

  const determineColumnFinalAccessibility = (accessibilityData) => {
    const userPreviledges = userAccessibility(accessibilityData);
    const groupPreviledges = groupAccessibility(accessibilityData);

    let accessibilityStatus;

    if (
      groupPreviledges == accessibilityCode.notApplicable &&
      userPreviledges == accessibilityCode.notApplicable
    ) {
      return accessibilityCode.notApplicable;
    } else if (
      groupPreviledges == accessibilityCode.notApplicable &&
      userPreviledges != accessibilityCode.notApplicable
    ) {
      if (userPreviledges === accessibilityCode.write) {
        accessibilityStatus = accessibilityCode.write;
      } else if (userPreviledges == accessibilityCode.read) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (userPreviledges === accessibilityCode.hide) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    } else if (
      groupPreviledges != accessibilityCode.notApplicable &&
      userPreviledges == accessibilityCode.notApplicable
    ) {
      if (groupPreviledges === accessibilityCode.write) {
        accessibilityStatus = accessibilityCode.write;
      } else if (groupPreviledges == accessibilityCode.read) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (groupPreviledges === accessibilityCode.hide) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    } else {
      if (
        userPreviledges === accessibilityCode.write ||
        groupPreviledges === accessibilityCode.write
      ) {
        accessibilityStatus = accessibilityCode.write;
      } else if (
        userPreviledges === accessibilityCode.read ||
        groupPreviledges === accessibilityCode.read
      ) {
        accessibilityStatus = accessibilityCode.read;
      }
      if (
        userPreviledges === accessibilityCode.hide &&
        groupPreviledges === accessibilityCode.hide
      ) {
        return accessibilityCode.hide;
      } else {
        return accessibilityStatus;
      }
    }
  };

  const defaultColumn = React.useMemo(
    () => ({
      width: 115,
      minWidth: 115,
      maxWidth: 1000,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    rows,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,

      initialState: { pageIndex: pageIndexLocal, pageSize: pageSizeLocal },
    },
    useSortBy,
    useFlexLayout,
    usePagination,
    useResizeColumns
  );

  useEffect(() => {
    if (pageIndex == 0) {
      setPageIndexLocal(0);
    } else {
      setPageIndexLocal(pageIndex);
    }
  }, [pageIndex]);

  const handleCellChange = (cell, val) => {
    const _id = cell.row.original._id;
    const temp = data.map((item, index) => {
      if (index == cell.row.id) {
        return {
          ...item,
          [cell.column.id]: isNaN(val) ? val : Number(val),
        };
      } else {
        return item;
      }
    });
    setData([...temp]);
    var result = temp.filter((obj) => {
      return obj._id === _id;
    });

    if (tempIds.includes(_id)) {
      var datatoBeadded = result[0];
      //  delete datatoBeadded['_id'];
      var deletableData = {
        type: "insert",
        id: result[0]._id,
        data: datatoBeadded,
        model: dataGridProperties.dataModelName.replace(/\.[^/.]+$/, ""),
      };
      var gridData = datagridChanges;
      gridData = gridData.filter((item) => item.id !== result[0]._id);
      gridData.push(deletableData);
      setdatagridChanges([...gridData]);
    } else {
      var datatoBeadded = result[0];
      // delete datatoBeadded['_id'];
      var deletableData = {
        type: "update",
        id: result[0]._id,
        data: datatoBeadded,
        model: dataGridProperties.dataModelName.replace(/\.[^/.]+$/, ""),
      };
      var gridData = datagridChanges;
      gridData = gridData.filter((item) => item.id !== result[0]._id);
      gridData.push(deletableData);
      setdatagridChanges([...gridData]);
    }
  };

  const handleHeaderChange = (column, value) => {
    const tempCol = columns.map((item) => {
      if (item.accessor === column.id) {
        return { ...item, Header: value };
      } else {
        return item;
      }
    });
    setColumns([...tempCol]);
  };

  const handleNewColChange = (e) => {
    e.preventDefault();
    setNewCol(e.target.value);
  };

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (newCol) {
      const caps = newCol.charAt(0).toLowerCase() + newCol.slice(1);
      const key = caps.replace(/ /g, "");
      let tempCol = columns;
      tempCol.push({
        Header: newCol,
        accessor: key,
      });
      setColumns([...tempCol]);
      const tempData = data.map((item) => {
        return {
          ...item,
          [key]: "",
        };
      });
      setData([...tempData]);
      setNewCol("");
    }
  };

  const handleAddRow = (row) => {
    const min = 1;
    const max = 1000000000000000;
    let i = 0;
    let colsNum = columns.length;
    let newRow = {};
    if (row) {
      newRow = { ...row.original };
    } else {
      while (i < colsNum) {
        newRow = {
          ...newRow,
          [columns[i].accessor]: "",
        };
        i = i + 1;
      }
    }
    newRow._id = min + Math.round(Math.random() * (max - min));
    var tempIdData = tempIds;
    tempIdData.push(newRow._id);
    settempIds(tempIdData);
    let tempData = data;
    tempData.push(newRow);
    if (
      tempData.length > pageSizeLocal - 1 &&
      (tempData.length % pageSizeLocal) - 1 == 0
    ) {
      setPageIndexLocal(pageIndexLocal + 1);
    }
    setData([...tempData]);
  };

  const deleteRow = (row, gridData, tempData) => {
    if (tempIds.includes(row.original._id)) {
      gridData = gridData.filter((element) => element.id != row.original._id);
    }
    if (!tempIds.includes(row.original._id)) {
      var deletableData = {
        type: "Delete",
        id: row.original._id,
        model: dataGridProperties.dataModelName.replace(/\.[^/.]+$/, ""),
      };
      gridData.push(deletableData);
    }
    tempData = tempData.filter(function (obj) {
      return obj._id !== row.original._id;
    });
    return { gridData: gridData, tempData: tempData };
  };

  const enableEdit = (id, cellIndex) => {
    setEditableId(id);
    setEditableCellIndex(cellIndex);
  };

  const handleCopyRow = (row) => {
    const min = 1;
    const max = 1000000000000000;
    let i = 0;
    let colsNum = columns.length;
    let newRow = {};
    if (row) {
      newRow = { ...row.original };
    } else {
      while (i < colsNum) {
        newRow = {
          ...newRow,
          [columns[i].accessor]: "",
        };
        i = i + 1;
      }
    }
    newRow._id = min + Math.round(Math.random() * (max - min));
    var tempIdData = tempIds;
    tempIdData.push(newRow._id);
    settempIds(tempIdData);
    let tempData = data;
    tempData.push(newRow);
    if (
      tempData.length > pageSizeLocal - 1 &&
      (tempData.length % pageSizeLocal) - 1 == 0
    ) {
      setPageIndexLocal(pageIndexLocal + 1);
    }

    var insertableData = {
      type: "insert",
      id: newRow._id,
      data: newRow,
      model: dataGridProperties.dataModelName.replace(/\.[^/.]+$/, ""),
    };
    var gridData = datagridChanges;
    gridData.push(insertableData);
    setdatagridChanges([...gridData]);

    setData([...tempData]);
  };

  //creating issue with other grid activvities so commented currently
  const downloadTableData = () => {
    const downloadableData = data.map((d) => {
      delete d._id;
      return d;
    });
    return downloadableData;
  };

  const [originalData, setOriginalData] = useState([]);
  const applySearchFilter = (e, filter) => {
    // setOriginalData(data);
    var filteredData = data.filter(function (obj) {
      return obj[filter].includes(e.target.value);
    });
    setData(filteredData);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [searchColumn, setSearchColumn] = useState("");

  const doSort = (sortField, sortDirection) => {
    var dataTemp = [...data];

    let datatempWithCurrentField = dataTemp.filter((value) => value[sortField]);
    let datatempWithoutCurrentField = dataTemp.filter(
      (value) => !value[sortField]
    );

    if (sortDirection == "ascending") {
      datatempWithCurrentField.sort((a, b) => {
        if (
          b[sortField].toString().toLowerCase() >
          a[sortField].toString().toLowerCase()
        ) {
          return -1;
        } else if (
          a[sortField].toString().toLowerCase() >
          b[sortField].toString().toLowerCase()
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    } else if (sortDirection == "descending") {
      datatempWithCurrentField.sort((a, b) => {
        if (
          b[sortField].toString().toLowerCase() <
          a[sortField].toString().toLowerCase()
        ) {
          return -1;
        } else if (
          a[sortField].toString().toLowerCase() <
          b[sortField].toString().toLowerCase()
        ) {
          return 1;
        } else {
          return 0;
        }
      });
    }

    dataTemp = datatempWithCurrentField.concat(datatempWithoutCurrentField);
    setData(dataTemp);
  };

  const sortByDate = (sortField, sortDirection) => {
    let datatemp = [...data];

    let datatempWithDate = datatemp.filter((value) => value[sortField]);
    let datatempWithoutDate = datatemp.filter((value) => !value[sortField]);

    if (sortDirection == "descending") {
      datatempWithDate.sort(function (a, b) {
        return new Date(b[sortField]) - new Date(a[sortField]);
      });
    } else if (sortDirection == "ascending") {
      datatempWithDate.sort(function (a, b) {
        return new Date(a[sortField]) - new Date(b[sortField]);
      });
    }

    datatemp = datatempWithDate.concat(datatempWithoutDate);
    setData(datatemp);
  };

  const deleteMultipleRows = () => {
    let rowsToBeDeleted = [];
    let tempData = data;
    var gridData = datagridChanges;
    for (let i = 0; i < rowIndex.length; i++) {
      rowsToBeDeleted.push(page[rowIndex[i]]);
      let changes = deleteRow(
        rowsToBeDeleted[rowsToBeDeleted.length - 1],
        gridData,
        tempData
      );
      tempData = changes.tempData;
      gridData = changes.gridData;
    }

    setdatagridChanges([...gridData]);
    setData([...tempData]);
    setRowIndex([]);
  };

  const copyMultipleRows = () => {
    let rowIndexTemp = rowIndex;
    rowIndexTemp.reverse();
    for (let i = rowIndexTemp.length - 1; i >= 0; i--) {
      handleCopyRow(page[rowIndexTemp[i]]);
    }
    setRowIndex([]);
  };

  const downloadGridData = () => {
    let headersData = {};

    dataGridProperties.cols.map((column) => {
      headersData[column.name] = column.displayName
        ? column.displayName
        : column.name;
    });

    var axios = require("axios");
    var data = JSON.stringify(headersData);

    let workspaceName = localStorage.getItem("workspace");
    let appName = localStorage.getItem("appName");
    let dataModelName = dataGridProperties.dataModelName.replace(
      /\.[^/.]+$/,
      ""
    );

    var config = {
      method: "post",
      url: `${process.env.REACT_APP_IFAPP_API_ENDPOINT}${workspaceName}/${appName}/${dataModelName}`,
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "arraybuffer",
      data: data,
    };

    axios(config)
      .then(function (response) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fieldName}.xlsx`);
        document.body.appendChild(link);
        link.click();

        toast.success(`Grid data downloaded successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(function (error) {
        toast.error(`Something went wrong, grid data couldn't be downloaded`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      });
  };

  //input fields segregation

  const renderInputFields = (
    inputType,
    cell,
    disabledStatus,
    columnAccessibility
  ) => {
    switch (inputType) {
      case "String":
        return RenderTextInput(cell, disabledStatus, columnAccessibility);
        break;
      case "Date":
        return RenderDateInput(cell, disabledStatus, columnAccessibility);
        break;
      case "Integer":
        return RenderIntegerInput(cell, disabledStatus, columnAccessibility);
        break;
      case "Float":
        return RenderFloatInput(cell, disabledStatus, columnAccessibility);
        break;
      default:
        break;
    }
  };

  const RenderTextInput = (cell, disabledStatus, columnAccessibility) => {
    return (
      <input
        placeholder={disabledStatus == false ? "Click To Edit" : ""}
        type="text"
        value={cell.value !== null || cell.value === 0 ? cell.value : ""}
        disabled={
          cell.row.original._id === editableId && disabledStatus == false
            ? columnAccessibility == accessibilityCode.read
            : true
        }
        style={
          cell.value &&
          searchTerm != "" &&
          cell.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ? { fontWeight: "bold" }
            : {}
        }
        className={
          cell.row.original._id === editableId
            ? columnAccessibility == accessibilityCode.read
              ? "transparentStyle"
              : "active"
            : "transparentStyle"
        }
        onChange={(e) => handleCellChange(cell, e.target.value)}
        onBlur={() => {
          setEditableCellIndex(null);
          setEditableCellIndex(null);
        }}
        id="table-editable-input"
      />
    );
  };

  const RenderDateInput = (cell, disabledStatus, columnAccessibility) => {
    return (
      <input
        type="date"
        value={cell.value !== null || cell.value === 0 ? cell.value : ""}
        disabled={
          cell.row.original._id === editableId && disabledStatus == false
            ? columnAccessibility == accessibilityCode.read
            : true
        }
        style={
          cell.value &&
          searchTerm != "" &&
          cell.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ? { fontWeight: "bold" }
            : {}
        }
        className={
          cell.row.original._id === editableId
            ? columnAccessibility == accessibilityCode.read
              ? "transparentStyle"
              : "active"
            : "transparentStyle"
        }
        onChange={(e) => handleCellChange(cell, e.target.value)}
        onBlur={() => {
          setEditableCellIndex(null);
          setEditableCellIndex(null);
        }}
        id="table-editable-input"
      />
    );
  };

  const RenderIntegerInput = (cell, disabledStatus, columnAccessibility) => {
    const handleInputChange = (event) => {
      const inputValue = event.target.value.replace(/[^0-9]/g, "");
      handleCellChange(
        cell,
        /^\d+$/.test(inputValue) ? parseInt(inputValue, 10) : ""
      );
    };

    const handleKeyPress = (event) => {
      // Block the dot key (key code 46 or 190) from being entered
      if (event.key === "." || event.which === 46 || event.keyCode === 46) {
        event.preventDefault();
      }
    };

    return (
      <input
        placeholder={
          disabledStatus == false && !cell.value ? "Click To Edit" : ""
        }
        type="text"
        value={cell.value === "" ? "" : cell.value} // Convert number to string when rendering
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        style={
          cell.value &&
          searchTerm != "" &&
          cell.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ? { fontWeight: "bold" }
            : {}
        }
        className={
          cell.row.original._id === editableId
            ? columnAccessibility == accessibilityCode.read
              ? "transparentStyle"
              : "active"
            : "transparentStyle"
        }
        disabled={
          cell.row.original._id === editableId && disabledStatus == false
            ? columnAccessibility == accessibilityCode.read
            : true
        }
      />
    );
  };

  const RenderFloatInput = (cell, disabledStatus, columnAccessibility) => {
    const handleInputChange = (event) => {
      let inputValue = event.target.value;

      handleCellChange(cell, inputValue);
    };

    return (
      <input
        placeholder={
          disabledStatus == false && !cell.value ? "Click To Edit" : ""
        }
        type="number" // Use type "number"
        step="any" // Allow any floating-point number as the step
        value={cell.value}
        onChange={handleInputChange}
        style={
          cell.value &&
          searchTerm != "" &&
          cell.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            ? { fontWeight: "bold" }
            : {}
        }
        className={
          cell.row.original._id === editableId
            ? columnAccessibility == accessibilityCode.read
              ? "transparentStyle"
              : "active"
            : "transparentStyle"
        }
        disabled={
          cell.row.original._id === editableId && disabledStatus == false
            ? columnAccessibility == accessibilityCode.read
            : true
        }
      />
    );
  };

  return (
    <>
      {/* <div className={isHidden?"tr-hidden":"row custom-caption"}> */}

      <div className="table-fieldname">{fieldName}</div>
      <div className="table-wrapper">
        <div className="row custom-caption ">
          <div className="col-md-4 table-heading-container">
            <div className="table-search m-2">
              <img
                src={TableSearchIcon}
                // height={10}
                // width={10}
                className="table-searchicon"
              />
              <input
                id="table-search-input"
                type="text"
                className="table-searchinput"
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // setSearchColumn(column.id);
                }}
              />
              {searchTerm.length != 0 && (
                <img
                  id="table-search-img"
                  src={TableSearchCrossIcon}
                  // height={10}
                  // width={10}
                  className="table-searchicon"
                  onClick={() => setSearchTerm("")}
                />
              )}
            </div>
          </div>

          <div className="col-md-8 py-2 table-coloumnheader">
            <div className="ms-1 me-3 table-columnheaderpart">
              {rowIndex.length > 0 && (
                <span className="table-span secondaryColor">
                  {rowIndex.length}
                  {rowIndex.length == 1 ? " Row " : " Rows "}
                  Selected
                </span>
              )}
            </div>
            <div className=" ms-2 me-2 table-columnheaderpart">
              {rowIndex.length > 0 && (
                <img
                  id="table-copy-img"
                  src={CopyIconBrand}
                  alt="Copy Icon"
                  //  className={canwrite||canread?"icons":"icons-disabled"}
                  className="icons"
                  onClick={(e) => setShowDuplicatePopup(true)}
                />
              )}
            </div>

            <div className="ms-2 me-3 table-columnheaderpart">
              {rowIndex.length > 0 && (
                <img
                  id="table-delete-img"
                  src={DeleteIconBrand}
                  alt="Delete Icon"
                  //  className={canwrite||canread?"icons":"icons-disabled"}
                  className="icons"
                  onClick={(e) => setShowDeletePopup(true)}
                />
              )}
            </div>

            {rowIndex.length == 0 && (
              <div
                className="ms-3 me-2"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {disabledStatus == false && (
                  <div
                    className=""
                    onClick={handleAddRow}
                    id="table-addrow-link"
                  >
                    <img src={AddNewColDatagrid} />
                    {/* <span className="add-col">Add New Row</span> */}
                  </div>
                )}
              </div>
            )}

            <div className=" m-2">
              <div onClick={() => downloadGridData()} id="table-downloadGrid">
                <Icon
                  className="table-jsontoexcel"
                  icon="akar-icons:download"
                />
              </div>
            </div>
          </div>

          <div
            className="datatable table-custom customScrollBar"
            {...getTableProps()}
          >
            <div className="datath table-custom-header">
              {headerGroups.map((headerGroup) => {
                return (
                  <div
                    className="datatr"
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {/* below has to be removed as per accessibility for read */}
                    {userFinalRootAccessibility === accessibilityCode.write && (
                      <div
                        className="datath custom-th actionBlock action-header table-accessibility"
                        style={{
                          backgroundColor:
                            dataGridProperties?.style?.headerBackgroundColor ||
                            "",
                          color:
                            dataGridProperties?.style?.headerTextColor || "",
                        }}
                      >
                        {/* <img
                          src={TableSelectColumnIcon}
                          alt="Action"
                          //  className={canwrite||canread?"icons":"icons-disabled"}
                          className=""
                          // onClick={(e) => copyRow(row, e)}
                        /> */}

                        <input
                          type="checkbox"
                          className="form-check-input table-checkbox action-checkbox"
                          name=""
                          id="table-checkbox-input"
                          checked={
                            rowIndex.length > 0 &&
                            rowIndex.length == page.length
                              ? true
                              : false
                          }
                          onChange={() => {
                            if (rowIndex.length == page.length) {
                              setRowIndex([]);
                              captureValue(
                                {
                                  target: {
                                    value: [],
                                  },
                                },
                                processVariableName
                              );
                            } else {
                              let temp = [];
                              let rowIndexesTemp = page.map((p, index) => {
                                temp = [
                                  ...temp,
                                  {
                                    ...p?.original,
                                  },
                                ];
                                return index;
                              });
                              setRowIndex(rowIndexesTemp);
                              captureValue(
                                {
                                  target: {
                                    value: [...temp],
                                  },
                                },
                                processVariableName
                              );
                            }
                          }}
                        ></input>
                      </div>
                    )}

                    {headerGroup.headers.map((column, index) => {
                      let columnAccessibility = accessibilityCode.write;

                      if (column.headerAccessibility) {
                        columnAccessibility = determineColumnFinalAccessibility(
                          column.headerAccessibility
                        );
                      }

                      if (columnAccessibility == accessibilityCode.hide) {
                      } else {
                        let customHeaderProps = { ...column?.getHeaderProps() };
                        customHeaderProps = {
                          ...customHeaderProps,
                          style: {
                            ...customHeaderProps?.style,
                            backgroundColor:
                              dataGridProperties?.style
                                ?.headerBackgroundColor || "",
                            color:
                              dataGridProperties?.style?.headerTextColor || "",
                          },
                        };
                        return (
                          <div
                            className="datath custom-th"
                            {...customHeaderProps}
                          >
                            <div className="table-columnaccessibility">
                              {column.render("Header")}
                              <Dropdown>
                                <Dropdown.Toggle
                                  variant=""
                                  className="p-0 table-dropdown-toggle-btn"
                                  id="dropdown-basic"
                                >
                                  <div className="mx-2 d-flex table-currentcolumn">
                                    <div className="table-currentcolumn">
                                      <SortIconDown
                                        fillColor={
                                          currentColumn == column.id &&
                                          currentSortDirection == "asc"
                                            ? "#ffffff"
                                            : "#C4C4C4"
                                        }
                                      />
                                    </div>
                                    <div className="table-currentcolumn2">
                                      <SortIconUp
                                        fillColor={
                                          currentColumn == column.id &&
                                          currentSortDirection == "desc"
                                            ? "#ffffff"
                                            : "#C4C4C4"
                                        }
                                      />
                                    </div>
                                  </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                  className="table-sort-dropdown"
                                  id="table-sort-dropdownMenu"
                                >
                                  <span className="ms-2 table-sort primaryColor">
                                    {t("sort")}
                                  </span>
                                  <Dropdown.Item
                                    className="table-sort-dropdown-icon"
                                    id="table-sort-AZ-dropdownItem"
                                    onClick={(e) => {
                                      column.type == "Date"
                                        ? sortByDate(column.id, "ascending")
                                        : doSort(column.id, "ascending");
                                      setCurrentColumn(column.id);
                                      setCurrentSortDirection("asc");
                                    }}
                                  >
                                    <span className="table-alphasort secondaryColor">
                                      A-Z; 0-9
                                    </span>
                                  </Dropdown.Item>
                                  <Dropdown.Item
                                    id="table-sort-ZA-dropdownItem"
                                    className="table-sort-dropdown-icon"
                                    onClick={(e) => {
                                      column.type == "Date"
                                        ? sortByDate(column.id, "descending")
                                        : doSort(column.id, "descending");
                                      setCurrentColumn(column.id);
                                      setCurrentSortDirection("desc");
                                    }}
                                  >
                                    <span className="table-alphasort secondaryColor">
                                      Z-A; 9-0
                                    </span>
                                  </Dropdown.Item>
                                  {/* <Dropdown.Item href="#">A-Z</Dropdown.Item> */}
                                  <Dropdown.Item
                                    className="table-sort-dropdown-icon"
                                    id="table-default-dropdownItem"
                                    //  onClick={sortingByName}
                                    href="#"
                                  >
                                    <span
                                      id="table-default-span"
                                      className="table-alphasort secondaryColor"
                                      onClick={() => {
                                        setRefresher(true);
                                        setCurrentColumn("");
                                        setCurrentSortDirection("");
                                      }}
                                    >
                                      Default
                                    </span>
                                  </Dropdown.Item>
                                  {/* <Dropdown.Item href="#">Z-A</Dropdown.Item> */}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>

                            {/* Add a sort direction indicator */}

                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? "isResizing" : ""
                              }`}
                            />
                          </div>
                        );
                      }
                    })}
                  </div>
                );
              })}
            </div>
            <div className="dataTableBody" {...getTableBodyProps()}>
              {page
                .filter((row, index) => {
                  if (searchTerm != "") {
                    for (const key in row.values) {
                      if (
                        row.values[key] &&
                        row.values[key]
                          .toString()
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      ) {
                        return row;
                      }
                    }
                  } else {
                    return row;
                  }
                })
                .map((row, i) => {
                  prepareRow(row);
                  return (
                    // <tr {...row.getRowProps()} className={isHidden?"tr-hidden":"tr-active"}>
                    <div
                      {...row.getRowProps()}
                      // style={rowIndex.includes(i) ? {backgroundColor:'red'} :{}}
                      className={
                        rowIndex.includes(i) ? "datatr active-row" : "datatr"
                      }
                    >
                      {/* below one has to be removed for readAccess */}
                      {userFinalRootAccessibility ==
                        accessibilityCode.write && (
                        <div className="datatd actionBlock rightbortder d-flex justify-content-center table-row">
                          <div class="popup">
                            <input
                              type="checkbox"
                              className="form-check-input table-checkbox"
                              name=""
                              id="table-checkbox-input"
                              checked={rowIndex?.includes(i) ? true : false}
                              onChange={() => {
                                if (rowIndex.includes(i)) {
                                  setRowIndex(rowIndex.filter((r) => r != i));
                                  let temp = formData[
                                    processVariableName
                                  ]?.filter(
                                    (item) => item._id !== row.original._id
                                  );
                                  captureValue(
                                    {
                                      target: {
                                        value: temp?.length ? [...temp] : [],
                                      },
                                    },
                                    processVariableName
                                  );
                                } else {
                                  setRowIndex([...rowIndex, i]);
                                  let temp = formData[processVariableName]
                                    ?.length
                                    ? [
                                        ...formData[processVariableName],
                                        { ...row.original },
                                      ]
                                    : [{ ...row.original }];
                                  captureValue(
                                    { target: { value: [...temp] } },
                                    processVariableName
                                  );
                                }
                              }}
                            ></input>
                          </div>
                        </div>
                      )}
                      {row.cells.map((cell, index) => {
                        let columnAccessibility = accessibilityCode.write;
                        let inputType =
                          cell.column.type == "String"
                            ? "text"
                            : cell.column.type == "Integer" ||
                              cell.column.type == "Float"
                            ? "number"
                            : cell.column.type == "Date"
                            ? "date"
                            : "text";
                        if (cell.column.headerAccessibility) {
                          columnAccessibility =
                            determineColumnFinalAccessibility(
                              cell.column.headerAccessibility
                            );
                        }

                        if (columnAccessibility == accessibilityCode.hide) {
                        } else {
                          return (
                            <div
                              {...cell.getCellProps()}
                              className={
                                cell.row.original._id === editableId &&
                                disabledStatus == false &&
                                index === editableCellIndex
                                  ? columnAccessibility ==
                                    accessibilityCode.read
                                    ? "datatd rightbortder"
                                    : "datatd rightbortder active-cell"
                                  : "datatd rightbortder table-row"
                              }
                              onClick={() => {
                                if (
                                  editableId == row.original._id &&
                                  editableCellIndex == index
                                ) {
                                } else {
                                  enableEdit(row.original._id, index);
                                }
                              }}
                              id="table-editable-cell"
                            >
                              <div>
                                {renderInputFields(
                                  cell.column.type,
                                  cell,
                                  disabledStatus,
                                  columnAccessibility
                                )}
                                {cell.value ? (
                                  <ReactTooltip
                                    id={String(cell.value)}
                                    place="bottom"
                                    className="tooltipCustom"
                                    arrowColor="rgba(0, 0, 0, 0)"
                                    effect="float"
                                  >
                                    <span className="table-anotherspan">
                                      {String(cell.value)}
                                    </span>
                                  </ReactTooltip>
                                ) : (
                                  <span></span>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  );
                })}
            </div>
            {/* <tfoot></tfoot> */}
          </div>
        </div>
        <div className="py-1  table-footer customScrollBar">
          <div className="datagrid-pagination">
            <div
              id="table-togglePage"
              className="pagination-button mx-1"
              onClick={() => {
                gotoPage(0);
                togglePaginationButton("ExtremePrevious");
              }}
            >
              <PreviousExtremeArrow
                fillColor={extremePreviousActive ? "#0D3C84" : "#C4CDD5"}
              />
            </div>
            <div
              id="table-prevpage"
              className="pagination-button mx-1"
              onClick={() => {
                previousPage();
                togglePaginationButton("Previous");
              }}
            >
              <PrevArrow fillColor={previousActive ? "#0D3C84" : "#C4CDD5"} />
            </div>
            <div
              id="table-nextPage"
              className="pagination-button mx-1"
              onClick={() => {
                nextPage();
                togglePaginationButton("Next");
              }}
            >
              <NextArrow fillColor={nextActive ? "#0D3C84" : "#C4CDD5"} />
            </div>
            <div
              id="table-extremeNextPage"
              className="pagination-button mx-1"
              onClick={() => {
                gotoPage(pageCount - 1);
                togglePaginationButton("ExtremeNext");
              }}
            >
              <NextExtremeArrow
                fillColor={extremeNextActive ? "#0D3C84" : "#C4CDD5"}
              />
            </div>
            <div></div>
            <span className="page-custom p-2 ms-1 me-1 secondaryColor">
              Page{" "}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{" "}
            </span>{" "}
          </div>
        </div>
      </div>

      <CommonModelContainer
        modalTitle="Delete Rows"
        show={showDeletePopup}
        handleClose={() => setShowDeletePopup(false)}
        className="grid-popup"
        id="table-delRow-CommonModelContainer"
      >
        <div className=" d-flex flex-column align-items-center">
          <div className="mt-3 mb-2 grid-popup-content">
            {rowIndex.length} Row(s) will be deleted are you sure?
          </div>
          <div className="mt-2 mb-2">
            <button
              id="table-cancel-button"
              className="secondaryButton secondaryButtonColor mx-2"
              onClick={() => setShowDeletePopup(false)}
            >
              Cancel
            </button>
            <button
              id="table-confirm"
              className="primaryButton primaryButtonColor mx-2"
              onClick={() => {
                deleteMultipleRows();
                setShowDeletePopup(false);
                toast.success(
                  `${rowIndex.length} Row(s) Deleted Successfully`,
                  {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>

      <CommonModelContainer
        modalTitle="Duplicate Rows"
        show={showDuplicatePopup}
        handleClose={() => setShowDuplicatePopup(false)}
        className="grid-popup"
        id="table-duplicateRow-CommonModelContainer"
      >
        <div className=" d-flex flex-column align-items-center">
          <div className="mt-3 mb-2 grid-popup-content">
            {rowIndex.length} Row(s) will be duplicated are you sure?
          </div>
          <div className="mt-2 mb-2">
            <button
              id="table-duplicatePopupCancel-button"
              className="secondaryButton secondaryButtonColor mx-2"
              onClick={() => setShowDuplicatePopup(false)}
            >
              Cancel
            </button>
            <button
              className="primaryButton primaryButtonColor mx-2"
              onClick={() => {
                copyMultipleRows();
                setShowDuplicatePopup(false);
                toast.success(
                  `${rowIndex.length} Row(s) Duplicated Successfully`,
                  {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  }
                );
              }}
              id="table-duplicatePopupCancel-button"
            >
              Confirm
            </button>
          </div>
        </div>
      </CommonModelContainer>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Table;
