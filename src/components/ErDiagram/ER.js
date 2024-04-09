import React from "react";
import ERD from "./components/ERD";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CommonModelContainer from "../CommonModel/CommonModelContainer";

const ER = ({
  data,
  doGetAllResources,
  openErPopup,
  handleOpenErPopupCallback,
}) => {
  // console.log("data", data);

  const [dataModelName, setDataModelName] = useState(null);
  const [dropList, setDropList] = useState([]);

  const apiGet = async () => {
    let tableList = [];
    // let tableTemplate = {
    //   table_name: "",
    //   table_schema: "",
    //   columns: [],
    //   references: [],
    // };
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
        console.log(res.data.data.datamodel);
        setDataModelName(res.data.data.datamodel);
        tableInfo(res.data.data.datamodel);
        // console.log("tableList",tableList)
      })
      .catch((e) => console.log(e));
  };

  const removeExtension = (filename) => {
    return filename.split(".")[0];
  };

  const tableInfo = async (tableList) => {
    console.log("tableList", tableList);
    let allTableDatas = await Promise.all(
      tableList.map(async (e) => {
        let tableData = {
          table_name: removeExtension(e.resourceName),
          table_schema: localStorage.getItem("appName"),
        };
        let allTables = await getData(e.resourceName);
        console.log("allTables", allTables);
        tableData.columns = allTables.columns;
        tableData.references = allTables.references;
        return tableData;
        // getData(e.resourceName);
      })
    );
    setDropList(allTableDatas);
    console.log("allTableDatas", allTableDatas);
  };

  useEffect(() => {
    apiGet();
  }, []);

  // useEffect(() => {
  //   if (dataModelName) {
  //     for (var i = 0; i <= dataModelName?.length; i++) {
  //       const json5 = require("json5");
  //       const postData = {
  //         workspaceName: localStorage.getItem("workspace"),
  //         miniAppName: localStorage.getItem("appName"),
  //         fileName: dataModelName[i]?.resourceName,
  //         fileType: "datamodel",
  //       };
  //       axios
  //         .post(
  //           process.env.REACT_APP_MODELLER_API_ENDPOINT +
  //             "modellerService/fetchFile/meta",
  //           postData
  //         )
  //         .then((res) => {
  //           if (res.data.data != null) {
  //             var inputDataStr = res.data.data;
  //             inputDataStr = inputDataStr.replaceAll("=", ":");
  //             var dataInput = json5.parse(inputDataStr);
  //             console.log("dataInput", dataInput);

  //             const tempData = dataInput.map((e) => {
  //               if (e.isCollection == true && e.isPrimitive == true) {
  //                 return {
  //                   id: Math.random(Math.floor(0, 999999)),
  //                   element: e.name,
  //                   type: "List",
  //                   primitive: true,
  //                   collectionType: e.type,
  //                 };
  //               } else if (e.isCollection == true && e.isPrimitive == false) {
  //                 return {
  //                   id: Math.random(Math.floor(0, 999999)),
  //                   element: e.name,
  //                   type: "List",
  //                   primitive: false,
  //                   collectionType: e.type,
  //                 };
  //               } else {
  //                 return {
  //                   id: Math.random(Math.floor(0, 999999)),
  //                   element: e.name,
  //                   type: e.type,
  //                 };
  //               }

  //             });
  //             setDropList([...dropList,tempData]);
  //             console.log("tempData", tempData);

  //           }

  //         });
  //     }

  //   }

  // }, [dataModelName]);

  // const getData =  async (tableName) => {
  //   const json5 = require("json5");
  //   const postData = {
  //     workspaceName: localStorage.getItem("workspace"),
  //     miniAppName: localStorage.getItem("appName"),
  //     fileName: tableName,
  //     fileType: "datamodel",
  //   };
  //   return axios
  //     .post(
  //       process.env.REACT_APP_MODELLER_API_ENDPOINT +
  //         "modellerService/fetchFile/meta",
  //       postData
  //     )
  //     .then((res) => {
  //       console.log("res", JSON.parse(res.data.data));
  //       let recievceData = JSON.parse(res.data.data);
  //       let allEntityList = [];
  //       let allReferences = [];
  //       recievceData.map(async(e) => {
  //         let entityData = {
  //           name: e.name,
  //           type: e.type,
  //         };

  //         if (e.isCollection) {
  //           const referenceNode = {
  //             toTable: e.type+".java",
  //             toTableSchema: localStorage.getItem("appName"),
  //             fromColumn: e.name,
  //             toColumn:  tableColoum(e.type),
  //           };
  //           allReferences.push(referenceNode);
  //           console.log("referenceNode", referenceNode);
  //         }
  //         // return entityData.references

  //         allEntityList.push(entityData);
  //       });
  //       let tabelData = { columns: allEntityList, references: allReferences };
  //       console.log("allEntityList", allEntityList);
  //       return tabelData;
  //     });
  // };

  const getData = async (tableName) => {
    const json5 = require("json5");
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: tableName,
      fileType: "datamodel",
    };

    try {
      const res = await axios.post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/meta",
        postData
      );

      console.log("res", JSON.parse(res.data.data));
      let recievceData = JSON.parse(res.data.data);
      let allEntityList = [];
      let allReferences = [];

      for (const e of recievceData) {
        let entityData = {
          name: e.name,
          type: e.type,
        };

        if (e.isCollection) {
          const toColumn = await tableColoum(e.type);
          const referenceNode = {
            toTable: e.type,
            toTableSchema: localStorage.getItem("appName"),
            fromColumn: e.name,
            toColumn: toColumn,
          };
          allReferences.push(referenceNode);
          console.log("referenceNode", referenceNode);
        }

        allEntityList.push(entityData);
      }

      let tabelData = { columns: allEntityList, references: allReferences };
      console.log("allEntityList", allEntityList);
      return tabelData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const tableColoum = async (tableName) => {
    const postData = {
      workspaceName: localStorage.getItem("workspace"),
      miniAppName: localStorage.getItem("appName"),
      fileName: tableName,
      fileType: "datamodel",
    };

    try {
      const res = await axios.post(
        process.env.REACT_APP_MODELLER_API_ENDPOINT +
          "modellerService/fetchFile/meta",
        postData
      );

      let recievceData = JSON.parse(res.data.data);
      console.log("recievceData", recievceData);
      return recievceData[0].name;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // const schema = [
  //   {
  //     table_name: "Table",
  //     table_schema: "hr",
  //     columns: dropList?.map((e) => ({ name: e.element, type: e.type })),
  //     primary_keys: ["columnB"],
  //     references: [
  //       {
  //         toTable: "table3",
  //         toTableSchema: "hr",
  //         fromColumn: "age",
  //         toColumn: "table3",
  //       },
  //     ],
  //   },
  // ];
  // console.log("dataModelName", dataModelName);
  return (
    <>
      {dataModelName?.length !== 0 && dataModelName !== null ? (
        <ERD schema={dropList} />
      ) : (
        <div className="er-emptyDataModel">
          <p className="secondaryColor">No Data Model Available</p>
          <h5 className="primaryColor">Create a Data Model in order to visualize the ER Diagram</h5>
        </div>
      )}
    </>
  );
};

export default ER;
