import { Icon } from "@iconify/react";
import React from "react";
import { Link } from "react-router-dom";
import { Tab, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./EditGroups.css";
import EditUserDetail from "../EditUserDetail/EditUserDetail";
import { useTranslation } from "react-i18next";

const EditGroups = () => {
  const [t, i18n] = useTranslation("common");
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Has the User’s Email been verified
    </Tooltip>
  );
  return (
    <div className="default_grup_wrap">
       <div className="grup_card available_grup">
        <div className="grup_card_header">
          <h6 className="w-100 primaryColor">
            Available Groups
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="editGroups-availableGroups-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </h6>
          <div className="grup_header_wrap">
            <div className="role_table_search">
              <Link to="#">
                <Icon icon="akar-icons:search" />
              </Link>
              <input type="text" placeholder={t("search")}/>
            </div>
            <Link id="editGroups-viewAllGroups-link" to="/" className="btn btn-orange-white">
              View all groups
            </Link>
            <Link id="editGroups-leave-link" to="/" className="btn btn-orange-white ms-2">
            Leave
            </Link>
          </div>
        </div>
        <div className="grup_card_body">
          <ul className="gruop_main_list">
            <li>
              <Link to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                Sr Managers
              </Link>
            </li>
            <li>
              <Link to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                testgrp
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="grup_card available_grup">
        <div className="grup_card_header">
          <h6 className="w-100 primaryColor">
            Available Groups
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
              id="editGroups-availableGroups-OverlayTrigger"
            >
              <Icon icon="eva:question-mark-circle-fill" />
            </OverlayTrigger>
          </h6>
          <div className="grup_header_wrap">
            <div className="role_table_search">
              <Link to="#">
                <Icon icon="akar-icons:search" />
              </Link>
              <input type="text" placeholder={t("search")} />
            </div>
            <Link id="editGroups-viewAllGroups-link2" to="/" className="btn btn-orange-white">
              View all groups
            </Link>
            <Link id="editGroups-join-link" to="/" className="btn btn-orange-white ms-2">
            Join
            </Link>
          </div>
        </div>
        <div className="grup_card_body">
          <ul className="gruop_main_list">
            <li>
              <Link to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                Sr Managers
              </Link>
            </li>
            <li>
              <Link id="editGroups-testGrp-link" to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                testgrp
              </Link>
            </li>
            <li>
              <Link id="editGroups-testGrp1-link" to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                testgrp
              </Link>
            </li>
            <li>
              <Link id="editGroups-testGrp2-link" to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                testgrp
              </Link>
            </li>
            <li>
              <Link id="editGroups-testGrp3-link" to="/">
                <i>
                  <Icon icon="nimbus:file-alt"></Icon>
                </i>
                testgrp
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default EditGroups;
