import React from "react";
import data from "./../../assets/dateAndTime/timezones.json";
import moment from "moment";

import Select, { components } from "react-select";

//this css is only specific to timezone selector
const groupStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
const groupBadgeStyles = {
  backgroundColor: "#EBECF0",
  borderRadius: "2em",
  color: "red",
  display: "inline-block",
  fontSize: 12,
  fontWeight: "normal",
  lineHeight: "1",
  minWidth: 1,
  marginLeft: 30,
  padding: "0.16666666666667em 0.5em",
  textAlign: "center",
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

function findTimezoneEntry(timezone) {
  for (const region of data.timezones) {
    for (const entry of region.options) {
      if (entry.value === timezone) {
        return entry;
      }
    }
  }
  return null;
}

export default ({
  setSelectedTimezone,
  setSelectedLocale,
  selectedTimezone,
}) => {
  const foundEntry = findTimezoneEntry(selectedTimezone);
  const Input = ({ ...rest }) => (
    <components.Input {...rest} autoComplete={"nope"} />
  );

  return (
    <Select
      components={{ Input }}
      value={foundEntry}
      options={data.timezones}
      formatGroupLabel={formatGroupLabel}
      onChange={(e) => {
        setSelectedTimezone(e.value);
        setSelectedLocale(e.locale);
      }}
    />
  );
};
