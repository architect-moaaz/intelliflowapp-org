function formatDateTimeInTimezone(date) {
  //can be optimized further insted of fetching these details everytime from localstorage some other alternative can be used
  let usertimezone = localStorage.getItem("usertimezone");
  let userlocale = localStorage.getItem("usertimezonelocale");
  let workspacetimezone = localStorage.getItem("workspacetimezone");
  let workspacelocale = localStorage.getItem("workspacetimezonelocale");

  let timezone = usertimezone
    ? usertimezone
    : workspacetimezone
    ? workspacetimezone
    : "NA";
  let locale = userlocale
    ? userlocale
    : workspacelocale
    ? workspacelocale
    : "NA";

  const options = {
    timeZone: timezone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  if (timezone !== "NA" && locale !== "NA") {
    const formattedDateTime = date.toLocaleString(locale, options);
    return formattedDateTime;
  } else {
    return date;
  }
}

export default formatDateTimeInTimezone;
