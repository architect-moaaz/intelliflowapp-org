import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import "./DraggableChatButton.css";
import messageIcon from "../../assets/NewIcon/message.svg";
import BoxContent from "./BoxContent";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { getMessagesInstanceState } from "../../state/atom";
// import myAudio from "./ting.mp3";

const DraggableChatButton = () => {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragged, setIsDragged] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: -20, y: -100 });
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [newMessageTime, setNewMessageTime] = useState("");
  const boxRef = useRef(null);
  const buttonRef = useRef(null);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const getMessagesInstance = useRecoilValue(getMessagesInstanceState);
  var currentUser = [localStorage.getItem("email"), localStorage.getItem("id")];

  const handleReceivedMessage = () => {
    console.log("testing message", { getMessagesInstance });
    if (getMessagesInstance!=="") {
      setHasNewMessage(true);
      fetchMessages();
    }
  };

  useEffect(() => {
    handleReceivedMessage();
  }, [getMessagesInstance]);

  const fetchMessages = async (contact) => {
    const data = localStorage.getItem("id");
    const response = await axios.post(
      process.env.REACT_APP_CHAT_ENDPOINT+ "/api/messages/getmsg",
      {
        from: data,
        to: contact._id,
      },
      {
        headers: localStorage.getItem("workspace"),
      }
    );
    if (response.data.length != 0) {
      const latestMessage = response.data[response.data.length - 1];
      contact.lastMessage = latestMessage.message;
      contact.timestamp = latestMessage.time;
      for (let i = response.data.length - 1; i >= 0; i--) {
        if (!response.data[i].fromSelf) {
          return response.data[i].message;
        } else if (response.data[i].fromSelf) {
          return `Sent: ${response.data[i].message}`;
        }
      }
    } else {
      return "Start New Chat";
    }
    return;
  };

  const getUsers = async () => {
    const token = localStorage.getItem("token");
    const workspace = localStorage.getItem("workspace");
    try {
      let userapi = {
        method: "get",
        url: process.env.REACT_APP_CHAT_ENDPOINT+ "/api/users/getUsers",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(userapi);
      if (response.status === 200)
        if (users !== response?.data?.users) {
          setUsers(response.data.users);
        }
    } catch (error) {
      console.error("Error getting users:", error);
    }
  };

  const addusers = async () => {
    let userapi = {
      method: "post",
      url: process.env.REACT_APP_CHAT_ENDPOINT+ "/api/users/addUsers",
      headers: {
        loggedInUsername: localStorage.getItem("id"),
        "Content-Type": "application/json",
      },
    };
    await axios
      .request(userapi)
      .then((response) => {
        getUsers();
      })
      .catch((error) => {
        getUsers();
      });
  };

  useEffect(() => {
    getUsers();
  }, [getMessagesInstance]);

  useEffect(() => {
    addusers();
  }, []);

  const toggleBox = async () => {
    if (!isDragging && !isDragged) {
      setIsBoxOpen((prev) => !prev);
      addusers();
    }
    setIsDragged(false);
  };

  const handleStartDrag = () => {
    setIsDragging(true);
  };

  const handleStopDrag = (event, data) => {
    setIsDragging(false);
    setButtonPosition({ x: data.x, y: data.y });
  };

  const handleDrag = () => {
    setIsDragged(true);
  };

  const handleCloseBox = () => {
    setIsBoxOpen(false);
    setHasNewMessage(false);
  };

  return (
    <>
      {!isBoxOpen && (
        <Draggable
          defaultPosition={buttonPosition}
          onStart={handleStartDrag}
          onStop={handleStopDrag}
          onDrag={handleDrag}
        >
          <div
            ref={buttonRef}
            className="draggable-chat-button"
            onClick={toggleBox}
          >
            {hasNewMessage && (
              <div className={`new-message-dot ${isBoxOpen ? "hidden" : ""}`} />
            )}
            <img src={messageIcon} className="messageIcon" alt="message icon" />
            Chat
          </div>
        </Draggable>
      )}

      {isBoxOpen && (
        <div ref={boxRef} className="DraggableChatButtonbox">
          <div className="box-header">
            Messaging
            <button className="chat-close-button" onClick={handleCloseBox}>
              &times;
            </button>
          </div>
          <div className="box-user">
            {users.length > 0 && (
              <BoxContent
                users={users}
                currentUser={currentUser}
                // newMessageTime={newMessageTime}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DraggableChatButton;
