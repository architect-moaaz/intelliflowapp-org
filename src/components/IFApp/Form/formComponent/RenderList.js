import React, { useState, useEffect } from "react";
import dot from "dot-object";
import RenderNumberInput from "./RenderNumberInput";
import RenderTextInput from "./RenderTextInput";
import "./list.css";

const RenderList = ({
  listProperties,
  formData,
  captureValue,
  errors,
  setformData,
  register,
}) => {
  const dataTypes = {
    String: "text",
    Integer: "number",
  };

  const [formDataLocal, setFormDataLocal] = useState(formData);

  const [listPropertiesLocal, setListPropertiesLocal] =
    useState(listProperties);

  const parentModelName = listProperties.dataGridProperties.parentDataModelName
    .replace(".java", "")
    .toLowerCase();
  const childModelName = listProperties.dataGridProperties.dataModelName
    .replace(".java", "")
    .toLowerCase();

  const [processDataVariableArr, setProcessDataVariableArr] = useState([]);
  const [listInstance, setListInstance] = useState({});

  useEffect(() => {
    //working code for single list value persistance
    let tempProcessDataVar = [];
    let listInstanceTemp = {};
    Object.keys(listProperties.listTemplate).map((elem) => {
      console.log("objkeys", elem);

      listInstanceTemp[elem] = "";
    });
    // setListInstance(tempProcessDataVar[0])
    console.log("temp", tempProcessDataVar);
    // setProcessDataVariableArr(tempProcessDataVar)
    console.log("listinst", listInstance);

    let formDataCopy = formData;

    //   let listLength = dot.object(formDataCopy)[`${parentModelName}`][`${childModelName}`]

    let keys = Object.keys(listInstanceTemp);
    let oneKeyName = keys[0];

    for (let key in formData) {
      if (
        key.includes(`${parentModelName}`) &&
        key.includes(`${childModelName}`) &&
        key.includes(`${oneKeyName}`)
      ) {
        tempProcessDataVar.push(listInstanceTemp);
      }
    }

    //   tempProcessDataVar.push(listInstanceTemp);
    setListInstance(listInstanceTemp);

    // below logic to initialize list with one element, to use this existing form data which is in dot notation needs to be parsed which is causing issues
    // tempProcessDataVar.push(listInstanceTemp)
    setProcessDataVariableArr(tempProcessDataVar);
  }, []);

  const removeValuesFromList = (currentIndex) => {
    setProcessDataVariableArr((prevData) => {
      if (
        currentIndex !== null &&
        currentIndex >= 0 &&
        currentIndex < prevData.length
      ) {
        const newData = [...prevData];
        newData.splice(currentIndex, 1);
        return newData;
      }
      return prevData;
    });

    removeKeysWithNumberFromObj(currentIndex);
  };

  //new implementation

  function removeKeysWithNumber(obj, number) {
    const newObj = {};
    let maxNumber = number;

    for (let key in obj) {
      if (key.includes(number)) {
        delete obj[key];
      } else {
        const match = key.match(/\d+/g);
        if (match) {
          const keyNumber = parseInt(match[0], 10);
          if (keyNumber > maxNumber) {
            maxNumber = keyNumber;
          }
        }
        newObj[key] = obj[key];
      }
    }

    const updatedObj = {};
    for (let key in newObj) {
      const match = key.match(/\d+/g);
      const matchDataModel = key.includes(
        `${parentModelName}.${childModelName}`
      );
      if (match && matchDataModel) {
        const keyNumber = parseInt(match[0], 10);
        if (keyNumber > number) {
          const updatedKey = key.replace(/\d+/, keyNumber - 1);
          updatedObj[updatedKey] = newObj[key];
        } else {
          updatedObj[key] = newObj[key];
        }
      } else {
        updatedObj[key] = newObj[key];
      }
    }

    return updatedObj;
  }

  function removeKeysWithNumberFromObj(number) {
    const modifiedObj = removeKeysWithNumber(formData, number);
    console.log(modifiedObj);
    setformData(modifiedObj);
  }

  let topData = 50;
  let leftData = 50;

  return (
    <div className="">
      {listProperties.fieldName}
      <button
        onClick={() =>
          setProcessDataVariableArr([...processDataVariableArr, listInstance])
        }
        className="mt-2 ms-4 px-3 py-1"
      >
        add
      </button>
      {processDataVariableArr.map((listinst, index) => {
        return (
          <div
            className=""
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {Object.keys(listinst).map((listelem, nestedIndex) => {
              console.log("listelemmmm", listelem);
              let processDV = `${parentModelName}.${childModelName}[${index}].${listelem}`;
              console.log("data", formData[processDV], formData);

              let datatype =
                dataTypes[`${listProperties.listTemplate[`${listelem}`]}`];
              //working code for for input boxes
              // return (
              //   <div style={{ height: "50px", width: "100px" }}>
              //     <input

              //      type={datatype}
              //       value={formData[processDV]}
              //       placeholder={processDV}
              //       onChange={(e) => captureValue(e, processDV)}
              //     />
              //   </div>
              // );

              if (datatype == "number") {
                let disabledStatus = false;
                //temporary fix for list inputs positioning: need to address this with relative positioning
                topData = 100 * (index + 1);
                let leftDataTemp = 35 * nestedIndex;
                let elementdata = listProperties.stack.filter(
                  (e) => e.fieldName == listelem
                );

                return (
                  <div>
                    <RenderNumberInput
                      e={elementdata[0]}
                      processVariableName={processDV}
                      captureValue={captureValue}
                      errors={errors}
                      formData={formData}
                      disabledStatus={disabledStatus}
                      register={register}
                      isListComponent={true}
                      topData={topData}
                      leftData={leftDataTemp}
                    />
                  </div>
                );
              } else if (datatype == "text") {
                let disabledStatus = false;
                //temporary fix for list inputs positioning: need to address this relative positioning
                topData = 100 * (index + 1);
                let leftDataTemp = 35 * nestedIndex;
                let elementdata = listProperties.stack.filter(
                  (e) => e.fieldName == listelem
                );

                return (
                  <div>
                    <RenderTextInput
                      e={elementdata[0]}
                      processVariableName={processDV}
                      captureValue={captureValue}
                      errors={errors}
                      formData={formData}
                      disabledStatus={disabledStatus}
                      register={register}
                      isListComponent={true}
                      topData={topData}
                      leftData={leftDataTemp}
                    />
                  </div>
                );
              }
            })}
            <div
              className=""
              style={{ marginLeft: `${Object.keys(listinst) * 35}` }}
            >
              <button
                className=" px-3 py-1 remove-list-btn"
                onClick={() => removeValuesFromList(index)}
              >
                remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderList;
