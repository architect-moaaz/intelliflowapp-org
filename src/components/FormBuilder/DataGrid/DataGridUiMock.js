import React, { useEffect } from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { Link } from "react-router-dom";
import { DeleteIco } from "../../../assets";
import "../../DataTable/Table.css";

const DataGridUiMock = ({ onClick, item, deleteItem }) => {
  const columns = item.dataGridProperties?.cols?.filter(
    (item) => item.required === true
  );
  const initialRows = [1, 2, 3, 4, 5];

  return (
    <div
      className="bg-white"
      key={item.id}
      // onClick={() => onClick()}
    >
      <div className="mockElement ">
        {/* <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="Checkbox"
        /> */}
        <div className="row custom-caption py-1 bg-white">
          <div className="col-md-6 table-heading-container">
            <span className="custom-caption-title my-2 secondaryColor">
              {item.fieldName ? item.fieldName : "This is a grid"}
            </span>
          </div>
          {/* <span className="bg-info">hi{JSON.stringify(item)}</span> */}
          <div className="col-md-6">
            {/* <button className="btn btn-primary p-2 custom-download-button">
              Download
            </button> */}
          </div>
          <table className="table-custom customScrollBar">
            <thead className="table-custom-header">
              <tr>
                <th
                  className="custom-th"
                  colSpan={columns ? "100%" : null}
                  style={{
                    backgroundColor:
                      item?.dataGridProperties?.style?.headerBackgroundColor ||
                      "",
                  }}
                >
                  <input
                    type="checkbox"
                    className="form-check-input table-checkbox action-checkbox"
                    name=""
                    id=""
                  />
                </th>
                {columns?.map((col) => (
                  <th
                    className="custom-th"
                    style={{
                      backgroundColor:
                        item?.dataGridProperties?.style
                          ?.headerBackgroundColor || "",
                      color:
                        item?.dataGridProperties?.style?.headerTextColor || "",
                    }}
                  >
                    <div className="d-flex justify-content-start">
                      {col.displayName ? col.displayName : col.name}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialRows.map((r) => {
                return (
                  <tr className="datatr table-row">
                    <td
                      className="rightbortder"
                      colSpan={columns ? "100%" : null}
                    >
                      <div className="d-flex justify-content-center">
                        <input
                          type="checkbox"
                          className="form-check-input table-checkbox action-checkbox"
                          name=""
                          id=""
                        />
                      </div>
                    </td>
                    {columns?.map((item) => (
                      <td className="rightbortder">
                        <div className="transparentStyle" />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>

            {/* <tfoot>
              <tr>
                <td>
                  <Link >
                    <button className="add-row">+</button>
                  </Link>
                  <span>Add New Row</span>
                </td>
                <td colspan="100%">
                  <div className="pagination pull-right">
                    <button className="arrow-button p-1 ms-1 me-1">
                      {"<<"}
                    </button>{" "}
                    <button className="arrow-button p-1 ms-1 me-1">
                      {"<"}
                    </button>{" "}
                    <button className="arrow-button p-1 ms-1 me-1">
                      {">"}
                    </button>{" "}
                    <button className="arrow-button p-1 ms-1 me-1">
                      {">>"}
                    </button>{" "}
                    <span className="page-custom">
                      Page <strong>1 of N</strong>{" "}
                    </span>
                    <span>| Go to page: 1</span>
                    <select>
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          Show {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            </tfoot> */}
          </table>
        </div>
        <IcomoonReact
          className="mock-ui-del-icon"
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="DeleteIcon"
          onClick={(e) => deleteItem(e, item.id)}
          style={{ position: "absolute", float: "right" }}
          id="dataGridUiMock-delete-IcomoonReact"
        />
      </div>
    </div>
  );
};

export default DataGridUiMock;
