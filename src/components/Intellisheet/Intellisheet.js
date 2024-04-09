import React from "react";
import { Spreadsheet } from "react-spreadsheet";
import "./Intellisheet.css";

export default function Intellisheet({
  intellisheetState,
  setIntellisheetState,
  selectedIntellisheetId,
}) {
  return (
    <>
      {intellisheetState?.map((sheet) => (
        <div
          style={{
            display: sheet._id === selectedIntellisheetId ? null : "none",
            maxHeight: "100%",
          }}
        >
          <Spreadsheet
            data={sheet.data}
            onChange={(data) => {
              const temp = intellisheetState.map((item) => {
                if (item.id === sheet.id) {
                  return { id: item.id, _id: item._id, data };
                } else {
                  return item;
                }
              });
              setIntellisheetState([...temp]);
            }}
            id="intellisheet-data-Spreadsheet"
          />
        </div>
      ))}
    </>
  );
}
