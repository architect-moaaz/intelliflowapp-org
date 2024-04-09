import { useState } from "react";
import { Image } from "react-bootstrap";
import "./customselectnoicon.css";
import Select, { components } from "react-select";
import { DataModelIcon } from "../../assets";

const CustomSelectNoIcon = ({ transferFrom, bringingvalue, isMulti }) => {
  const { Option, SingleValue } = components;
  const [selectedvalue, setSelectedvalue] = useState(null);

  const options = isMulti
    ? [{ value: "Select All", payIcon: DataModelIcon }, ...transferFrom]
    : transferFrom;

  const IconOption = (props) => (
    <Option {...props}>{props?.data?.label?.replace(/\.[^/.]+$/, "")}</Option>
  );

  const singleValue = (props) => (
    <SingleValue {...props}>
      {props?.data?.label?.replace(/\.[^/.]+$/, "")}
    </SingleValue>
  );

  const selectOption = (val) => {
    handleSelectOption(val);
    setSelectedvalue(val);
  };

  const handleSelectOption = (val) => {
    bringingvalue(val);
  };
  return (
    <Select
      inputId="bank"
      options={transferFrom}
      className="custom-select customScrollBar"
      classNamePrefix="r_sel"
      isClearable={true}
      onChange={selectOption}
      // menuIsOpen = {true}
      blurInputOnSelect={false}
      autoFocus={false}
      openMenuOnFocus={false}
      // defaultValue={defaulVal}
      components={{ Option: IconOption, SingleValue: singleValue }}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      isMulti={isMulti}
      id="customSelect-select"
      // menuIsOpen={true}
    />
  );
};

export default CustomSelectNoIcon;
