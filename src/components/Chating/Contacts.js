import React, { useState, useEffect, useRef } from "react";
import ThreeDots from "../../assets/NewIcon/ThreeDotsMini.svg";
import axios from "axios";
import { Dropdown } from "react-bootstrap";
import ChatContainer from "./ChatContainer";
import userPic from "../../assets/NewIcon/userImage.jpg";
import { useRecoilValue } from "recoil";
import { getMessagesInstanceState } from "../../state/atom";

const Contacts = ({
  users,
  currentUser,
  currentChat,
  changeChat,
  searchValue,
  newMessageTime,
}) => {
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [contacts, setContacts] = useState(users);
  const [senderOrder, setSenderOrder] = useState(0);
  const socket = useRef();
  const [newMsgContact, setNewMsgContact] = useState("");
  const [newMessageReceived, setNewMessageReceived] = useState("");
  const getMessagesInstance = useRecoilValue(getMessagesInstanceState);

  const handleReceivedMessage = () => {
    fetchMessages();
  };

  useEffect(() => {
    handleReceivedMessage();
  }, [getMessagesInstance]);

  const fetchMessages = async (contact) => {
    const data = localStorage.getItem("id");
    const response = await axios.post(
      process.env.REACT_APP_CHAT_ENDPOINT + "/api/messages/getmsg",
      {
        from: data,
        to: contact?._id,
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

  const getLastMessages = async () => {
    let tempLastMessage = contacts.map(async (con) => {
      let lastMessage = await fetchMessages(con);

      return {
        ...con,
        lastMessage: lastMessage,
      };
    });

    await Promise.all(tempLastMessage).then((value) => {
      setContacts([...value]);
    });
  };

  useEffect(() => {
    getLastMessages();
  }, [getMessagesInstance]);

  const lastMsgTime = () => {
    const sortedContacts = contacts.slice().sort((a, b) => {
      const timestampA = a.timestamp || 0;
      const timestampB = b.timestamp || 0;
      return timestampB - timestampA;
    });
    setContacts(sortedContacts);
  };
  useEffect(() => {
    lastMsgTime();
  }, [senderOrder]);

  useEffect(() => {
    console.log("time check");
    const sortedContacts = contacts.slice().sort((a, b) => {
      const timestampA = a.timestamp || 0;
      const timestampB = b.timestamp || 0;
      return timestampB - timestampA;
    });
    setContacts(sortedContacts);
  }, []);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected([contact._id, contact.username]);
    changeChat(contact);
  };

  const fetchMessagess = async () => {
    const data = localStorage.getItem("id");
    const response = await axios.post(
      process.env.REACT_APP_CHAT_ENDPOINT + "/api/messages/getmsg",
      {
        from: data,
        to: currentChat._id,
      },
      {
        headers: localStorage.getItem("workspace"),
      }
    );
    console.log(response.data);
  };

  const activeChats = contacts.filter(
    (contact) => contact.lastMessage !== "Start New Chat"
  );

  console.log("contacts", contacts);

  return (
    <>
      {currentUser &&
        (searchValue.length > 0 ? (
          <div className="scrollable-content customScrollBar">
            {contacts
              ?.filter((contact, index) =>
                contact.username
                  ?.toLowerCase()
                  .replace(/\.[^/.]+$/, "")
                  .includes(searchValue.toLowerCase())
              )
              .sort((a, b) => {
                const timestampA = a.timestamp || 0;
                const timestampB = b.timestamp || 0;
                return timestampB - timestampA;
              })
              ?.map((contact, index) => {
                if (contact._id !== currentUser[1]) {
                  return (
                    <div className="main-msg-container">
                      <div
                        className="username-box"
                        onClick={() => changeCurrentChat(index, contact)}
                      >
                        <div className="userprofile-container">
                          <img
                            src={`${
                              process.env.REACT_APP_CDS_ENDPOINT
                            }IFprofilePicture/image/${
                              contact._id
                            }?Authorization=${localStorage.getItem(
                              "token"
                            )}&workspace=${localStorage.getItem("workspace")}`}
                            onError={(e) => {
                              e.target.src = `${userPic}`;
                            }}
                            crossOrigin="Anonymous"
                            className="profile-image-user"
                            alt="Search Icon"
                          />
                        </div>
                        <div className="user-info-name-lastmsg-box">
                          <div className="user-name-lastmsg">
                            <h6 className="user-name-messaging">
                              {contact.username}
                            </h6>
                          </div>
                          <p className="last-msg-user">
                            {contact?.lastMessage}
                          </p>
                        </div>
                        <div className="user-msg-date-and-dot">
                          <div className="three-dots-msg">
                            <Dropdown className="dropdown kebabMenu">
                              <Dropdown.Toggle
                                variant=""
                                className="p-0"
                                id="dropdown-basic"
                              >
                                <img
                                  src={ThreeDots}
                                  height="10px"
                                  style={{ marginLeft: "24px", border: "none" }}
                                  alt=""
                                />
                              </Dropdown.Toggle>
                              <Dropdown.Menu
                                className=" ss"
                                style={{ width: "5px" }}
                              >
                                <Dropdown.Item>Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          <div
                            className="lastmsg-date"
                            style={{ marginTop: "20px" }}
                          >
                            {(() => {
                              const contactTimestamp = contact.timestamp;

                              if (!contactTimestamp) {
                                return null;
                              }

                              const messageDate = new Date(contactTimestamp);
                              const currentDate = new Date();

                              if (
                                messageDate.getDate() ===
                                  currentDate.getDate() &&
                                messageDate.getMonth() ===
                                  currentDate.getMonth() &&
                                messageDate.getFullYear() ===
                                  currentDate.getFullYear()
                              ) {
                                return (
                                  <p style={{ fontSize: "10px" }}>
                                    {messageDate.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                );
                              } else {
                                return (
                                  <p style={{ fontSize: "10px" }}>
                                    {`${messageDate.toLocaleString("default", {
                                      day: "numeric",
                                      month: "short",
                                    })}`}
                                  </p>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="bottomLine-seperate"></div>
                    </div>
                  );
                }
              })}
          </div>
        ) : (
          <div className="scrollable-content customScrollBar">
            {activeChats
              ?.filter((contact, index) =>
                contact.username
                  ?.toLowerCase()
                  .replace(/\.[^/.]+$/, "")
                  .includes(searchValue.toLowerCase())
              )
              .sort((a, b) => {
                const timestampA = a.timestamp || 0;
                const timestampB = b.timestamp || 0;
                return timestampB - timestampA;
              })
              ?.map((contact, index) => {
                if (contact._id !== currentUser[1]) {
                  return (
                    <div className="main-msg-container">
                      <div
                        className="username-box"
                        onClick={() => changeCurrentChat(index, contact)}
                      >
                        <div className="userprofile-container">
                          <img
                            src={`${
                              process.env.REACT_APP_CDS_ENDPOINT
                            }IFprofilePicture/image/${
                              contact._id
                            }?Authorization=${localStorage.getItem(
                              "token"
                            )}&workspace=${localStorage.getItem("workspace")}`}
                            onError={(e) => {
                              e.target.src = `${userPic}`;
                            }}
                            crossOrigin="Anonymous"
                            className="profile-image-user"
                            alt="Search Icon"
                          />
                        </div>
                        <div className="user-info-name-lastmsg-box">
                          <div className="user-name-lastmsg">
                            <h6 className="user-name-messaging">
                              {contact.username}
                            </h6>
                          </div>
                          <p className="last-msg-user">
                            {contact?.lastMessage}
                          </p>
                        </div>
                        <div className="user-msg-date-and-dot">
                          <div className="three-dots-msg">
                            <Dropdown className="dropdown kebabMenu">
                              <Dropdown.Toggle
                                variant=""
                                className="p-0"
                                id="dropdown-basic"
                              >
                                <img
                                  src={ThreeDots}
                                  height="10px"
                                  style={{ marginLeft: "24px", border: "none" }}
                                  alt=""
                                />
                              </Dropdown.Toggle>
                              <Dropdown.Menu
                                className=" ss"
                                style={{ width: "5px" }}
                              >
                                <Dropdown.Item>Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                          <div
                            className="lastmsg-date"
                            style={{ marginTop: "20px" }}
                          >
                            {(() => {
                              const contactTimestamp = contact.timestamp;

                              if (!contactTimestamp) {
                                return null;
                              }

                              const messageDate = new Date(contactTimestamp);
                              const currentDate = new Date();

                              if (
                                messageDate.getDate() ===
                                  currentDate.getDate() &&
                                messageDate.getMonth() ===
                                  currentDate.getMonth() &&
                                messageDate.getFullYear() ===
                                  currentDate.getFullYear()
                              ) {
                                return (
                                  <p style={{ fontSize: "10px" }}>
                                    {messageDate.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                );
                              } else {
                                return (
                                  <p style={{ fontSize: "10px" }}>
                                    {`${messageDate.toLocaleString("default", {
                                      day: "numeric",
                                      month: "short",
                                    })}`}
                                  </p>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </div>
                      <div className="bottomLine-seperate"></div>
                    </div>
                  );
                }
              })}
          </div>
        ))}
      {currentSelected && (
        <ChatContainer
          currentSelected={currentSelected}
          setCurrentSelected={setCurrentSelected}
          currentUser={currentUser}
          currentChat={currentChat}
          getLastMessages={getLastMessages}
          setSenderOrder={setSenderOrder}
          senderOrder={senderOrder}
          newMessageTime={newMessageTime}
        />
      )}
    </>
  );
};

export default Contacts;
