import React, { useState, useEffect } from "react";
import { Dropdown, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./AccessibilityMiniTable.css";

const AccessibilityMiniTable = ({ tableData }) => {
  return (
    <Container className="main-container">
      <div className="my-2 row-container">
        <div className="accessibilityPermissionText">
          <span className="table-font secondaryColor">Write</span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Actor
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.writeUsers?.length}</span>
              </span>
            </sup>
          </span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Work Group
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.writeGroups?.length}</span>
              </span>
            </sup>
          </span>
        </div>
      </div>

      <div className="my-2 row-container">
        <div className="accessibilityPermissionText">
          <span className="table-font secondaryColor">Read</span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Actor
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.readUsers?.length}</span>
              </span>
            </sup>
          </span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Work Group
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.readGroups?.length}</span>
              </span>
            </sup>
          </span>
        </div>
      </div>

      <div className="my-2 row-container">
        <div className="accessibilityPermissionText">
          <span className="table-font secondaryColor">Hide</span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Actor
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.hideUsers?.length}</span>
              </span>
            </sup>
          </span>
        </div>
        <div className="accessibilityPermissionText">
          <span className="table-font border-left secondaryColor">
            Work Group
            <sup>
              <span className="badge-container secondaryColor">
                <span className="badge secondaryColor">{tableData?.hideGroups?.length}</span>
              </span>
            </sup>
          </span>
        </div>
      </div>
    </Container>
  );
};

export default AccessibilityMiniTable;
