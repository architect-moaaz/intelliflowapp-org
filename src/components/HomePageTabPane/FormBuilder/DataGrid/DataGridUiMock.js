import React from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import { Link } from "react-router-dom";
import { DeleteIco } from "../../../../assets";
import "../../../DataTable/Table.css";

export default function DataGridUiMock({ onClick, item, deleteItem }) {
  const columns = item.dataGridProperties?.cols?.filter(
    (item) => item.required === true
  );
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
        <div className="row custom-caption">
          <caption className="custom-caption-title">
            {item.fieldName ? item.fieldName : "Grid Name"}
          </caption>
          <table className="table-custom">
            <thead className="table-custom-header">
              <tr>
                {!columns[0] && (
                  <th className="custom-th" colSpan={columns ? "100%" : null}>
                    Dummy Header
                  </th>
                )}
                {columns?.map((item) => (
                  <th className="custom-th">{item.displayName ? item.displayName : item.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {!columns[0] && (
                  <td
                    className="rightbortder"
                    colSpan={columns ? "100%" : null}
                  >
                    Dummy Data
                  </td>
                )}
                {columns?.map((item) => (
                  <td className="rightbortder">
                    <div className="transparentStyle" />
                  </td>
                ))}
              </tr>
              <tr>
                {!columns[0] && (
                  <td
                    className="rightbortder"
                    colSpan={columns ? "100%" : null}
                  >
                    Dummy Data
                  </td>
                )}
                {columns?.map((item) => (
                  <td className="rightbortder">
                    <div className="transparentStyle" />
                  </td>
                ))}
              </tr>
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
      </div>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="data-grid-delete-icon"
      />
    </div>
  );
}
