import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";

import CommonModelContainer from "../CommonModel/CommonModelContainer";

export default function AddSource({
  openAddSourceModal,
  onCloseAddSourceModal,
  data,
  connectionName,
}) {
  const [addSourceData, setAddSourceData] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState("");

  useEffect(() => {
    getData();
  }, [connectionName]);

  function getData() {
    axios
      .get(
        `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/tables/${connectionName}`
      )
      .then((res) => {
        setAddSourceData(res.data);
      })
      .catch((e) => console.log(e));
  }

  const RenderTable = () => {
    const buttonClicked = (item) => {
      axios
        .post(
          `${process.env.REACT_APP_UNIVERSAL_CONNECTOR_ENDPOINT}/connector/table-structure`,
          JSON.stringify({
            tables: [item],
            connectionName: connectionName,
          })
        )
        .then((res) => {})
        .catch((error) => console.error(error));
    };

    switch (selectedFamily) {
      case "CDC":
        return (
          <div>
            {data.map((item) => {
              return (
                <button onClick={() => buttonClicked(item)}>
                  {item ?? null}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <CommonModelContainer
      modalTitle="Add Source"
      show={openAddSourceModal}
      handleClose={onCloseAddSourceModal}
    >
      <Modal.Body className="modal-scroll">
        <>
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
          >
            <option value="">Please select connector Family: </option>
            <option value="CDC">CDC</option>
            <option value="JDBC">JDBC</option>
          </select>
          {selectedFamily && <RenderTable />}
        </>
      </Modal.Body>
    </CommonModelContainer>
  );
}
