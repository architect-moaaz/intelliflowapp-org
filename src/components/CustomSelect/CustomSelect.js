import { useState } from "react";
import { Image } from "react-bootstrap";
import "./customselect.css";
import Select, { components } from "react-select";
import ReactTooltip from "react-tooltip";

const CustomSelect = ({
  transferFrom,
  bringingvalue,
  isMulti,
  defaultValue,
  isDisabled,
}) => {
  // console.log("transferform",transferFrom);
  // const [defaulVal, setDefaultVal] = useState(
  //   transferFrom ? transferFrom[0] : null
  // );
  const { Option, SingleValue } = components;
  const [selectedvalue, setSelectedvalue] = useState(null);

  const IconOption = (props) => (
    <Option {...props}>
      <div
        data-tip
        data-for={`tooltip-${props?.data?.value}`}
        className="ellipsis"
      >
        {props?.data?.payIcon !== undefined && (
          <Image
            src={props.data.payIcon}
            alt={props.data.value}
            className="custom-iconoption"
            id="customSelect-option-image"
            fluid
          />
        )}

        {props?.data?.value?.replace(/\.[^/.]+$/, "")}
      </div>
      <ReactTooltip
        id={`tooltip-${props?.data?.value}`}
        place="right"
        effect="solid"
      >
        {props?.data?.value}
      </ReactTooltip>
    </Option>
  );

  const singleValue = (props) => (
    <SingleValue {...props}>
      {props?.data?.payIcon !== undefined && (
        <Image
          src={props.data.payIcon}
          alt={props.data.value}
          className="custom-singlevalue"
          id="customSelect-singlevalue-image"
          fluid
        />
      )}
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
      defaultValue={
        defaultValue
          ? { label: defaultValue, value: defaultValue }
          : {
              label: "Select A Value",
              value: "Select A Value",
            }
      }
      isDisabled={isDisabled ?? false}
      // menuIsOpen={true}
    />
  );
};

export default CustomSelect;
