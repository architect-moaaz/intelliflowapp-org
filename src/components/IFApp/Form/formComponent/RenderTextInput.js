import { Icon } from "@iconify/react";
import parse from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import MathView, { MathViewRef } from "react-math-view";
import ReactTooltip from "react-tooltip";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../../state/atom";

const RenderTextInput = ({
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
  const keyboardRef = useRef();
  const processDataVariable = processVariableName?.replace(".", "");
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const isAutoPopulateAvailable = e?.autopopulate?.autoPopulateFields?.length;
  const dependencies = [e?.processVariableName];
  const [t, i18n] = useTranslation("common");

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
  const elementDisabledStatus = e?.disabled || disabledStatus ? true : false;

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

  const RenderEffects = () => {
    const [eleValue] = useState(formData[e?.processVariableName]);

    useEffect(() => {
      if (eleValue) {
        if (isAutoPopulateAvailable)
          if (dependencies.includes(currentElement)) getData();
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

  const renderEmail = () => {
    return (
      <>
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" ? (
            <span style={{ color: "red" }}>*</span>
          ) : (
            ""
          )}
          {errors[processDataVariable] && (
            <span
              class="badge"
              className="secondaryColor"
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
                  Please enter your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        <input
          id="renderForm-formElementType-text"
          type={e.fieldType}
          className={
            (errors[processDataVariable] ? "is-invalid" : "", "inputStyle")
          }
          placeholder={e.placeholder}
          disabled={elementDisabledStatus}
          // name={e.processVariableName}
          style={{
            height: "100%",
            width: "100%",
          }}
          defaultValue={e.defaultValue}
          data-tip
          data-for={e.processVariableName}
          value={formData[e.processVariableName]}
          {...register(processDataVariable, {
            required: elementDisabledStatus ? null : JSON.parse(e.required),
          })}
          onChange={(elem) => {
            captureValue(elem, e.processVariableName, e.prefix, e.suffix);
          }}
          // value={formData[e.processVariableName]}
        />
        {e.toolTip && e.toolTip != "" && (
          <ReactTooltip id={e.processVariableName} place="top" effect="solid">
            {e.toolTip}
          </ReactTooltip>
        )}
      </>
    );
  };

  const renderTextMathExp = () => {
    let arrayOfFormdataKeys = Object.keys(formData);
    let exist = arrayOfFormdataKeys.includes(e.processVariableName);
    return (
      <>
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" ? (
            <span style={{ color: "red" }}>*</span>
          ) : (
            // <span style={{ color: "red" }}>*</span>
            ""
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
                  Please enter your {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                </b>
              </small>
            </ReactTooltip>
          )}
        </label>
        {exist ? (
          <div className="disabled">
            <MathView value={formData[e.processVariableName]} />
          </div>
        ) : (
          <div className={elementDisabledStatus ? "disabled" : ""}>
            <MathView
              ref={keyboardRef}
              data-tip
              data-for={e.processVariableName}
              value={formData[e.processVariableName]}
              placeholder={e.placeholder}
              onChange={(elem) => {
                captureValue(elem, e.processVariableName, null, null);
              }}
              virtualKeyboardMode="manual"
              className="border"
              id="renderForm-mathView"
            />
          </div>
        )}
        {e.toolTip && e.toolTip != "" && (
          <ReactTooltip id={e.processVariableName} place="top" effect="solid">
            {e.toolTip}
          </ReactTooltip>
        )}
      </>
    );
  };

  //to reuse this component with list only normal text is being considered now
  const renderNormalText = () => {
    let patternString = e?.patternValidationEnabled ? e?.pattern : "";
    if (patternString?.charAt(patternString?.length - 1) == "/") {
      patternString = patternString?.substr(0, patternString?.length - 1);
    }
    if (patternString?.charAt(0) == "/") {
      patternString = patternString?.substr(1, patternString?.length);
    }
    var finalreg = new RegExp(patternString);

    return (
      <>
        <label className="fieldLable secondaryColor">
          {parse(t(e.fieldName))}
          {String(e.required) == "true" ? (
            <span style={{ color: "red" }}>*</span>
          ) : (
            // <span style={{ color: "red" }}>*</span>
            ""
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
                {e.patternValidationEnabled &&
                formData[processVariableName] &&
                formData[processVariableName] !== "" ? (
                  <b>Invalid {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}</b>
                ) : (
                  <b>
                    Please enter your{" "}
                    {e.fieldName?.replace(/(<([^>]+)>)/gi, "")}
                  </b>
                )}
              </small>
            </ReactTooltip>
          )}
        </label>

        <input
          id="renderForm-formElementType-fieldType"
          type={e.elementType}
          className={
            (errors[processDataVariable] ? "is-invalid" : "", "inputStyle")
          }
          placeholder={e.placeholder}
          disabled={elementDisabledStatus}
          style={{
            height: "100%",
            width: "100%",
          }}
          data-tip
          defaultValue={e.defaultValue}
          data-for={processVariableName}
          value={formData[processVariableName]}
          {...register(processDataVariable, {
            required: elementDisabledStatus ? null : JSON.parse(e.required),
            pattern:
              e.patternValidationEnabled && !e.patternCaseSensitivity
                ? new RegExp(finalreg, "i")
                : e.patternValidationEnabled
                ? new RegExp(finalreg)
                : new RegExp(),
          })}
          onChange={(elem) => {
            captureValue(elem, processVariableName, e.prefix, e.suffix, e);
          }}
        />
        {e.toolTip && e.toolTip != "" && (
          <ReactTooltip id={processVariableName} place="top" effect="solid">
            {e.toolTip}
          </ReactTooltip>
        )}
      </>
    );
  };

  return (
    <div
      className="form-group"
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
      <RenderEffects />
      {e.fieldType === "email" ? renderEmail() : null}
      {e.fieldType === "mathExp" ? renderTextMathExp() : null}
      {e.fieldType === null || e.fieldType === "text"
        ? renderNormalText()
        : null}
    </div>
  );
};

export default RenderTextInput;
