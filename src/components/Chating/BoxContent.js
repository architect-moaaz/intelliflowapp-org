import React, { useEffect, useState, useRef } from "react";
import "./BoxContent.css";
import searchIcon from "../../assets/NewIcon/searchMsgIcon.svg";
import Contacts from "./Contacts";

const BoxContent = ({ users, currentUser}) => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("Contacts");
  const [currentChat, setCurrentChat] = useState(undefined);


  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="box-content">
      <div className="search-container">
        <input
          type="search"
          placeholder="Search to start a new chat..." 
          value={searchValue}
          onChange={handleSearchChange}
        />
        <button>
          <img src={searchIcon} alt="Search" />
        </button>
      </div>
      <div className="chatTabs">
        <button
          className={`chatTab ${activeTab === "Contacts" ? "active" : ""}`}
        >
          Chats
        </button>

      </div>

      {activeTab === "Contacts" && (
        <Contacts
          users={users}
          currentUser={currentUser}
          currentChat={currentChat}
          changeChat={handleChatChange}
          searchValue={searchValue}
          // newMessageTime={newMessageTime}
        />
      )}
      
    </div>
  );
};

export default BoxContent;
