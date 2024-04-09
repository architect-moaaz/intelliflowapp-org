import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import "./ChatContainer.css";
import { FaVideo } from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { io } from "socket.io-client";
import userPic from "../../assets/NewIcon/userImage.jpg";
import { useRecoilValue } from "recoil";
import { getMessagesInstanceState } from "../../state/atom";

const ChatContainer = ({
  currentSelected,
  setCurrentSelected,
  currentUser,
  currentChat,
  getLastMessages,
}) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  const getMessagesInstance = useRecoilValue(getMessagesInstanceState);

  const fetchMessages = async () => {
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
    setMessages(response.data);
  };

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  useEffect(async () => {
    fetchMessages();
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        localStorage.getItem("id");
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleReceivedMessage = () => {
    const newMessage = { fromSelf: false, message: getMessagesInstance };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    getLastMessages();
    // console.log("Testing testing");
  };

  useEffect(() => {
    handleReceivedMessage();
  }, [getMessagesInstance]);

  const handleCloseMsgBox = () => {
    setCurrentSelected(null);
  };

  const startVideoCall = () => {
    // window.open("https://localhost:3010/join/889sad", "_blank");
    // navigator.mediaDevices
    //   .getUserMedia({ video: true, audio: true })
    //   .then((stream) => {
    //     // Set up local video stream
    //     setLocalStream(stream);
    //     // Create a new WebRTC peer
    //     const newPeer = new Peer({
    //       initiator: true,
    //       stream: stream,
    //     });
    //     setPeer(newPeer);
    //     const data = localStorage.getItem("id");
    //     newPeer.on("signal", (signal) => {
    //       // Emit the signal over Socket.io
    //       socket.current.emit("video-call-offer", {
    //         to: currentChat._id,
    //         from: data,
    //         signalData: signal,
    //       });
    //     });
    //     // Handle the remote stream from the callee
    //     newPeer.on("stream", (remoteStream) => {
    //       remoteVideoRef.current.srcObject = remoteStream;
    //     });
    //     // Cleanup when the call ends
    //     newPeer.on("close", () => {
    //       setPeer(null);
    //       stream.getTracks().forEach((track) => track.stop());
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Error accessing media devices:", error);
    //   });
  };

  const handleSendMsg = async (msg) => {
    // socket.current = io("http://localhost:8000")
    socket.current = io(process.env.REACT_APP_CHAT_ENDPOINT, {
      transports: ["websocket", "polling"],
    });
    const data = localStorage.getItem("id");

    socket.current.emit(
      "send-msg",
      {
        to: currentChat._id,
        from: data,
        msg,
      },
      (acknowledgement) => {
        if (acknowledgement === "success") {
          const newMessage = { fromSelf: true, message: msg };
          // setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else {
          // Handle error or failure
        }
      }
    );

    const response = await axios.post(
      process.env.REACT_APP_CHAT_ENDPOINT + "/api/messages/addmsg",
      {
        from: data,
        to: currentChat._id,
        message: msg,
      },
      {
        headers: localStorage.getItem("workspace"),
      }
    );

    if (response.status === 200) {
      setMsg("");
      fetchMessages();
      getLastMessages();
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <>
      <Draggable>
        <div className="selected-user-box">
          <div className="header">
            <img
              src={`${
                process.env.REACT_APP_CDS_ENDPOINT
              }IFprofilePicture/image/${
                currentSelected[0]
              }?Authorization=${localStorage.getItem(
                "token"
              )}&workspace=${localStorage.getItem("workspace")}`}
              onError={(e) => {
                e.target.src = `${userPic}`;
              }}
              alt="Profile"
              className="profile-picture"
              crossOrigin="Anonymous"
            />
            <h2>{currentSelected[1]}</h2>
            {/* <FaVideo
              onClick={startVideoCall}
              style={{ marginLeft: "10px", marginRight: "40px" }}
            /> */}
            <button className="close-button" onClick={handleCloseMsgBox}>
              &times;
            </button>
          </div>
          <div className="box-content customScrollBar">
            {messages.map((message) => (
              <div className="customScrollBar" ref={scrollRef} key={uuidv4()}>
                <div
                  className={`message ${
                    message.fromSelf ? "sent" : "recieved"
                  }`}
                >
                  <div className="content ">
                    <p>{message.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="messaging-input-container">
            <form
              className="msg-input-container"
              onSubmit={(event) => sendChat(event)}
            >
              <div className="input-container">
                <input
                  type="text"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Write your message..."
                />
                <button type="submit">
                  <IoMdSend className="send-btn" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </Draggable>
    </>
  );
};

export default ChatContainer;
