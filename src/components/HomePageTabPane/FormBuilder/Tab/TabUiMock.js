import React, { useState } from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import "./Tab.css";

export default function TabUiMock({ onClick, item, deleteItem, Orderkey }) {
  const [key, setKey] = useState(0);

  return (
    <div className="mockElement ">
      <div
        className="customScrollBar"
        style={{
          overflow: "auto",
          maxWidth: "90%",
          maxHeight: "90%",
          minHeight: "50%",
        }}
      >
        <div id="tab-field-name" >{item.fieldName ? parse(item.fieldName) : "Tabs"}</div>
        <div>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(parseInt(k))}
            className="mb-3"
          >
            {item.tabProperties.map((tab, index) => (
              <Tab
                eventKey={index}
                title={
                  <div
                    style={{
                      padding: "5px",
                      color: index === key ? "#ff5711" : "#0D3C84",
                    }}
                  >
                    {tab.tabName}
                  </div>
                }
              >
                {tab.items.map((des) => (
                  <p style={{ backgroundColor: "transparent" }} id={des.id}>
                    {des.description}
                  </p>
                ))}
              </Tab>
            ))}
          </Tabs>
        </div>
      </div>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="tab-delete-icon"
      />
    </div>
  );
}
