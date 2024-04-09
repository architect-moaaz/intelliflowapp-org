import React, { useState, useEffect } from "react";
import "./KeyVaultTable.css";
import copyKeyVault from "../../assets/NewIcon/copyKeyVault.svg";
import deleteKeyVault from "../../assets/NewIcon/deleteKeyVault.svg";
import updateKeyVault from "../../assets/NewIcon/updateKeyVault.svg";
import CommonPagination from "../../components/Pagination/CommonPagination";
import { toast } from "react-toastify";

const KeyVaultTable = ({
  TableData,
  TableHeaders,
  searchKeyword,
  callbackDataKey,
  onOpenDeleteModal,
  callbackOffset,
  totalPages,
}) => {
  // console.log("searchkeyword", searchKeyword);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(1);

  useEffect(() => {
    callbackOffset(offset);
  }, [offset]);

  const copyKeyVaultHandle = (json) => {
    const id = toast.loading("Copied Successfully");
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value = JSON.stringify(json);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    toast.update(id, {
      render: "Copied Successfully  ",
      position: "top-center",
      autoClose: 6000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type: "success",
      isLoading: false,
    });
  };

  return (
    <div
      style={{
        paddingLeft: "5px",
        paddingRight: "5px",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div>
        <table className="simple-table Key-Vault-Table">
          <tbody>
            <tr className="simple-table-header">
              {TableHeaders?.map((header) => {
                return <th>{header.headerName}</th>;
              })}
            </tr>
            {TableData?.map((data, index) => {
              return (
                <tr>
                  <td>{data.dataKey}</td>
                  <td>{data.createdBy}</td>
                  <td>{data.createdOn}</td>
                  <td>{data.workspace}</td>
                  <td>{data.appName}</td>
                  <td>
                    <ul className="KeyVaultTableUl">
                      <li className="KeyVaultTableli">
                        <img
                          src={updateKeyVault}
                          onClick={() => callbackDataKey(data)}
                          alt=""
                        />
                      </li>
                      <li className="KeyVaultTableli">
                        <img
                          src={copyKeyVault}
                          alt=""
                          onClick={() => copyKeyVaultHandle(data)}
                        />
                      </li>
                      <li className="KeyVaultTableli">
                        <img
                          src={deleteKeyVault}
                          alt=""
                          onClick={() => onOpenDeleteModal(data.dataKey)}
                        />
                      </li>
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="KeyVaultPagination">
          <CommonPagination pageCount={totalPages} setOffset={setOffset} />
        </div>
      </div>
    </div>
  );
};

export default KeyVaultTable;
