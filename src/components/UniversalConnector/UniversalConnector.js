import "./UniversalConnector.css";

import React, { useState } from "react";

import { Modal } from "react-bootstrap";
import { Sort } from "../../assets";
import CommonModelContainer from "../CommonModel/CommonModelContainer";
import ConnectionForm from "./ConnectionForm";
import ConnectorConnectionForm from "./ConnectorConnectionForm";
import ListConnections from "./ListConnections";
import ListConnectors from "./ListConnectors";
import { useTranslation } from "react-i18next";

export default function UniversalConnector() {
  const [t, i18n] = useTranslation("common");
  return (
    <>
      <div div className="custom-container">
        <ul
          class="nav nav-pills label-pills connector space-container"
          id="pills-tab"
          role="tablist"
        >
          <div
            className="column"
            style={{ color: "#2d2d2d", fontSize: "20px", fontWeight: "700" }}
          >
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active h-100"
                id="pills-connections-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-connections"
                type="button"
                role="tab"
                aria-controls="pills-connections"
                aria-selected="true"
              >
                Available Connections
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link h-100"
                id="pills-connectors-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-connectors"
                type="button"
                role="tab"
                aria-controls="pills-connectors"
                aria-selected="false"
              >
                Available Connectors
              </button>
            </li>
          </div>
          <div className="column space">
            <li>
              <ConnectionForm />
            </li>
            <li>
              <ConnectorConnectionForm />
            </li>
            <li>
              <input type="text" class="search-input" placeholder={t("search")} />
            </li>
          </div>
          <div className="border-bottom-line" />
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <button className="pull-right bg-transparent sort">
            <img src={Sort} alt="sort" className="sort-img" />
            {t("sort")}
          </button>
          <div
            class="tab-pane fade show active"
            id="pills-connections"
            role="tabpanel"
            aria-labelledby="pills-connections-tab"
          >
            <ListConnections />
          </div>
          <div
            class="tab-pane fade"
            id="pills-connectors"
            role="tabpanel"
            aria-labelledby="pills-connectors-tab"
          >
            <ListConnectors />
          </div>
        </div>

        {/* <div className="connections-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: "15px",
          }}
        >
          <h1>Available Connections </h1>
          <ConnectionForm />
        </div>
        <ListConnections />
      </div>
      <div className="connections-container">
        <h1>Available Connector </h1>
        <ListConnectors />
      </div> */}
      </div>
    </>
  );
}
