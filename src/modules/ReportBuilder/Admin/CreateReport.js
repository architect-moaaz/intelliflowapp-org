import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { Draggable, Droppable } from "react-drag-and-drop";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import ReactPaginate from "react-paginate";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//imports for QueryBuilder
import {
  formatQuery,
  QueryBuilder,
  parseMongoDB,
  parseSQL,
} from "react-querybuilder";
import "./styles.scss";
import "react-querybuilder/dist/query-builder.css";
// import QueryBuilder from "../../../components/QueryBuilder/QueryBuilder"; --to be removed

//custom css imports
import "./CreateReport.css";
import "./CreateReportPopup.css";
import "./ReactQueryBuilderCustomStyle.css";

// icons/logos/assets imports
import DataModelHeaderIcon from "./../../../assets/reportBuilderIcons/DataModelHeaderIcon.svg";
import DeleteIcon from "./../../../assets/reportBuilderIcons/DeleteIcon.svg";
import DragIcon from "./../../../assets/reportBuilderIcons/DragIcon.svg";
import EntityActiveIcon from "./../../../assets/reportBuilderIcons/EntityActiveIcon.svg";
import EntityIcon from "./../../../assets/reportBuilderIcons/EntityIcon.svg";
import DownloadIcon from "./../../../assets/reportBuilderIcons/DownloadIcon.svg";
import SearchIcon from "./../../../assets/reportBuilderIcons/SearchIcon.svg";
import { Home } from "../../../assets";
import AddDataModelIcon from "./../../../assets/reportBuilderIcons/AddDataModelIcon.svg";
import DeleteQuery from "./../../../assets/reportBuilderIcons/DeleteQuery.svg";

//custom components imports
import CommonModelContainer from "../../../components/CommonModel/CommonModelContainer";
import CommonTable from "../../../components/Tables/CommonTable/CommonTable";
import CommonPagination from "../../../components/Pagination/CommonPagination";

