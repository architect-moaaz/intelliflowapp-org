import React, { useState } from "react";
import "./MultiMenus.css";
import styled from "styled-components";
import downTriangle from "../../../assets/Icons/downTriangle.svg";

const MultiMenus = ({ newMenus }) => {
  const [activeMenus, setActiveMenus] = useState([]);

  const ItemDiv = styled.div`
    display: flex;
    padding-left: ${(props) => `${props.dept * 18}px`};
  `;
  const Spam = styled.div`
    background-image: url(${downTriangle});
    display: block;
    z-index: 3;
    opacity: 0.6;
    position: absolute;
    height: 9px;
    width: 9px;
    right: 11px;
    top: 13px;
    border-radius: 0px;
    background-size: 100% 100%;
    content: "";
    transform: ${(props) => (props.toggle ? "rotate(180deg)" : "rotate(0deg)")};
  `;

  const handleMenuClick = (data, menuName) => {
    // console.log("handleMenuClick", data);
    let newActiveMenus = [...activeMenus];

    if (newActiveMenus.includes(menuName)) {
      var index = newActiveMenus.indexOf(menuName);
      if (index > -1) {
        newActiveMenus.splice(index, 1);
      }
    } else {
      newActiveMenus.push(menuName);
    }
    // console.log("menuName", menuName);
    setActiveMenus(newActiveMenus);
  };

  // const handleArrowClick = (menuName) => {
  //   let newActiveMenus = [...activeMenus];

  //   if (newActiveMenus.includes(menuName)) {
  //     var index = newActiveMenus.indexOf(menuName);
  //     if (index > -1) {
  //       newActiveMenus.splice(index, 1);
  //     }
  //   } else {
  //     newActiveMenus.push(menuName);
  //   }
  //   console.log("menuName", menuName);
  //   setActiveMenus(newActiveMenus);
  // };

  const ListMenu = ({ dept, data, hasSubMenu, menuName, menuIndex }) => (
    <div className="searchLi">
      <ItemDiv className="itemDiv" dept={dept}>
        <div
           id="multiMenus-drop-listLable"
          className="droplistLable"
          onClick={() => handleMenuClick(data, menuName)}
        >
          {/* <img src={data.icon} width={10} height={10} />  */}
          {data.label.includes(".")
            ? data.label.split(".").slice(0, -1).join(".")
            : data.label}
        </div>
        {hasSubMenu && (
          <Spam
            className="arrow"
            // onClick={() => handleArrowClick(menuName)}
            toggle={activeMenus.includes(menuName)}
          ></Spam>
        )}
      </ItemDiv>
      {/* {console.log("data.icon", data)} */}
      {hasSubMenu && (
        <SubMenu
          dept={dept}
          data={data.submenu}
          toggle={activeMenus.includes(menuName)}
          menuIndex={menuIndex}
        />
      )}
    </div>
  );

  const SubMenu = ({ dept, data, toggle, menuIndex }) => {
    if (!toggle) {
      return null;
    }

    dept = dept + 1;

    return (
      <div className="searchUl">
        {data.map((menu, index) => {
          const menuName = `sidebar-submenu-${dept}-${menuIndex}-${index}`;

          return (
            <ListMenu
              dept={dept}
              data={menu}
              hasSubMenu={menu.submenu}
              menuName={menuName}
              key={menuName}
              menuIndex={index}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="searchUl">
      {newMenus.map((menu, index) => {
        const dept = 1;
        const menuName = `sidebar-menu-${dept}-${index}`;

        return (
          <ListMenu
            dept={dept}
            data={menu}
            hasSubMenu={menu.submenu}
            menuName={menuName}
            key={menuName}
            menuIndex={index}
          />
        );
      })}
    </div>
  );
};

export default MultiMenus;
