import { Icon } from "@iconify/react";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./UserRole.css";
import PrevArrow from "../../../../assets/datagridIcons/PrevArrow";
import NextArrow from "../../../../assets/datagridIcons/NextArrow";
import axios from "axios";
import { useTranslation } from "react-i18next";
import CommonPagination from "../../../Pagination/CommonPagination";

const UserRole = ({ editableRoleData, setShowEditRole }) => {
  const token = localStorage.getItem("token");

  const [usersRoleList, setUsersRoleList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [t, i18n] = useTranslation("common");
  const [pageCountUsersInRole, setPageCountUsersInRole] = useState(0);
  const [offsetUsersInRole, setOffsetUsersInRole] = useState(1);
  const [paginatedUsersRoleList, setPaginatedUsersRoleList] = useState([]);

  useEffect(() => {
    usersinRole();
  }, []);

  //pagination
  const usersInRoleInitialPagination = (allUsersList) => {
    let pageSize = 5;

    let tempPageCount = allUsersList.length / pageSize;

    setPageCountUsersInRole(Math.ceil(tempPageCount));

    let allValuestemp = allUsersList;
    var startIndex = (offsetUsersInRole - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedUsersRoleList(values);
  };

  useEffect(() => {
    usersInRolePageChange();
  }, [offsetUsersInRole]);

  const usersInRolePageChange = () => {
    let pageSize = 5;
    let allValuestemp = [...usersRoleList];
    var startIndex = (offsetUsersInRole - 1) * pageSize;

    let values = allValuestemp.slice(startIndex, startIndex + pageSize);

    setPaginatedUsersRoleList(values);
  };

  const fetchAllRoles = () => {
    var axios = require("axios");
    var data = "";

    var config = {
      method: "get",
      maxBodyLength: Infinity,
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT + `IDENTITY/roles/fetchroles`,
      headers: {
        access_token: token,
        "Content-Type": "application/json",
        workspace: "Intelliflow",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        if (response.data.status !== 401) {
          setRolesList(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const usersinRole = () => {
    var config = {
      method: "get",
      url:
        process.env.REACT_APP_IDENTITY_ENDPOINT +
        `IDENTITY/roles/${editableRoleData.name}/users`,
    };

    axios(config)
      .then(function (response) {
        setUsersRoleList(response.data);

        usersInRoleInitialPagination(response.data);

        fetchAllRoles();
        setShowEditRole(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="role_main_table_body">
      <div className="role_main_table_wrap">
        <div className="role_main_table_head ">
          <div className="role_table_search">
            <Link to="#">
              <Icon icon="akar-icons:search" />
            </Link>
            <input
              type="text"
              placeholder={t("search")}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
      <div className="role_main_table_body">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsersRoleList
              .filter((row, index) => {
                // console.log("row", row);
                if (searchTerm != "") {
                  for (const key in row) {
                    let value = String(row[key]);
                    if (value && value.includes(searchTerm)) {
                      return row;
                    }
                  }
                } else {
                  return row;
                }
              })
              .map((group) => {
                return (
                  <tr>
                    <td>{group.username}</td>
                    <td>{group?.email} </td>
                    <td>{group.firstName} </td>
                    <td>{group.lastName} </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        <CommonPagination
          pageCount={pageCountUsersInRole}
          setOffset={setOffsetUsersInRole}
        />
      </div>
    </div>
  );
};
export default UserRole;
