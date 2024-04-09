import { Icon } from "@iconify/react";
import parse from "html-react-parser";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../../state/atom";

const RenderNumberInput = ({
  e,
  processVariableName,
  captureValue,
  errors,
  isShown,
  formData,
  disabledStatus,
  register,
  isListComponent = false,
  topData,
  leftData,
  handleInfo,
  setformData,
  currentElement,
  setCurrentElement,
  getOdataFilteredValues,
}) => {
  const processDataVariable = processVariableName?.replace(".", "");
  const maxNumber = Number(e.maxLength);
  const minNumber = Number(e.minLength);
  const isAutoPopulateAvailableNumber =
    e?.autopopulate?.autoPopulateFields?.length;
  const dependenciesNumber = [e?.processVariableName];
  const [t, i18n] = useTranslation("common");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  function evaluateCondition(condition) {
    const operator = condition[0];
    const operand1 = condition[1];
    const operand2 = condition[2];

    switch (operator) {
      case "=":
        return operand1 === operand2;
      case ">":
        return operand1 > operand2;
      case "<":
        return operand1 < operand2;
      case ">=":
        return operand1 >= operand2;
      case "<=":
        return operand1 <= operand2;
      case "!=":
        return operand1 !== operand2;
      default:
        return false;
    }
  }

  function getProcessInputVariableValue(receivedValue) {
    let value = "";
    if (receivedValue === "_sessionEmployeeName") {
      value = loggedInUser?.username;
    } else if (receivedValue === "_sessionEmployeeID") {
      value = loggedInUser.id;
    } else {
      value = loggedInUser.email;
    }
    return value;
  }

  let hideItem = e?.hidden ?? false;
  let elementDisabledStatus = e?.disabled || disabledStatus ? true : false;

  if (e?.conditions?.length) {
    e.conditions.forEach((ele) => {
      let res;
      if (ele?.useSession) {
        let operand1 = formData[ele.operand1];
        let operand2 = getProcessInputVariableValue(ele.operand2);

        res = operand1
          ? evaluateCondition([ele.operator, operand1, operand2])
          : false;
      } else if (ele?.useProcessVariable) {
        let operand1 = formData[ele.operand1];
        let operand2 = formData[ele?.operand2];

        res = operand1
          ? evaluateCondition([ele.operator, operand1, operand2])
          : false;
      } else if (ele?.useNullValue) {
        let operand1 = formData[ele.operand1];

        res = operand1 ? false : true;
      } else {
        let operand1 = formData[ele.operand1];

        res = operand1
          ? evaluateCondition([ele.operator, operand1, ele.operand2])
          : false;
      }

      if (res) {
        ele.result === "disable"
          ? (elementDisabledStatus = true)
          : (hideItem = true);
      }
    });
  }

  const RenderEffectsNumber = () => {
    const [eleValue] = useState(formData[e?.processVariableName]);

    useEffect(() => {
      if (eleValue) {
        if (isAutoPopulateAvailableNumber)
          if (dependenciesNumber?.includes(currentElement)) getData();
      }
    }, [eleValue]);

    async function getData() {
      try {
        let field = e.processVariableName?.split(".")[1];
        setCurrentElement("");
        let tempFormData = {};
        var getDataGridDataAPI = await getOdataFilteredValues(
          [
            {
              field: field,
              operator: "=",
              value: e.processVariableName,
              useSession: false,
              useProcessVariable: true,
            },
          ],
          e.autopopulate?.selectedDataModel
        );
        if (getDataGridDataAPI?.length) {
          e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
            let tempVar = autoPopField?.value.split(".")[1];

            tempFormData = {
              ...tempFormData,
              [autoPopField.value]: getDataGridDataAPI[0][tempVar],
            };
          });
        } else {
          e.autopopulate?.autoPopulateFields?.map((autoPopField) => {
            tempFormData = {
              ...tempFormData,
              [autoPopField.value]: "",
            };
          });
        }

        setformData((prev) => {
          return {
            ...prev,
            ...tempFormData,
          };
        });
      } catch (e) {
        console.log(e);
      }
    }

    return <></>;
  };

  const InputNumberStyle = {
    height: "100%",
    width: "100%",
    paddingLeft: e?.isPrefixChecked
      ? `${(e?.numberPrefix?.length || 0) * 10 + 10}px`
      : "10px",
    paddingRight: e?.isPrefixChecked
      ? `${(e?.numberSuffix?.length || 0) * 10 + 10}px`
      : "10px",
  };

  if (e.maxLength?.length > 0 && e.minLength?.length > 0) {
    return (
      <div
        className={"form-group"}
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: isListComponent ? `${leftData}%` : `${(e.x / 24) * 100}%`,
          top: isListComponent ? `${topData}%` : `${(e.y / 10) * 1.2 * 100}%`,
          height: isListComponent ? `100%` : `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          display: hideItem ? "none" : null,
        }}
      >
        <RenderEffectsNumber />
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" && (
            <span style={{ color: "red" }}>*</span>
          )}
          {errors[processDataVariable] && (
            <span
              className="secondaryColor"
              class="badge"
              style={{ color: "red", cursor: "pointer" }}
            >
              <Icon
                icon="clarity:info-standard-line"
                height="15"
                alt="info"
                data-tip
                data-for={String(e.id)}
                onMouseEnter={() => handleInfo(e.id)}
                onMouseLeave={() => handleInfo("")}
              />
            </span>
          )}
          {isShown == e.id && (
            <ReactTooltip id={String(e.id)} place="right" effect="solid">
              <small className="requiredTextColor">
                <b>
                  {/* Please enter your{" "}
                {e.fieldName?.replace(/(<([^>]+)>)/gi, "")} */}
                  {errors[processDataVariable]?.message}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        <div style={{ display: "flex", alignItems: "center" }}>
          {e.isPrefixChecked == true && (
            <span
              className="prefix"
              style={{ position: "absolute", left: "10px" }}
            >
              {e.numberPrefix}
            </span>
          )}
          <input
            id="renderForm-formElementType-number"
            type={e.elementType}
            placeholder={e.placeholder}
            className={
              (errors[processDataVariable] ? "is-invalid" : "",
              "inputStyleNumber inputNumber")
            }
            disabled={elementDisabledStatus}
            style={InputNumberStyle}
            data-tip
            data-for={processVariableName}
            value={formData[processVariableName]}
            defaultValue={e.defaultValue}
            {...register(processDataVariable, {
              required: {
                value: elementDisabledStatus ? null : JSON.parse(e.required),
                message: `Enter a number between ${minNumber} & ${maxNumber} `,
              },
              min: {
                value: e.minLength,
                message: `Enter a number greater than ${minNumber}`,
              },
              max: {
                value: e.maxLength,
                message: `Enter a number smaller than ${maxNumber}`,
              },
              valueAsNumber: true,

              // validate: (value) =>
              //   value >= e.minLength && value <= e.maxLength,
              // message: "Please Enter A number Between x and y",
            })}
            onChange={(elem) => {
              captureValue(elem, processVariableName, e.prefix, e.suffix);
            }}
          />
          {e.isSuffixChecked && (
            <span
              className="suffix"
              style={{ position: "absolute", right: "10px" }}
            >
              {e.numberSuffix}
            </span>
          )}
        </div>

        {e.toolTip && e.toolTip != "" && (
          <ReactTooltip id={processVariableName} place="top" effect="solid">
            {e.toolTip}
          </ReactTooltip>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={"form-group"}
        key={e.id}
        style={{
          position: "absolute",
          paddingBottom: "30px",
          left: isListComponent ? `${leftData}%` : `${(e.x / 24) * 100}%`,
          top: isListComponent ? `${topData}%` : `${(e.y / 10) * 1.2 * 100}%`,
          height: isListComponent ? `100%` : `${(e.h / 10) * 1.2 * 100}%`,
          width: `${(e.w / 24) * 100}%`,
          display: hideItem ? "none" : null,
        }}
      >
        <RenderEffectsNumber />
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" && (
            <span style={{ color: "red" }}>*</span>
          )}
          {errors[processDataVariable] && (
            <span
              className="secondaryColor"
              class="badge"
              style={{ color: "red", cursor: "pointer" }}
            >
              <Icon
                icon="clarity:info-standard-line"
                height="15"
                alt="info"
                data-tip
                data-for={String(e.id)}
                onMouseEnter={() => handleInfo(e.id)}
                onMouseLeave={() => handleInfo("")}
              />
            </span>
          )}
          {isShown == e.id && (
            <ReactTooltip id={String(e.id)} place="right" effect="solid">
              <small className="requiredTextColor">
                <b>
                  {/* Please enter your{" "}
                  {e.fieldName?.replace(/(<([^>]+)>)/gi, "")} */}
                  {errors[processDataVariable]?.message}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        <div style={{ display: "flex", alignItems: "center" }}>
          {e.isPrefixChecked == true && (
            <span
              className="prefix"
              style={{ position: "absolute", left: "10px" }}
            >
              {e.numberPrefix}
            </span>
          )}
          <input
            id="renderForm-formElementType-number"
            type={e.elementType}
            placeholder={e.placeholder}
            className={
              (errors[processDataVariable] ? "is-invalid" : "",
              "inputStyleNumber inputNumber")
            }
            disabled={elementDisabledStatus}
            style={InputNumberStyle}
            data-tip
            data-for={processVariableName}
            value={formData[processVariableName]}
            defaultValue={e.defaultValue}
            {...register(processDataVariable, {
              required: {
                value: elementDisabledStatus ? null : JSON.parse(e.required),
                // message: `Enter a number between ${minNumber} & ${maxNumber} `,
                message: `Enter a number `,
              },
              // min: {
              //   value: e.minLength,
              //   message: `Enter a number greater than ${minNumber}`,
              // },
              // max: {
              //   value: e.maxLength,
              //   message: `Enter a number smaller than ${maxNumber}`,
              // },
              valueAsNumber: true,

              // validate: (value) =>
              //   value >= e.minLength && value <= e.maxLength,
              // message: "Please Enter A number Between x and y",
            })}
            onChange={(elem) => {
              captureValue(elem, processVariableName, e.prefix, e.suffix);
            }}
          />{" "}
          {e.isSuffixChecked == true && (
            <span
              className="suffix"
              style={{ position: "absolute", right: "10px" }}
            >
              {e.numberSuffix}
            </span>
          )}
        </div>
        {e.toolTip && e.toolTip != "" && (
          <ReactTooltip id={processVariableName} place="top" effect="solid">
            {e.toolTip}
          </ReactTooltip>
        )}
      </div>
    );
  }
};

export default RenderNumberInput;
