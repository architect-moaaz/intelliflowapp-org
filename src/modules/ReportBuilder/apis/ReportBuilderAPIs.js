const axios = require("axios");

export const getAppAndDatamodels = () => {
  var config = {
    method: "get",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getAllAppDataBases`,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return {status:'success', data:response.data} ;
    })
    .catch(function (error) {
      // console.log(error);
      return {status:'fail', error:error}
    });
};

export const createReport = (
  reportName,
  reportDescription,
  appName,
  DataModelName,
  username
) => {
  var data = JSON.stringify({
    reportDesc: reportDescription,
    exportDataAs: "data",
    tables: [
      {
        table1: `${appName}.${DataModelName}`,
      },
    ],
  });

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/createReportOrFetchData/Draft/v2`,
    headers: {
      reportName: reportName,
      user: username,
      app: appName,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const getDataModelerFields = (appName, dataModelName) => {
  var config = {
    method: "get",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getCollectionSchema`,
    headers: {
      app: appName,
      datamodel: dataModelName,
    },
  };

  return axios(config)
    .then(function (response) {
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      return { status: "fail", error: error };
    });
};

export const getReportDataHelper = (reportName, username) => {
  var axios = require("axios");
  var data = JSON.stringify({});

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport/v2?page=1&size=10`,
    headers: {
      reportName: reportName,
      exportDataTo: "data",
      user: username,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const updateAndGetReportData = (
  reportName,
  dataModelers,
  reportQueries,
  reportEntities,
  username,
  appName,
  pageNo
) => {
  //reportName : string
  //dataModelers : array [{tableIndex : tablename},...]

  var data = {
    reportName: reportName,
    tables: dataModelers,
    
    projection: reportEntities,
  }

  if(Object.keys(reportQueries).length != 0){
    data.filter= reportQueries;
  }

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/createReportOrFetchData/FetchData/v2?page=${pageNo}&size=10`,
    headers: {
      reportName: reportName,
      user: username,
      app: appName,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const updateReportMetaData = (
  reportName,
  dataModelers,
  reportQueries,
  reportEntities,
  username
) => {
  var data = JSON.stringify({
    reportName: reportName,
    tables: dataModelers,
    filter: reportQueries,
    projection: reportEntities,
  });

  var config = {
    method: "put",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/updateReportMetaData`,
    headers: {
      reportName: reportName,
      user: username,
      savereport: true,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const getReportAccessibilityHelper = (reportName, username, currentReportStatus) => {
  var config = {
    method: "get",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReportAccessUsersAndGroups`,
    headers: {
      reportName: reportName,
      user: username,
      status: currentReportStatus
    },
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const updateReportAccessibilityHelper = (
  reportName,
  usersList,
  groupsList,
  username
) => {
  var data = JSON.stringify({
    reportName: reportName,
    userName: usersList,
    group: groupsList,
  });

  var config = {
    method: "put",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/updateReportAccessUsersAndGroups`,
    headers: {
      reportName: reportName,
      user: username,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

export const initiateReportGeneration = (
  reportName,
  reportFileType,
  userName
) => {
  var data = JSON.stringify({});

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getReport/v2?page=1&size=10`,
    headers: {
      reportName: reportName,
      exportDataTo: reportFileType,
      user: userName,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      // console.log(error);
      return { status: "fail", error: error };
    });
};

//will get report download URLs from here
export const getReportDownloadHistory = (username, pageNo, recordsPerPage, reportName) => {

  var config = {
    method: "get",
    url: `${process.env.REACT_APP_REPORTBUILDER_ENDPOINT}reportBuilder/getDownloadedReports?page=${pageNo}&size=${recordsPerPage}`,
    headers: {
      user: username,
      reportName: reportName
    }
  };

  return axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      return {status:'success', data:response.data}
    })
    .catch(function (error) {
      // console.log(error);
      return {status:'fail', error:error}
    });
};