// API call functions imports
import {
  getDataModelerFields,
  getReportDataHelper,
  updateAndGetReportData,
  updateReportMetaData,
  getReportAccessibilityHelper,
  updateReportAccessibilityHelper,
  initiateReportGeneration,
  getReportDownloadHistory,
  getAppAndDatamodels,
} from "./../apis/ReportBuilderAPIs";
import { useTranslation } from "react-i18next";
const CreateReport = ({ setheaderTitle }) => {
  const [t, i18n] = useTranslation("common");
  setheaderTitle(t("adminDashboard"));

  const history = useHistory();

  //variables for Relationship BUilder

  const [showRelationshipPopup, setShowRelationshipPopup] = useState(false);

  const [relationshipArray, setRelationshipArray] = useState([]);

  const [relationshipEntitiesOptions, setRelationshipEntitiesOptions] =
    useState({});

  const relationshipTemplete = {
    table1: "",
    table2: "",
    on: {
      table1Filter: "",
      table2Filter: "",
    },
    leftjoinCondition: "",
    rightjoinCondition: "",
  };

  const [allAppsAndModelsList, setAllAppsAndModelsList] = useState([]);

  //variables for querybuilder
  const [initialQuery, setInitialQuery] = useState({
    combinator: "and",
    rules: [],
  });

  const [query, setQuery] = useState(initialQuery);

  const [fields, setFields] = useState([]);

  const [entitityToBeEdited, setEntitityToBeEdited] = useState("");

  // variables for query popup
  const [showQueryPopup, setShowQueryPopup] = useState(false);

  const [dataModelName, setDataModelName] = useState("");
  const [reportAppNameSelected, setReportAppNameSelected] = useState("");

  // --------------------
  const [showEntities, setShowEntities] = useState(false);

  const [tableReportHeaders, setTableReportHeaders] = useState([]);
  const [tableReportData, setTableReportData] = useState([]);
  const [tableCurrentPage, setTableCurrentPage] = useState(1);

  const [allEntitiesDM, setAllEntitiesDM] = useState([]);
  const [reportTablesWithEntities, setReportTablesWithEntities] = useState([]);

  const [activeEntities, setActiveEntities] = useState([]);

  const [reportDataModels, setReportDataModels] = useState([]);

  //variables for accessibility

  const [showReportAccessibilityPopup, setShowReportAccessibilityPopup] =
    useState(false);

  const [accessUsersList, setAccessUsersList] = useState([]);
  const [accessGroupsList, setAccessGroupsList] = useState([]);

  // for reordering
  const [dragId, setDragId] = useState();

  // a variable to track if report get updated either in trial mode or draft mode

  const [isReportUpdated, setIsReportUpdated] = useState(1);

  //variables for pagination
  const [offset, setOffset] = useState(1);
  const [data, setData] = useState([]);
  const [perPage] = useState(10);
  const [pageCount, setPageCount] = useState(0);

  // USEEFFECTS

  // to redirect to reports page if user tries to access reportbuilder page
  useEffect(() => {
    let currentReportName = localStorage.getItem("currentreport");
    if (!currentReportName) {
      history.push({
        pathname: "/reports",
      });
    }
  }, []);

  useEffect(() => {
    console.log("callingupdatereportdata");
    updateReportData();
  }, [offset]);

  useEffect(() => {
    if (activeEntities.length != 0) {
      console.log("callingupdatereportdata");
      updateReportData();
    }
  }, [activeEntities]);

  useEffect(() => {
    setTimeout(() => {
      getReportMetadata();
    }, 1000);
  }, []);

  useEffect(() => {
    updateQueryBuilderEntities();
  }, [activeEntities, relationshipEntitiesOptions, reportTablesWithEntities]);

  useEffect(() => {
    manageReportTables(relationshipArray);
  }, [isReportUpdated]);

  // for accessibility

  useEffect(() => {
    populateAppsAndDataModels();
    getAllUsersAndGroups();
  }, []);

  //to be removed later after finalization of accessibility/role design
  const dropdownIcon = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        fill="#8A8A8A"
        class="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
      </svg>
    );
  };

  const updateQueryBuilderEntities = () => {
    console.log("updateqbentitiestrigerred");

    let queryBuilderEntities = [];
    activeEntities.map((entitiy) => {
      //adding appname and tablename to fields

      const appAndTableFinder = (keyword) => {
        console.log(
          "test",
          relationshipEntitiesOptions,
          reportTablesWithEntities
        );
        for (const property in reportTablesWithEntities) {
          console.log(`looping ${property}: ${relationshipEntitiesOptions}`);
          if (
            reportTablesWithEntities[property].allEntities.includes(keyword)
          ) {
            let appandtablename =
              reportTablesWithEntities[property].appName +
              "-" +
              reportTablesWithEntities[property].tableName;
            // return {appname: reportTablesWithEntities[property].appName, tablename: reportTablesWithEntities[property].tableName}
            return appandtablename;
          }
        }
      };
      let namewithmodelandtable = appAndTableFinder(
        entitiy.entitiyOriginalName
      );

      let field = {
        // name: entitiy.entitiyOriginalName,
        name: namewithmodelandtable + "." + entitiy.entitiyOriginalName,
        label: entitiy.entitiyName,
      };
      queryBuilderEntities.push(field);
    });

    console.log("queryfields", queryBuilderEntities);

    const querybuilderfilters = [
      { name: "=", label: "equals" },
      { name: "!=", label: "not equals" },
      { name: "<", label: "less than" },
      { name: ">", label: "greater then" },
      { name: "<=", label: "less than or equals" },
      { name: ">=", label: "greater than or equals" },
      { name: "contains", label: "contains" },
      { name: "beginsWith", label: "beginsWith" },
      { name: "endsWith", label: "endsWith" },
      { name: "doesNotContain", label: "doesNotContain" },
      { name: "doesNotBeginWith", label: "doesNotBeginWith" },
      { name: "doesNotEndWith", label: "doesNotEndWith" },
    ];

    queryBuilderEntities = queryBuilderEntities.map((qbfield) => {
      qbfield.operator = querybuilderfilters;
      return qbfield;
    });

    setFields(queryBuilderEntities);
  };

  //new implementation starts here

  //for dropping table or entity into active entities zone

  const onDrop = (data) => {
    let droppedType =
      data.entity == "" && data.table == ""
        ? "invalid"
        : data.entity == "" && data.table != ""
        ? "table"
        : data.entity != "" && data.table != ""
        ? "entity"
        : "invalid";

    if (droppedType == "invalid") {
      return;
    }

    if (droppedType == "table") {
      console.log("if table", data);
      let activeEntitiesTemp = [...activeEntities];
      let onlyActiveEntitiesName = activeEntitiesTemp.map((entitiy) => {
        return entitiy.entitiyName;
      });
      // console.log("alle", allEntitiesDM);

      let appname = data.table.split(".")[0];
      let tablename = data.table.split(".")[1];

      console.log("apptable", appname, tablename);

      let selectedTableData = reportTablesWithEntities.filter(
        (entitiy) =>
          entitiy.appName == appname && entitiy.tableName == tablename
      );

      console.log("std", selectedTableData[0].allEntities);

      let startingIndex = activeEntities.length;

      activeEntitiesTemp = selectedTableData[0].allEntities.map(
        (entity, index) => {
          // console.log("mapping", entity, activeEntitiesTemp.includes(entity));
          if (!onlyActiveEntitiesName.includes(entity.entitiyName)) {
            // console.log("if includes");
            let currentEntity = {};
            currentEntity.entitiyName = entity;
            currentEntity.entitiyOriginalName = entity;
            currentEntity.entityOrder = startingIndex + index + 1;
            return currentEntity;
          } else {
            // console.log("else includes");
            // return entity;
          }
        }
      );
      // console.log(activeEntitiesTemp);
      setActiveEntities(activeEntitiesTemp);
    } else if (droppedType == "entity") {
      console.log("if entity", data);
      let activeEntitiesTemp = [...activeEntities];
      let onlyActiveEntitiesName = activeEntitiesTemp.map((entitiy) => {
        return entitiy.entitiyName;
      });
      // console.log("intoelseif", data.entity);
      let entityarr = data.entity.split(".");
      let entitiyName = entityarr[1];
      if (!onlyActiveEntitiesName.includes(entitiyName)) {
        // console.log("activeentitieslength", activeEntities.length);
        setActiveEntities([
          ...activeEntities,
          {
            entityOrder: activeEntities.length + 1,
            entitiyName: entitiyName,
            entitiyOriginalName: entitiyName,
          },
        ]);
      }
    }
  };

  //

  const manageReportTables = async (allTables) => {
    try {
      let allTablesList = [];
      allTables.map((table) => {
        if (table.table1 && !allTablesList.includes(table.table1)) {
          allTablesList.push(table.table1);
        }
        if (table.table2 && !allTablesList.includes(table.table2)) {
          allTablesList.push(table.table2);
        }
      });

      console.log("Alltableslist", allTablesList);

      let reportTablesWithEntitiesTemp = await Promise.all(
        allTablesList.map(async (table) => {
          let appAndTable = table.split(".");

          let tableData = {};
          tableData.appName = appAndTable[0];
          tableData.tableName = appAndTable[1];
          tableData.allEntities = await getTableEnitities(appAndTable[1], appAndTable[0]);
          return tableData;
        })
      );

      // console.log("test", reportTablesWithEntitiesTemp);

      setReportTablesWithEntities(reportTablesWithEntitiesTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const getTableEnitities = async (reportModelName, reportAppName) => {
    console.log("gettableentitiescalled")
    let allAppsAndDbData = await getAppAndDatamodels();

    let alldata = allAppsAndDbData.data.collectionsWithSchema;
    let allAppsAndModels = [];
    for (const key in alldata) {
      for (let i = 0; i < alldata[key].length; i++) {
        allAppsAndModels.push(`${key}.${alldata[key][i]}`);
      }
    }

    const findappName = (dm) => {
      let val = allAppsAndModels.filter((f) => f.includes(dm));
      // console.log(val);
      let appname = val[0].split(".");
      return appname[0];
    };

    // let reportAppName = findappName(reportModelName);
    // let reportAppName = localStorage.getItem("currentreportappname");

    setDataModelName(reportModelName);
    setReportAppNameSelected(reportAppName);

    console.log("callinggetcollection", reportAppName, reportModelName);
    return getDataModelerFields(reportAppName, reportModelName).then(function (
      data
    ) {
      if (data.status == "success") {
        let allEntitiesarr = data.data[`${reportModelName}`];

        let allEntitiestemp = [];

        for (const key in allEntitiesarr) {
          // if (!key.includes("@") && !key.includes(".")) {
          allEntitiestemp.push(key);
          // }
        }

        return allEntitiestemp;
      }
    });
  };

  const getupdatedProjection = () => {
    console.log("intogetupdatedproj");
    let wantedEntities = activeEntities.map((entity) => {
      // console.log("testoriginal", entity);
      let keytemp =
        entity.entitiyName != ""
          ? entity.entitiyName
          : entity.entitiyOriginalName;
      let appNameAndTableName = reportDataModels[0].table1;

      appNameAndTableName = appNameAndTableName.replace(".", "-");

      const appAndTableFinder = (keyword) => {
        console.log(
          "test",
          relationshipEntitiesOptions,
          reportTablesWithEntities
        );
        for (const property in reportTablesWithEntities) {
          console.log(
            `looping ${property}: ${relationshipEntitiesOptions[property]}`
          );
          if (
            reportTablesWithEntities[property].allEntities.includes(keyword)
          ) {
            let appandtablename =
              reportTablesWithEntities[property].appName +
              "-" +
              reportTablesWithEntities[property].tableName;
            // return {appname: reportTablesWithEntities[property].appName, tablename: reportTablesWithEntities[property].tableName}
            return appandtablename;
          }
        }
      };

      appNameAndTableName = appAndTableFinder(entity.entitiyOriginalName);
      // appNameAndTableName = appNameAndTableName.replace(".", "-");
      let keyvaluetemp =
        `${appNameAndTableName}` + "." + `${entity.entitiyOriginalName}`;

      let tempArr = [];
      tempArr.push(keytemp);
      tempArr.push(keyvaluetemp);

      return tempArr;
    });

    const formattedEntities = Object.fromEntries(wantedEntities);

    // console.log("wantedentities", wantedEntities);

    // console.log("wantedobj", formattedEntities);

    return formattedEntities;
  };

  const getReportMetadata =async () => {
    try{
    // console.log("getreportmdata")
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReportMetaData`,
      headers: {
        reportName: localStorage.getItem("currentreport"),
        user: localStorage.getItem("username"),
      },
      data: data,
    };


    const response = await axios(config);


    
        // console.log("getreportmdataresp",JSON.stringify(response.data));
        // setReportMetaData(response.data);
        setReportDataModels(response.data.tables);

        let appNameAndTableName = response.data.tables[0].table1.split(".");
        let tableName = appNameAndTableName[1];
        // getTableEnitities(tableName);
        manageReportTables(response.data.tables);
        setRelationshipArray(response.data.tables);

        //for extracting entities of report
        if (response.data?.projection) {
          let projectionData = response.data.projection;
          var size = Object.keys(response.data.projection).length;
          if (size > 0) {
            let activeEntitiesTemp = Object.keys(response.data.projection);
            activeEntitiesTemp = activeEntitiesTemp.map((entitiy, index) => {
              let entityTemp = {};
              entityTemp.entitiyName = entitiy;
              let entitiyOriginalNameArr =
                projectionData[`${entitiy}`].split(".");
              entityTemp.entitiyOriginalName = entitiyOriginalNameArr[1]
                ? entitiyOriginalNameArr[1]
                : entitiy;
              entityTemp.entityOrder = index + 1;
              return entityTemp;
            });
            console.log("setting active entities after getreportmeteda");
            setActiveEntities(activeEntitiesTemp);
          }
        }

        // for persisiting queries
        if (response.data?.filter) {
          // let existingQuery = parseMongoDB(response.data.filter);
          //  change to be done after db chnage
          let existingQuery = parseSQL(response.data.filter);

          setInitialQuery(existingQuery);
          setQuery(existingQuery);
        }

        if (response.data.tables.length == 1) {
          let relationshipArrayTemp = [...relationshipArray];
          let firstRelation = response.data.tables[0];
          console.log("callinggetdatamodelfieldsinmetadata",response.data)
          updateEntitiesOptionsData(firstRelation.table1);
          if (!firstRelation.table2) {
            firstRelation.table2 = "";
          }
          if (!firstRelation.on) {
            firstRelation.on = {
              table1Filter: "",
              table2Filter: "",
            };
          }
          relationshipArrayTemp.push(firstRelation);
          setRelationshipArray(relationshipArrayTemp);
        }

            // handling multiple entities options
    let allTablesTemp = [];
    response.data.tables.forEach((table) => {
      allTablesTemp.push(table.table1);
      allTablesTemp.push(table.table2);
    });


    for (let i = 0; i < allTablesTemp.length; i++) {
      await updateEntitiesOptionsData(allTablesTemp[i]);
    }



        // setTimeout(() => {
        //   getReportData();
        //   // updateReportData();
        // }, 1000);
        getReportData();
    } catch(error){
      console.log(error)
    }
  
  };

  const getReportData = () => {
    let username = localStorage.getItem("username");
    let reportName = localStorage.getItem("currentreport");

    getReportDataHelper(reportName, username).then(function (data) {
      if (data.status == "success") {
        let reportData = data.data.data;
        // console.log("reportdata", reportData);
        let exisitingEntities = [];
        const ReportDataHeaders = Object.entries(reportData[0]).map((value) => {
          // console.log("valcrr", value);
          let currentHeader = {
            headerName: value[0],
            headerDataType: typeof value[1],
          };
          exisitingEntities.push(value[0].toLowerCase());
          return currentHeader;
        });

        // console.log("reportdata", reportData);
        // console.log("reportdata", ReportDataHeaders);

        setTableReportHeaders(ReportDataHeaders);
        // setTableReportHeaders(tempheaders);
        let datatobesend = reportData;
        // console.log("dtbs",datatobesend)
        setTableReportData(datatobesend);
        // getCollectionsSchema(exisitingEntities);

        // fetchUsersList();

        if (data.data?.metaData) {
          setPageCount(data.data.metaData.totalPages);
        }

        
      } else if (data.status == "fail") {
        console.log("error", data.error);
      }
    });
  };

  const updateReportData = () => {
    console.log("updatereportedatacalled");
    let reportName = localStorage.getItem("currentreport");
    let appName = reportAppNameSelected;

    let queries = formatQuery(query, { format: "sql", parseNumbers: true });
    let queriesToBeSend;
    let projection = getupdatedProjection();
    let username = localStorage.getItem("username");

    console.log("querystrbefore", JSON.stringify(queriesToBeSend));

    queriesToBeSend = queries.toString().replace(/-/g, "_");

    console.log("querystrafter", JSON.stringify(queriesToBeSend));

    console.log("qr", queries);

    let tableToBeSend = reportDataModels;

    // let relationshipArrayTemp = [...relationshipArray]

  let  relationshipArrayToBeSend = relationshipArray.map((relation) => {
      let thisRelation = {...relation}
      if(relation.leftjoinCondition == "full" && relation.rightjoinCondition == "matched"){
        thisRelation.joinType = "left"
      }
      else if(relation.leftjoinCondition == "matched" && relation.rightjoinCondition == "full"){
        thisRelation.joinType = "right"
      }
      else if(relation.leftjoinCondition == "full" && relation.rightjoinCondition == "full"){
        thisRelation.joinType = "outer"
      }
      else {
        thisRelation.joinType = "inner"
      }

      delete thisRelation.leftjoinCondition
      delete thisRelation.rightjoinCondition

      return thisRelation
    })


    if (relationshipArray.length != 0) {
      tableToBeSend = relationshipArrayToBeSend;
    }

    if (relationshipArray.length == 1) {
      if (!relationshipArray[0].table2) {
        let firstRelation = {
          table1: relationshipArray[0].table1,
        };
        tableToBeSend = [firstRelation];
      }
    }

    updateAndGetReportData(
      reportName,
      // reportDataModels,
      tableToBeSend,
      queriesToBeSend,
      projection,
      username,
      appName,
      offset
    ).then((data) => {
      if (data.status == "success") {
        let reportData = data.data.data;
        // console.log("reportdata", data.daa);
        let exisitingEntities = [];
        if (reportData && reportData.length >0 && reportData[0]) {
          const ReportDataHeaders = Object.entries(reportData[0]).map(
            (value) => {
              // console.log("valcrr", value);
              let currentHeader = {
                headerName: value[0],
                headerDataType: typeof value[1],
              };
              exisitingEntities.push(value[0].toLowerCase());
              return currentHeader;
            }
          );

          // console.log("reportdata", reportData);
          // console.log("reportdata", ReportDataHeaders);

          setTableReportHeaders(ReportDataHeaders);
          // setTableReportHeaders(tempheaders);
          let datatobesend = reportData;
          setTableReportData(datatobesend);
          // getCollectionsSchema(exisitingEntities);

          setIsReportUpdated(isReportUpdated + 1);

          if (data.data?.metaData) {
            setPageCount(data.data.metaData.totalPages);
          }
        } else {
          setTableReportData([]);
        }
      } else {
        console.log(data.error);
      }
    });
  };

  //for handling pagination
  const handlePageClick = (e) => {
    const selectedPage = e.selected;
    setOffset(selectedPage + 1);
  };

  const saveAsDraft = () => {
    let reportName = localStorage.getItem("currentreport");
    let appName = localStorage.getItem("reportAppName");
    // let queries = formatQuery(query, { format: "mongodb", parseNumbers: true });
    //  to be changed to this after db chnage
    let queries = formatQuery(query, { format: "sql", parseNumbers: true });
    let queriesToBeSend;
    let projection = getupdatedProjection();
    let username = localStorage.getItem("username");

    queriesToBeSend = queries.toString().replace(/-/g, "_");
    // console.log("qr", queries);

    let tableToBeSend = reportDataModels;

    if (relationshipArray.length != 0) {
      tableToBeSend = relationshipArray;
    }

    if (relationshipArray.length == 1) {
      if (!relationshipArray[0].table2) {
        let firstRelation = {
          table1: relationshipArray[0].table1,
        };
        tableToBeSend = [firstRelation];
      }
    }

    updateReportMetaData(
      reportName,
      tableToBeSend,
      queriesToBeSend,
      projection,
      username
    ).then((data) => {
      if (data.status == "success") {
        toast.success(`Report Saved`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  // for accessibility - publish comes under update accessibility

  const getReportAccessibility = (allUsersList, allGroupsList) => {
    let reportName = localStorage.getItem("currentreport");
    let username = localStorage.getItem("username");

    // console.log("allusers", allUsersList);
    // console.log("groups", allGroupsList);
    let reportStatus = localStorage.getItem("currentReportStatus");

    getReportAccessibilityHelper(reportName, username, reportStatus).then(
      (data) => {
        if (data.status == "success") {
          let usersListTemp = data.data.userName;

          let reportAccessibileUsers = [];
          usersListTemp = usersListTemp.map((user) => {
            return { username: user, isSelected: false };
          });

          allUsersList.map((user) => {
            usersListTemp.map((currentUser) => {
              if (user.username == currentUser.username) {
                user.isSelected = true;
              }
            });

            reportAccessibileUsers.push(user);
          });

          let groupsListTemp = data.data.group;

          let reportAccessibileGroups = [];
          groupsListTemp = groupsListTemp.map((group) => {
            return { groupname: group, isSelected: true };
          });

          allGroupsList.map((group) => {
            groupsListTemp.map((currentGroup) => {
              if (group.name == currentGroup.name) {
                group.isSelected = true;
              }
            });

            reportAccessibileGroups.push(group);
          });

          setAccessUsersList(reportAccessibileUsers);
          setAccessGroupsList(reportAccessibileGroups);
        } else {
          console.log("error", data.error);
          toast.error(`Accesibilty settings couldn't be fetched`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    );
  };

  const updateReportAccessibility = () => {
    let reportName = localStorage.getItem("currentreport");
    let usersList = accessUsersList
      .filter((user) => user.isSelected == true)
      .map((user) => user.username);
    let groupsList = accessGroupsList
      .filter((group) => group.isSelected == true)
      .map((group) => group.groupname);
    let username = localStorage.getItem("username");
    updateReportAccessibilityHelper(
      reportName,
      usersList,
      groupsList,
      username
    ).then((data) => {
      if (data.status == "success") {
        toast.success(`Accesibilty settings updated`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        toast.success(`Report Published Successfully`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setShowReportAccessibilityPopup(false);
        // fetchUsersList();
      } else {
        toast.error(`Accesibilty settings couldn't be updated`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  const fetchUsersList = async (token) => {
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/user/fetchallusers`,
      headers: {
        access_token: `${token}`,
      },
    };

    return await axios(config)
      .then(function (response) {
        // console.log(response.data);

        let allUsersList = response.data.map((user) => {
          return {
            username: user.username,
            isSelected: false,
          };
        });

        // getReportAccessibility(allUsersList)
        return allUsersList;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const fetchWorkgroupsList = async (token) => {
    var config = {
      method: "get",
      url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/group/fetchallgroups`,
      headers: {
        access_token: `${token}`,
      },
    };

    return await axios(config)
      .then(function (response) {
        let allGroupsList = response.data.map((group) => {
          return {
            groupname: group.name,
            isSelected: false,
          };
        });

        // getReportAccessibility(allUsersList)
        return allGroupsList;
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getAllUsersAndGroups = () => {
    let token = localStorage.getItem("token");
    // fetchUsersList(token);

    const allusers = fetchUsersList(token);
    const allGroups = fetchWorkgroupsList(token);

    Promise.all([allusers, allGroups]).then((responses) => {
      getReportAccessibility(responses[0], responses[1]);
    });
  };

  const handleUsersListChange = (e) => {
    const { name, checked, id } = e.target;
    let currentUser = localStorage.getItem("username");
    if (name === "allSelect") {
      let usersListTemp = accessUsersList.map((user) => {
        if (user.username == currentUser) {
          return { ...user };
        } else {
          return { ...user, isChecked: checked, [id]: checked };
        }
      });
      setAccessUsersList(usersListTemp);
    } else {
      let usersListTemp = accessUsersList.map((user) =>
        user.username === name
          ? { ...user, isChecked: checked, [id]: checked }
          : user
      );
      setAccessUsersList(usersListTemp);
    }
  };

  const handleGroupsListChange = (e) => {
    const { name, checked, id } = e.target;
    if (name === "allSelect") {
      let groupsListTemp = accessGroupsList.map((group) => {
        return { ...group, isChecked: checked, [id]: checked };
      });
      setAccessGroupsList(groupsListTemp);
    } else {
      let groupsListTemp = accessGroupsList.map((group) =>
        group.groupname === name
          ? { ...group, isChecked: checked, [id]: checked }
          : group
      );
      setAccessGroupsList(groupsListTemp);
    }
  };

  //for report download
  const requestReportDownload = (fileType) => {
    let reportName = localStorage.getItem("currentreport");
    let username = localStorage.getItem("username");

    initiateReportGeneration(reportName, fileType, username).then((data) => {
      if (data.status == "success") {
        getReportsGeneratedData();
        toast.success(
          `your report generation has initiated! file will be downloaded once generated`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      } else {
        toast.error(
          `Something went wrong, report generation could't be initiated`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    });
  };

  const getReportsGeneratedData = () => {
    let username = localStorage.getItem("username");
    let reportName = localStorage.getItem("currentreport");

    let timesApiCalled = 0;

    let intervalId = setInterval(() => {
      getReportDownloadHistory(username).then((data) => {
        timesApiCalled = timesApiCalled + 1;
        if ((data.status = "success")) {
          let allReports = data.data;
          // console.log("allreports", allReports);

          let thisReport = data.data.filter(
            (report) => report.reportName == reportName
          );

          // console.log("allreports", thisReport);

          if (thisReport[0].status == "Completed") {
            clearInterval(intervalId);
            downloadTheFile(thisReport[0].fileURL, thisReport[0].fileType);
          } else if (timesApiCalled > 6) {
            clearInterval(intervalId);
            toast.error(`file could not be downloaded, please try again`, {
              position: "bottom-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }
      });
    }, 5000);
  };

  const downloadTheFile = (fileUrl, fileExtension) => {
    var axios = require("axios");

    let fileExt = fileExtension == "excel" ? "xlsx" : fileExtension;

    var config = {
      method: "get",
      headers: {},
    };

    let fetchRes = fetch(fileUrl, config);

    fetchRes
      .then((response) => {
        // console.log(JSON.stringify(response.data));

        response.blob().then((blob) => {
          // console.log(blob);
          const fileURL = window.URL.createObjectURL(blob);
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.download = `${localStorage.getItem(
            "currentreport"
          )}.${fileExt}`;
          alink.click();
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // func for reordering

  const handleDrag = (ev) => {
    // console.log("dragstart", ev.currentTarget);
    setDragId(ev.currentTarget.id);
    // console.log("ae", activeEntities);
  };

  const handleDrop = (ev) => {
    // console.log("dragid", dragId);
    // console.log("hdrop", ev.currentTarget, ev.currentTarget != null);
    if (dragId) {
      // console.log("hd", activeEntities, dragId);

      const dragBox = activeEntities.find(
        (entitiy) => entitiy.entitiyName == dragId
      );
      const dropBox = activeEntities.find(
        (entitiy) => entitiy.entitiyName == ev.currentTarget.id
      );

      // console.log("dragbox",dragBox)
      const dragBoxOrder = dragBox.entityOrder;
      const dropBoxOrder = dropBox.entityOrder;
      // console.log("dragbox", dragBoxOrder, dropBoxOrder);
      // console.log("nbx sttart", activeEntities);
      const newBoxState = activeEntities.map((entitiy) => {
        if (entitiy.entitiyName == dragId) {
          entitiy.entityOrder = dropBoxOrder;
        }
        if (entitiy.entitiyName == ev.currentTarget.id) {
          entitiy.entityOrder = dragBoxOrder;
        }
        return entitiy;
      });

      // console.log("nbx", newBoxState);

      setActiveEntities(newBoxState);
    }
  };

  // for realationshipbuilder

  const handleAddrelation = () => {
    setRelationshipArray([...relationshipArray, relationshipTemplete]);
  };

  const handleRelationshipTableSelection = (
    relationshipIndex,
    tableNum,
    selectedOption
  ) => {
    let relationshipArrayTemp = [...relationshipArray];

    relationshipArrayTemp[relationshipIndex][`${tableNum}`] = selectedOption;

    setRelationshipArray(relationshipArrayTemp);
    updateEntitiesOptionsData(selectedOption);
  };

  const handleRelationshipJoinSelection = (
    relationshipIndex,
    tableNum,
    selectedOption
  ) => {
    let relationshipArrayTemp = [...relationshipArray];

    relationshipArrayTemp[relationshipIndex][`${tableNum}`] = selectedOption;

    setRelationshipArray(relationshipArrayTemp);
    updateEntitiesOptionsData(selectedOption);
  };

  // const updateEntitiesOptionsData = (appAndDataModel) => {
  //   let appAndDataModelArr = appAndDataModel.split(".");
  //   let appname = appAndDataModelArr[0];
  //   let datamodelname = appAndDataModelArr[1];

  //   let relationshipEntitiesOptionsTemp = { ...relationshipEntitiesOptions };
  //   console.log("callinggetdatamodelfields",appname,datamodelname)
  //   getDataModelerFields(appname, datamodelname).then((data) => {
  //     if (data.status == "success") {
  //       // console.log("alldata", JSON.stringify(data.data));
  //       let allEntitiesarr = data.data[`${datamodelname}`];

  //       // console.log(allEntitiesarr, reportModelName);

  //       let allEntitiestemp = [];

  //       for (const key in allEntitiesarr) {
  //         console.log("k", key);
  //         if (!key.includes("@") && !key.includes(".")) {
  //           allEntitiestemp.push(key);
  //         }
  //       }
  //       console.log("allllll", allEntitiestemp, relationshipEntitiesOptionsTemp);
  //       relationshipEntitiesOptionsTemp[`${appAndDataModel}`] = allEntitiestemp;
  //       setRelationshipEntitiesOptions(relationshipEntitiesOptionsTemp);
  //     }
  //   });
  // };

  const updateEntitiesOptionsData = async (appAndDataModel) => {
    return new Promise(async (resolve, reject) => {
      try {
        const appAndDataModelArr = appAndDataModel.split(".");
        const appname = appAndDataModelArr[0];
        const datamodelname = appAndDataModelArr[1];
  
        const data = await getDataModelerFields(appname, datamodelname);
        
        if (data.status === "success") {
          const allEntitiesarr = data.data[datamodelname];
          const allEntitiestemp = [];
  
          for (const key in allEntitiesarr) {
            if (!key.includes("@") && !key.includes(".")) {
              allEntitiestemp.push(key);
            }
          }
  
          setRelationshipEntitiesOptions((prevOptions) => ({
            ...prevOptions,
            [appAndDataModel]: allEntitiestemp,
          }));
  
          resolve(); // Resolve the promise when done
        }
      } catch (error) {
        console.error(error);
        reject(error); // Reject the promise on error
      }
    });
  };
  

  const handleRelationshipTableEntitySelection = (
    relationshipIndex,
    tableFilterNum,
    selectedOption
  ) => {
    let relationshipArrayTemp = [...relationshipArray];

    if (relationshipArrayTemp[relationshipIndex].on) {
      relationshipArrayTemp[relationshipIndex].on[`${tableFilterNum}`] =
        selectedOption;
    } else if (!relationshipArrayTemp[relationshipIndex].on) {
      relationshipArrayTemp[relationshipIndex].on = {
        table1Filter: "",
        table2Filter: "",
      };
      relationshipArrayTemp[relationshipIndex].on[`${tableFilterNum}`] =
        selectedOption;
    }
    setRelationshipArray(relationshipArrayTemp);
  };

  const handleRemoveRelation = (relationIndex) => {
    if (relationIndex == 0) {
      let relationshipArrayTemp = [...relationshipArray];

      if (relationshipArrayTemp.length > 1) {
        toast.error(
          `This is the base relation, it can only be removed when all other relations are deleted`,
          {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
        return;
      } else if (relationshipArrayTemp.length == 1) {
        if (relationshipArrayTemp[0].table2) {
          delete relationshipArrayTemp[0].table2;
        }
        if (relationshipArrayTemp[0].on) {
          delete relationshipArrayTemp[0].on;
        }

        setRelationshipArray(relationshipArrayTemp);
        // setIsReportUpdated(isReportUpdated + 1)
      }
    } else if (relationIndex > 0) {
      let relationshipArrayTemp = [...relationshipArray];

      relationshipArrayTemp.splice(relationIndex, 1);

      setRelationshipArray(relationshipArrayTemp);
    }
  };

  const populateAppsAndDataModels = () => {
    getAppAndDatamodels().then((data) => {
      if (data.status == "success") {
        let alldata = data.data.collectionsWithSchema;

        // console.log(alldata);

        let allAppsAndModels = [];

        for (const key in alldata) {
          let currentData = {};

          // console.log(`${key}: ${alldata[key].length}`);

          currentData.appName = key;

          let appsPresent = [];

          for (let i = 0; i < alldata[key].length; i++) {
            // console.log(alldata[key][i]);
            appsPresent.push(alldata[key][i]);
          }
          currentData.dataModelsList = appsPresent;

          allAppsAndModels.push(currentData);
        }
        // console.log(allAppsAndModels);
        setAllAppsAndModelsList(allAppsAndModels);
      } else {
        toast.error(`Unable to fetch Apps and Data Models list`, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    });
  };

  //breaking popups into components

  const RelationshipBuilderPopupSection = () => {
    return (
      <CommonModelContainer
        modalTitle={"Add Data Model and Relationship"}
        show={showRelationshipPopup}
        handleClose={() => setShowRelationshipPopup(false)}
        className="realtionship-modal "
      >
        <div className="realtionship-modal-body col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div className="relationship-top-container d-flex justify-content-end">
            <button
              className="btn-addDataModel px-2 primaryButtonColor"
              onClick={() => handleAddrelation()}
            >
              <img src={AddDataModelIcon} className="mx-2" />
              Add Data Model
            </button>
          </div>
          <div className="relationship-content-container px-3">
            {relationshipArray.map((relation, relationIndex) => {
              return (
                <div className="and-block mt-3">
                  <div className="d-flex flex-row">
                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select
                        name="entities"
                        className="query-dropdown"
                        onChange={(e) =>
                          // handleTableOneSelection(e.target.value)
                          handleRelationshipTableSelection(
                            relationIndex,
                            "table1",
                            e.target.value
                          )
                        }
                      >
                        {allAppsAndModelsList.map((app) => {
                          return (
                            <optgroup label={app.appName}>
                              {app.dataModelsList.map((dataModel) => {
                                return (
                                  <option
                                    value={`${app.appName}.${dataModel}`}
                                    selected={
                                      relation.table1 ==
                                      `${app.appName}.${dataModel}`
                                        ? true
                                        : false
                                    }
                                  >
                                    {dataModel}
                                  </option>
                                );
                              })}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select
                        name="test"
                        id="test"
                        className="query-dropdown"
                        onChange={(e) =>
                          handleRelationshipTableEntitySelection(
                            relationIndex,
                            "table1Filter",
                            e.target.value
                          )
                        }
                      >
                        <option selected disabled>
                          Select Entity
                        </option>
                        {relationshipEntitiesOptions[`${relation.table1}`] &&
                          relationshipEntitiesOptions[`${relation.table1}`].map(
                            (entitiy) => {
                              console.log("col1", relation.on?.table2Filter , entitiy)
                              return (
                                <option
                                  value={entitiy}
                                  selected={
                                    relation.on?.table1Filter == entitiy
                                  }
                                >
                                  {entitiy}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select
                        name="test"
                        id="test"
                        className="query-dropdown"
                        onChange={(e) =>
                          handleRelationshipJoinSelection(
                            relationIndex,
                            "leftjoinCondition",
                            e.target.value
                          )
                        }
                      >
                        <option disabled selected>
                          select relation type
                        </option>
                        <option value="full"  selected={relation?.rightjoinCondition == "full"}>full</option>
                        <option value="matched"  selected={relation?.rightjoinCondition == "matched"}>matched</option>
                      </select>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select name="test" id="test" className="query-dropdown">
                        <option selected>==</option>
                      </select>
                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select
                        name="test"
                        id="test"
                        className="query-dropdown"
                        onChange={(e) =>
                          // handleTableTwoSelection(e.target.value)
                          handleRelationshipTableSelection(
                            relationIndex,
                            "table2",
                            e.target.value
                          )
                        }
                      >
                        <option selected disabled>
                          Select Table
                        </option>
                        {allAppsAndModelsList.map((app) => {
                          return (
                            <optgroup label={app.appName}>
                              {app.dataModelsList.map((dataModel) => {
                                return (
                                  <option
                                    value={`${app.appName}.${dataModel}`}
                                    selected={
                                      relation.table2 ==
                                      `${app.appName}.${dataModel}`
                                        ? true
                                        : false
                                    }
                                    
                                  >
                                    {dataModel}
                                  </option>
                                );
                              })}
                            </optgroup>
                          );
                        })}
                      </select>
                    </div>
                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select
                        name="test"
                        id="test"
                        className="query-dropdown"
                        onChange={(e) =>
                          handleRelationshipTableEntitySelection(
                            relationIndex,
                            "table2Filter",
                            e.target.value
                          )
                        }
                      >
                        <option selected disabled>
                          Select Entity
                        </option>
                        {relationshipEntitiesOptions[`${relation.table2}`] &&
                          relationshipEntitiesOptions[`${relation.table2}`].map(
                            (entitiy) => {
                              // console.log("col2", relation.on?.table2Filter , entitiy)
                              return (
                                <option
                                  value={entitiy}
                                  selected={
                                    relation.on?.table2Filter == entitiy
                                  }
                                >
                                  {entitiy}
                                </option>
                              );
                            }
                          )}
                      </select>
                    </div>

                    <div
                      className="d-flex justify-content-center align-items-center ms-3"
                      style={{ height: "100%" }}
                    >
                      <select name="test" id="test" className="query-dropdown"
                        onChange={(e) =>
                          handleRelationshipJoinSelection(
                            relationIndex,
                            "rightjoinCondition",
                            e.target.value
                          )
                        }
                      >
                        <option disabled selected>
                        select relation type
                        </option>
                        <option value="full" selected={relation?.rightjoinCondition == "full"}>full</option>
                        <option value="matched"  selected={relation?.rightjoinCondition == "matched"}>matched</option>
                      </select>
                    </div>

                    <div className="ms-5 d-flex justify-content-center">
                      <img
                        src={DeleteQuery}
                        onClick={() => {
                          handleRemoveRelation(relationIndex);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="relationship-button-container d-flex justify-content-end">
            <button
              className="primaryButton primaryButtonColor"
              onClick={() => {
                updateReportData();
                console.log(
                  "relArr",
                  relationshipArray,
                  relationshipEntitiesOptions
                );
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </CommonModelContainer>
    );
  };

  const QueryBuilderPopupSection = () => {
    return (
      <CommonModelContainer
        modalTitle={"Add Query"}
        show={showQueryPopup}
        handleClose={() => setShowQueryPopup(false)}
        className="query-modal"
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          <div
            className="react-querybuilder-custom d-flex justify-content-center"
            style={{ display: "flex", flex: 0.9 }}
          >
            <QueryBuilder
              controlClassnames={{ queryBuilder: "queryBuilder-branches" }}
              fields={fields}
              query={query}
              onQueryChange={(q) => setQuery(q)}
            />
          </div>

          {/* <h4>Query</h4>
          <pre>
            <code>{formatQuery(query, "mongodb")}</code>
          </pre> */}

          <div
            className=" d-flex justify-content-end"
            style={{ display: "flex", flex: 0.1 }}
          >
            <button
              className="primaryButton primaryButtonColor mt-3 mb-3"
              onClick={() => {
                updateReportData();
                setShowQueryPopup(false);
              }}
            >
              Apply
            </button>
          </div>
        </div>
      </CommonModelContainer>
    );
  };

  const ReportAccessibilityPopupSection = () => {
    return (
      <CommonModelContainer
        modalTitle={"Report Settings"}
        show={showReportAccessibilityPopup}
        handleClose={() => setShowReportAccessibilityPopup(false)}
        className="report-accessibility-modal"
      >
        <div className="container">
          <div className="row">
            <div>Who can access the report ?</div>
          </div>
          <div className="row mt-3">
            <div className="d-flex flex-row justify-content-between">
              <div style={{ width: "100%" }} className="mx-3">
                <button
                  className="dropdown-toggle customDropdownBtn"
                  id="reportAccessUsers"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Actor
                  {dropdownIcon()}
                </button>
                <div
                  class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                  aria-labelledby="reportAccessUsers"
                >
                  <form className="form">
                    <div className="form-check dropdown-option-container">
                      <label className="accessibility-allselect secondaryColor">
                        All Select
                      </label>
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        name="allSelect"
                        checked={
                          !accessUsersList.some(
                            (user) => user?.isSelected !== true
                          )
                        }
                        id="isSelected"
                        onChange={handleUsersListChange}
                      ></input>
                    </div>
                    {accessUsersList.length !== 0 &&
                      accessUsersList.map((user, index) => {
                        if (user.username !== localStorage.getItem("username"))
                          return (
                            <div className="form-check dropdown-option-container">
                              <label className="accessibility-allselect secondaryColor">
                                <span className="secondaryColor" data-tip data-for={user.username}>
                                  {user.username.substring(0, 15)}
                                  {user.username.length > 15 && (
                                    <span className="secondaryColor">...</span>
                                  )}
                                </span>
                                {user.username.length > 15 && (
                                  <ReactTooltip
                                    id={user.username}
                                    place="bottom"
                                    className="tooltipCustom"
                                    arrowColor="rgba(0, 0, 0, 0)"
                                    effect="float"
                                  >
                                    <span className="accessibility-username secondaryColor">
                                      {user.username}
                                    </span>
                                  </ReactTooltip>
                                )}
                              </label>
                              <input
                                type="checkbox"
                                className="form-check-input me-3"
                                name={user.username}
                                checked={user?.isSelected || false}
                                id="isSelected"
                                onChange={handleUsersListChange}
                              ></input>
                            </div>
                          );
                      })}
                  </form>
                </div>
              </div>

              <div style={{ width: "100%" }} className="mx-3">
                <button
                  className="dropdown-toggle customDropdownBtn"
                  id="reportAccessGroups"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Group
                  {dropdownIcon()}
                </button>
                <div
                  class="dropdown-menu customScrollBarAccessibilityDropdown dropdown-menu-scroll dropdown-area dropdown-menu-container"
                  aria-labelledby="reportAccessGroups"
                >
                  <form className="form">
                    <div className="form-check dropdown-option-container">
                      <label className="accessibility-allselect secondaryColor">
                        All Select
                      </label>
                      <input
                        type="checkbox"
                        className="form-check-input me-3"
                        name="allSelect"
                        checked={
                          !accessGroupsList.some(
                            (group) => group?.isSelected !== true
                          )
                        }
                        id="isSelected"
                        onChange={handleGroupsListChange}
                      ></input>
                    </div>
                    {accessGroupsList.length !== 0 &&
                      accessGroupsList.map((group, index) => {
                        return (
                          <div className="form-check dropdown-option-container">
                            <label className="accessibility-allselect secondaryColor">
                              <span className="secondaryColor" data-tip data-for={group.groupname}>
                                {group.groupname.substring(0, 15)}
                                {group.groupname.length > 15 && (
                                  <span>...</span>
                                )}
                              </span>
                              {group.groupname.length > 15 && (
                                <ReactTooltip
                                  id={group.groupname}
                                  place="bottom"
                                  className="tooltipCustom"
                                  arrowColor="rgba(0, 0, 0, 0)"
                                  effect="float"
                                >
                                  <span className="accessibility-username secondaryColor">
                                    {group.groupname}
                                  </span>
                                </ReactTooltip>
                              )}
                            </label>
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              name={group.groupname}
                              checked={group?.isSelected || false}
                              id="isSelected"
                              onChange={handleGroupsListChange}
                            ></input>
                          </div>
                        );
                      })}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="d-flex justify-content-end">
              <button
                className="primaryButton primaryButtonColor mt-5"
                onClick={() => updateReportAccessibility()}
              >
                Save and Publish
              </button>
            </div>
          </div>
        </div>
      </CommonModelContainer>
    );
  };

  const ActiveDataModelsSection = () => {
    console.log("len", reportTablesWithEntities.length);
    // if (reportTablesWithEntities.length > 0) {

    return (
      <div className="" style={{ flex: 0.95 }}>
        <div className="datamodel-heading">Data Model</div>

        {reportTablesWithEntities.map((reporttable, reporttableIndex) => {
          return (
            <>
              <div
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #E5E5E5",
                  borderRadius: "4px",
                  padding: "5px",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                onClick={() => setShowEntities(!showEntities)}
              >
                <div>
                  {/* Data Model Name */}
                  {reporttable.appName}
                </div>
              </div>

              <div className="mt-2">
                <Draggable
                  type="table"
                  data={`${reporttable.appName}.${reporttable.tableName}`}
                >
                  <div className="datamodel-table">
                    <div className="datamodel-header px-3 d-flex flex-row">
                      <div>
                        <img src={DataModelHeaderIcon} />
                      </div>
                      <div className="ms-1 d-flex align-items-center data-model-header">
                        {/* table heading */}
                        {reporttable.tableName} Details
                      </div>
                    </div>
                    <div className="px-2 pt-2 pb-3 datamodel-body">
                      <div>
                        {reporttable.allEntities.map((entitiy) => {
                          let dropData = `tablename.${entitiy}`;
                          return (
                            <Draggable type="entity" data={dropData}>
                              <div className="entity-card mt-1 px-2 py-1 d-flex bd-highlight">
                                <div className="bd-highlight d-flex justify-content-center">
                                  <img src={EntityIcon} />
                                </div>
                                <div className="bd-highlight ms-1 d-flex justify-content-center">
                                  {entitiy}
                                </div>
                                <div className="ms-auto bd-highlight d-flex justify-content-center">
                                  <img src={DragIcon} />
                                </div>
                              </div>
                            </Draggable>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Draggable>
              </div>
            </>
          );
        })}
      </div>
    );
    // }
  };

  return (
    <>
      <div style={{ marginTop: "10vh" }}>
        <div className="container-fluid">
          {/* this is for breadcrums */}
          <div className="row pt-3">
            <div
              className="col-md-6"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <div className="ms-2">
                <div className="breadCrum BodyColor" style={{ paddingTop: "0px" }}>
                  <Link to="/">
                    <img src={Home} alt="" />
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <Link to="/reports" disable>
                    <h6 className="primaryColor" style={{ color: " #0c83bf", letterSpacing: "1px" }}>
                      Report Builder
                    </h6>
                  </Link>
                  <h6 className="primaryColor">{">>"}</h6>
                  <Link to={null}>
                    <h6 className="primaryColor">{localStorage.getItem("currentreport")}</h6>
                  </Link>
                </div>
              </div>
            </div>
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div className="my-1">
                <button
                  className="secondaryButton secondaryButtonColor mx-2"
                  // onClick={() => saveAndPublish("draft")}
                  onClick={() => saveAsDraft()}
                >
                  Save as draft
                </button>
                {/* <button
                  className="primaryButton mx-2"
                  // onClick={() => saveAndPublish("published")}
                >
                  Publish
                </button> */}

                {/* <button
                  className="bg-info mx-2"
                  style={{ borderRadius: "4px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "30px",
                      width: "30px",
                      borderRadius: "4px",
                      backgroundColor: "#D9D9D9",
                      boxShadow: "2px 3px 3px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <Dropdown className="report-download-iconContainer">
                      <Dropdown.Toggle
                        variant=""
                        className="p-0 table-dropdown-toggle-btn report-download-iconContainer"
                        id="dropdown-basic"
                      >
                        <img src={DownloadIcon} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => requestReportDownload("pdf")}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            PDF
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => requestReportDownload("excel")}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            Excel
                          </span>
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => requestReportDownload("csv")}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: "400",
                            }}
                          >
                            CSV
                          </span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </button> */}
              </div>
            </div>
          </div>
        </div>

        <hr />

        <div className="container-fluid">
          <div className="row">
            <div
              className="col-md-2 "
              style={{
                height: "75vh",
                borderRight: "1px solid #E5E5E5",
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              {ActiveDataModelsSection()}

              <div
                style={{ flex: 0.05 }}
                className=" d-flex justify-content-center"
              >
                <button
                  className="btn_addDataModel primaryButtonColor px-4 py-1"
                  onClick={
                    () => setShowRelationshipPopup(true)
                    // console.log(reportTablesWithEntities)
                  }
                >
                  Add Data Model
                </button>
              </div>
            </div>
            <div className="col-md-10">
              <div className="">
                <div className="report-settings-section py-4 px-5">
                  <div className="container">
                    <div className="row">
                      <div className="drag-message">
                        Drag and drop the required data fields in this section
                      </div>
                      <div style={{ fontSize: "10px" }}>
                        Double click to edit entity names
                      </div>
                    </div>
                    <div className="row mt-3 ms-2">
                      <div className="active-fields-container col-md-9 col-lg-9 px-2 py-1">
                        <Droppable
                          className="py-2"
                          types={["entity", "table"]} // <= allowed drop types
                          onDrop={onDrop}
                          style={{
                            width: "100%",
                          }}
                        >
                          <div
                            style={{
                              height: "20px",
                              display: "flex",
                              flexDirection: "row",
                              width: "100%",
                            }}
                          >
                            {activeEntities
                              .sort((a, b) => a.entityOrder - b.entityOrder)
                              .map((entitiy, index) => {
                                return (
                                  <div
                                    draggable={true}
                                    id={entitiy.entitiyName}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDragStart={handleDrag}
                                    onDrop={handleDrop}
                                    className="active-entity px-1 py-1 mx-1 d-flex flex-row align-items-center "
                                  >
                                    <div className="d-flex justify-content-center">
                                      <img src={EntityActiveIcon} />
                                    </div>
                                    <div
                                      className="active-entity-name"
                                      onDoubleClickCapture={() =>
                                        setEntitityToBeEdited(
                                          entitiy.entityOrder
                                        )
                                      }
                                    >
                                      <input
                                        value={entitiy.entitiyName}
                                        className="activeEntityInput"
                                        disabled={
                                          entitiy.entityOrder ==
                                          entitityToBeEdited
                                            ? false
                                            : true
                                        }
                                        onChange={(e) => {
                                          let entitiesTemp = [
                                            ...activeEntities,
                                          ];
                                          entitiesTemp = entitiesTemp.map(
                                            (entitiy, entitiyIndex) => {
                                              if (entitiyIndex == index) {
                                                entitiy.entitiyName =
                                                  e.target.value;
                                                return entitiy;
                                              } else {
                                                return entitiy;
                                              }
                                            }
                                          );
                                          setActiveEntities(entitiesTemp);
                                        }}
                                      />
                                      {/* {entitiy.entitiyName} */}
                                    </div>
                                    <div className="ms-2 d-flex justify-content-center">
                                      <img
                                        src={DeleteIcon}
                                        onClick={() => {
                                          let removedIndex =
                                            activeEntities.findIndex(
                                              (e) =>
                                                e.entitiyName ===
                                                entitiy.entitiyName
                                            );

                                          let remainingEntities =
                                            activeEntities.filter(
                                              (e) =>
                                                e.entitiyName !==
                                                entitiy.entitiyName
                                            );

                                          remainingEntities =
                                            remainingEntities.map(
                                              (entitiy, index) => {
                                                if (
                                                  index == removedIndex ||
                                                  index > removedIndex
                                                ) {
                                                  entitiy.entityOrder =
                                                    entitiy.entityOrder - 1;
                                                  return entitiy;
                                                } else {
                                                  return entitiy;
                                                }
                                              }
                                            );

                                          setActiveEntities(remainingEntities);
                                        }}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </Droppable>
                      </div>
                    </div>
                  </div>
                  <div className="container mt-3 ms-2">
                    <div className="">
                      <button
                        className="primaryButton primaryButtonColor"
                        onClick={() => setShowQueryPopup(true)}
                      >
                        Add query
                      </button>
                      <button
                        className="primaryButton primaryButtonColor ms-4"
                        onClick={() => setShowReportAccessibilityPopup(true)}
                      >
                        Report settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* table view  */}
                <div className="mt-4">
                  {tableReportHeaders.length > 0 &&
                  activeEntities.length > 0 ? (
                    <div>
                      <CommonTable
                        TableData={tableReportData}
                        TableHeaders={tableReportHeaders}
                        TableCurrentPage={tableCurrentPage}
                        setTableCurrentPage={setTableCurrentPage}
                      />

                      <div className="d-flex justify-content-center">
                        <div>
                          {/* <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"}
                          /> */}
                          {pageCount > 0 && (
                              <CommonPagination
                              pageCount={pageCount}
                              setOffset={setOffset}
                            />
                          )}
                        
                        </div>
                      </div>
                    </div>
                  ) : (
                    <h4 className="primaryColor">Select the Columns to view the report</h4>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* new popups starts here */}

      {QueryBuilderPopupSection()}

      {ReportAccessibilityPopupSection()}

      {RelationshipBuilderPopupSection()}

     <ToastContainer />
    </>
  );
};

export default CreateReport;
