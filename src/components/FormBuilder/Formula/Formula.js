import "./Formula.css";
import TextInput from "react-autocomplete-textarea";
import { useState } from "react";

const Formula = (props) => {
  //   const [val, setVal] = useState("");

  // const onRequestOptions = (e) => {
  //   console.log(e);
  // };

  const convertArray = (arr) => {
    const newArray = arr?.layout
      ?.filter(
        (item) => item?.processVariableName !== null && item !== undefined
      )
      ?.map((e) => e?.processVariableName);

    const outputArray = {
      "@": newArray,
    };
    return outputArray;
  };

  const options = convertArray(props.layout);

  const handleChangeFormula = (e) => {
    props.formula(e);
  };

  return (
    <div className="Formula-container">
      <TextInput
        trigger={["@"]}
        requestOnlyIfNoOptions={true}
        // onRequestOptions={(trigger) => {
        //   onRequestOptions(trigger);
        // }}
        options={options}
        value={
          props?.element?.formula?.length
            ? props?.element?.formula[0]?.formula
            : ""
        }
        onChange={(e) => handleChangeFormula(e)}
      />
    </div>
  );
};

export default Formula;
