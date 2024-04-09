const axios = require("axios");

export const getUserPreferences = (workspace, userid) => {
  var data = "";

  var config = {
    method: "get",
    url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/misc/getuserpreference`,
    headers: {
      workspace: workspace,
      userid: userid,
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      //   console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      console.log(error);
      return { status: "failed", error: error };
    });
};

export const saveUserPreference = (workspace, userid, timezone, locale) => {
  var data = JSON.stringify({
    timezone: timezone,
    locale: locale,
  });

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/misc/saveUserPreference`,
    headers: {
      workspace: workspace,
      userid: userid,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      console.log(error);
      return { status: "failed", error: error };
    });
};

export const saveWorkspaceTimezone = (workspace, timezone, locale) => {
  var data = JSON.stringify({
    timezone: timezone,
    locale: locale,
  });

  var config = {
    method: "post",
    url: `${process.env.REACT_APP_IDENTITY_ENDPOINT}IDENTITY/misc/saveWorkspaceTimezone`,
    headers: {
      workspace: workspace,
      "Content-Type": "application/json",
    },
    data: data,
  };

  return axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      return { status: "success", data: response.data };
    })
    .catch(function (error) {
      console.log(error);
      return { status: "failed", error: error };
    });
};
