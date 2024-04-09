import { useState } from "react";
import { Image } from "react-bootstrap";
import "./customselect.css";

import ReactMultiSelectCheckboxes from "react-multiselect-checkboxes";

const CustomMultiSelect = ({
  transferFrom,
  bringingvalue,
  isMulti,
  allowSelectAll,
}) => {
  // console.log("transferform",transferFrom);
  const [defaulVal, setDefaultVal] = useState(
    transferFrom ? transferFrom[0] : null
  );
  // const { Option, SingleValue } = components;
  const [selectedvalue, setSelectedvalue] = useState(null);

  // const IconOption = (props) => (
  //   <Option {...props}>
  //     <Image
  //       src={props.data.payIcon}
  //       alt={props.data.value}
  //       className="custom-iconoption"
  //       fluid
  //     />
  //     {props?.data?.value?.replace(/\.[^/.]+$/, "")}
  //   </Option>
  // );

  // const singleValue = (props) => (
  //   <SingleValue {...props}>
  //     <Image
  //       src={props.data.payIcon}
  //       alt={props.data.value}
  //       className="custom-singlevalue"
  //       fluid
  //     />
  //     {props?.data?.value?.replace(/\.[^/.]+$/, "")}
  //   </SingleValue>
  // );

  const selectOption = (val) => {
    setDefaultVal(val);
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
    <ReactMultiSelectCheckboxes
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
      defaultValue={defaulVal}
      // components={{ Option: IconOption, SingleValue: singleValue }}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
      }}
      isMulti={isMulti}
      allowSelectAll={allowSelectAll}
      id = "customMultiSelect-ReactMultiSelectCheckboxes"
      // menuIsOpen={true}
    />
  );
};

export default CustomMultiSelect;
