import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { formbuilderErrorsState } from "../../state/atom";
import parse from "html-react-parser";

import { ReactComponent as UP } from "../../assets/NewIcon/error-up-arrow.svg";
import { ReactComponent as DOWN } from "../../assets/NewIcon/error-down-arrow.svg";
import "./Errors.css";
import useErrorValue from "../hooks/useErrorValues";

import { useTranslation } from "react-i18next";
export default function Errors() {
  const formbuilderErrors = useRecoilValue(formbuilderErrorsState);
  const { totalErrorsNumber, totalWarningsNumber } = useErrorValue();
  const [t, i18n] = useTranslation("common");

  const RenderFormErrorBody = ({ fileName, errors }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    let errorNumber = 0;

    const extractErrorsNumber = Object.entries(errors).map(([key, value]) => {
      errorNumber = errorNumber + value.length;
    });

    const getErrorType = (key) => {
      let errorType = key.split(/(?=[A-Z])/);
      errorType = errorType.toString();
      errorType = errorType.replace(/,/g, " ");
      errorType = errorType.toUpperCase();
      return errorType;
    };

    const RenderDescription = ({ type, des }) => {
      switch (type) {
        case "fieldNameErrors":
          return (
            <p id="field-name-error" className="secondaryColor">
              Element Type {des.elementType} is missing the value Field Name
            </p>
          );

        case "dataVariableErrors":
          return (
            <p id="data-variable-error" className="secondaryColor">
              Element Type {des.elementType} with Field Name{" "}
              {des.fieldName ? parse(des.fieldName) : "Undefined"} is missing
              the value Process Data Variable
            </p>
          );

        case "ratingFieldErrors":
          return (
            <p id="rating-field-error" className="secondaryColor">
              Element Type {des.elementType} with Field Name{" "}
              {des.fieldName ? parse(des.fieldName) : "Undefined"} is missing
              the value Rating Type
            </p>
          );

        case "actionTypeErrors":
          return (
            <p id="action-type-error" className="secondaryColor">
              Element Type {des.elementType} with Field Name{" "}
              {des.fieldName ? parse(des.fieldName) : "Undefined"} is missing
              the value Action Type
            </p>
          );

        default:
          return <h4 className="primaryColor">Undefined</h4>;
      }
    };

    const handleExpand = () => {
      setIsExpanded((prev) => !prev);
    };

    if (errorNumber) {
      return (
        <div
          className="error-body file-name-body-text"
          id={fileName}
          onClick={handleExpand}
        >
          <div className="body-left">
            <div className="file-name-body">
              <div className="icon-set">
                {isExpanded && <UP />}
                <div className="gap" />
                {!isExpanded && <DOWN />}
              </div>
              <div className="">{fileName}</div>
            </div>
            <div className="file-errors-body">{errorNumber}</div>
          </div>
          <div className="body-right">
            {Object.entries(errors).map(([key, val]) => {
              let errorType = getErrorType(key);

              if (val.length) {
                return (
                  <div className="error-body-description-wrapper">
                    <div className="error-type-body">{errorType}</div>
                    <div className="error-body-description">
                      {val.map((des, index) => {
                        if (!isExpanded) {
                          if (index === 0) {
                            return <RenderDescription type={key} des={des} />;
                          }
                        } else {
                          return <RenderDescription type={key} des={des} />;
                        }
                      })}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="error-body" id={fileName}>
          <div className="body-left">
            <div className="file-name-body">
              <div className="icon-set">
                <UP />
                <div className="gap" />
                <DOWN />
              </div>
              <div className="file-name-body-text">{fileName}</div>
            </div>
            <div className="file-errors-body">{errorNumber}</div>
          </div>
          <div className="body-right">
            <div className="error-body-description-wrapper">
              <div className="error-type-body">None</div>
              <div className="error-body-description">
                <p id="no-error-found-file" className="secondaryColor">No Errors Found in File</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const RenderWorkflowErrorBody = ({ fileName, errors }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    let errorNumber = 0;

    const extractErrorsNumber = Object.entries(errors).map(([key, value]) => {
      errorNumber = errorNumber + value.length;
    });

    const getErrorType = (key) => {
      let errorType = key.split(/-/);
      errorType = errorType.toString();
      errorType = errorType.replace(/,/g, " ");
      errorType = errorType.toUpperCase();
      return errorType;
    };

    const handleExpand = () => {
      setIsExpanded((prev) => !prev);
    };

    if (errorNumber) {
      return (
        <div
          className="error-body file-name-body-text"
          id={fileName}
          onClick={handleExpand}
        >
          <div className="body-left">
            <div className="file-name-body">
              <div className="icon-set">
                {isExpanded && <UP />}
                <div className="gap" />
                {!isExpanded && <DOWN />}
              </div>
              <div className="">{fileName}</div>
            </div>
            <div className="file-errors-body">{errorNumber}</div>
          </div>
          <div className="body-right">
            {Object.entries(errors).map(([key, val]) => {
              let errorType = getErrorType(key);

              if (val.length) {
                return (
                  <div className="error-body-description-wrapper">
                    <div className="error-type-body">{errorType}</div>
                    <div className="error-body-description">
                      {val.map((des, index) => {
                        if (!isExpanded) {
                          if (index === 0) {
                            return <p id={des.id}>{des.message.string}</p>;
                          }
                        } else {
                          return <p id={des.id}>{des.message.string}</p>;
                        }
                      })}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div className="error-body" id={fileName}>
          <div className="body-left">
            <div className="file-name-body">
              <div className="icon-set">
                <UP />
                <div className="gap" />
                <DOWN />
              </div>
              <div className="file-name-body-text">{fileName}</div>
            </div>
            <div className="file-errors-body">{errorNumber}</div>
          </div>
          <div className="body-right">
            <div className="error-body-description-wrapper">
              <div className="error-type-body">None</div>
              <div className="error-body-description">
                <p id="no-error-found-2" className="secondaryColor">{t("No Errors Found in File")}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="error-modal-container">
        <div className="error-header">
          <div className="header-left">
            <div className="file-name" id="error-mod-file-name">{t("File Name")}</div>
            <div className="file-errors" id="error-mod-error">Errors</div>
          </div>
          <div className="header-right">
            <div className="error-type" id="error-mod-error-type">{t("Error Type")}</div>
            <div className="error-description" id="error-mod-err-desc">{t("description")}</div>
          </div>
        </div>
        {Object.entries(formbuilderErrors.forms).map(([key, val]) => (
          <RenderFormErrorBody fileName={key} errors={val} />
        ))}
        {Object.entries(formbuilderErrors.workflow).map(([key, val]) => (
          <RenderWorkflowErrorBody fileName={key} errors={val} />
        ))}
      </div>
      {/* <div className="warning-banner">Warnings : {totalWarningsNumber}</div>
      <div className="warning-modal-container">
        <div className="error-header">
          <div className="header-left-warning">
            <div className="file-name">File Name</div>
          </div>
          <div className="header-right-warning">Description</div>
        </div>
        <div className="error-body">
          <div className="body-left-warning">
            <div className="file-name-body">
              <div className="icon-set">
                <UP />
                <div className="gap" />
                <DOWN />
              </div>
              <div className="file-name-body-text">Approval.dmn</div>
            </div>
          </div>
          <div className="body-right-warning">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
              vulputate libero et velit interdum, ac aliquet odio mattis. Class
              aptent taciti sociosqu ad litora torquent per conubia nostra, per
              inceptos himenaeos.
            </p>
          </div>
        </div>
      </div> */}
    </>
  );
}
