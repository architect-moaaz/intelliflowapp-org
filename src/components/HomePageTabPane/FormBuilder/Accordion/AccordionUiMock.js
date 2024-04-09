import React, { useState } from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";
import Accordion from "react-bootstrap/Accordion";
import "../Tab/Tab.css";

export default function AccordionUiMock({
  onClick,
  item,
  deleteItem,
  Orderkey,
}) {
  const RenderAccordion = () => {
    const RenderAccordions = ({ acc, index }) => {
      return (
        <Accordion.Item eventKey={index}>
          <Accordion.Header>
            <div style={{ color: "#ff5711" }}>{acc.accordionName}</div>
          </Accordion.Header>
          <Accordion.Body>
            {acc?.items?.map((des) => (
              <p>{des.description}</p>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      );
    };

    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <div>{item.fieldName ? parse(item.fieldName) : "Accordion"}</div>

        <div class="accordion" id="accordionExample">
          <div class="accordion" id="accordionExample">
            <Accordion defaultActiveKey={0} flush>
              {item.accordionProperties.map((item, index) => (
                <RenderAccordions acc={item} index={index} />
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    );
  };

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
        <RenderAccordion />
      </div>
      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="accordion-delete-icno"
      />
    </div>
  );
}
