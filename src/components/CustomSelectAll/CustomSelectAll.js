import { useState } from "react";
import { Image } from "react-bootstrap";
import "./customselectall.css";
import Select, { components } from "react-select";
import { DataModelIcon } from "../../assets";

const CustomSelectAll = ({
  transferFrom,
  bringingvalue,
  isMulti,
  defaultValue,
}) => {
  // console.log("transferform",transferFrom);
  // const [defaulVal, setDefaultVal] = useState(
  //   transferFrom ? transferFrom[0] : null
  // );
  const { Option, SingleValue } = components;
  const [selectedvalue, setSelectedvalue] = useState(null);

  const options = isMulti
    ? [{ value: "Select All", payIcon: DataModelIcon }, ...transferFrom]
    : transferFrom;

  const IconOption = (props) => (
    <Option {...props}>
      <Image
        src={props.data.payIcon}
        alt={props.data.value}
        className="custom-iconoption"
        fluid
      />
      {props?.data?.value?.replace(/\.[^/.]+$/, "")}
    </Option>
  );

  const singleValue = (props) => (
    <SingleValue {...props}>
      <Image
        src={props.data.payIcon}
        alt={props.data.value}
        className="custom-singlevalue"
        fluid
      />
      {props?.data?.value?.replace(/\.[^/.]+$/, "")}
    </SingleValue>
  );

  const selectOption = (val) => {
    // setDefaultVal(val);
    setSelectedvalue(val);
    handleSelectOption(val);
    handleSelectOptionForm(val);
  };

  const handleSelectOption = (val) => {
    bringingvalue(val);
  };
  const handleSelectOptionForm = (val) => {
    bringingvalue(val);
  };
  return (
    <Select
      inputId="bank"
      options={options}
      className="custom-select customScrollBar"
      classNamePrefix="r_sel"
      isClearable={true}
      // onChange={selectOption}
      value={selectedvalue ? selectedvalue : null}
      onChange={(selected) => {
        isMulti &&
        selected.length &&
        selected.find((option) => option.value === "Select All")
          ? selectOption(options.slice(1))
          : !isMulti
          ? selectOption((selected && selected.value) || null)
          : selectOption(selected);
      }}
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
      id = "customSelectAll-select"
      // menuIsOpen={true}
    />
  );
};

export default CustomSelectAll;
