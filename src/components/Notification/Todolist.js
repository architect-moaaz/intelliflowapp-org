import { Link } from "react-router-dom";
import { File, FilterLine, IInfo, Tick } from "../../assets";
import "./Todolist.css";
import { rightArrowTodo } from "../../assets";
import { circleCross } from "../../assets";
import { useState, useEffect } from "react";
import { ReactComponent as CalenderDate } from "../../assets/NewIcon/calenderDate.svg";
import  formatDateTimeInTimezone  from "../DateAndTime/TimezoneFormatter"

import axios from "axios";
import { useTranslation } from "react-i18next";
const Todolist = () => {
  const [t, i18n] = useTranslation("common");
  const [todo, settodo] = useState([]);
  const [notibar, setNotibar] = useState(false);
  const [all, setall] = useState(false);
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    fetchtodo();
  }, []);

  const fetchtodo = async () => {
    let notifications = [];
    try {
      var todoAPi = await axios.get(
        `${
          process.env.REACT_APP_IFAPP_API_ENDPOINT
        }app-center/app/user/worklist/?user=${localStorage.getItem("username")}`
      );
      // console.log("count", todoAPi.data.data.count);
      // console.log("count", todoAPi.data.data);

      if (todoAPi.data.data.count > 0) {
        todoAPi.data.data.tasks.forEach((element) => {
          notifications.push(element);
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
    try {
      settodo(notifications);
      notifications = [];

      var notificationAPi = await axios.get(
        process.env.REACT_APP_IFAPP_API_ENDPOINT +
          "app-center/app/user/notifications?user=" +
          localStorage.getItem("username")
      );
      // console.log("count", notificationAPi.data.data.count);
      if (notificationAPi.data.data.count > 0) {
        notificationAPi.data.data.notifications.forEach((element) => {
          if (element.notifications) notifications.push(element);
        });
      }
      setNotification(notifications);
    } catch (error) {
      console.log("Error", error);
    }

    if (localStorage.getItem("Dashboard") == t("appStore")) {
      setall(!all);
      setNotibar(!all);
    }
  };

  const onLinkClick = (notification) => {
    localStorage.setItem(
      "appdisplayname",
      notification.appDisplayName
        ? notification.appDisplayName
        : notification.app
    );
  };

  return (
    <>
      <div className="todo-box BodyColor">
        <div className="notification-header-wrap BodyColor">
          <h4 className="primaryColor">{t("To-Do List")}</h4>
        </div>
        <ul className="todo-list customScrollBar">
          {todo
            .slice(0)
            .reverse()
            .map((notification, index) =>
              notification.userTasks.slice(-1).map((e) => {
                const date = new Date(e.startDate);
                return (
                  <li className="todo" key={index}>
                    <i class="todo-line-todolist"></i>
                    <p className="secondaryColor">
                      {notification.appDisplayName
                        ? notification.appDisplayName
                        : notification.app}{" "}
                      - Action required for {e.referenceName}
                      &nbsp;&nbsp;&nbsp;
                      <Link
                        onClick={(e) => onLinkClick(notification)}
                        to={{
                          pathname: `/form`,
                          state: {
                            endpoint_label: e?.processId,
                            path: e?.processId,
                            id: notification?.processId,
                            appName: notification?.app,
                          },
                        }}
                        className="open-todo"
                        id="todoList-link"
                      >
                        <img src={rightArrowTodo} />
                      </Link>
                    </p>

                    {/* <Link to="#" className="close-todo-list">
                <img src={circleCross} />
              </Link> */}
                    <p className="todoDateTimeContainer secondaryColor">
                      <CalenderDate className="todo-calender-date" />
                      <span className="todoDateTime secondaryColor">
                        {formatDateTimeInTimezone(date)}
                      </span>
                    </p>
                  </li>
                );
              })
            )}
        </ul>

        {/* <ul className="todo-list">
          <h5>Yesterday</h5>
          <li className="tod" >
            <i class="todo-line"></i>
            <p>
              Welcome to <i>IntelliFlow,</i> You’ve joined your Workspace
              <Link to="#" className="open-todo"><img src={rightArrow} /></Link>
            </p>
            <Link to="#" className="close-todo">
              <img
                src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
              />
            </Link>
          </li>
          <li className="tod">
            <i class="todo-line"></i>
            <p>
            Hey! Payslip for the month  APRIL has beed uploaded,Check Now
              <Link to="#" className="open-todo"><img src={rightArrow} /></Link>
            </p>
            <Link to="#" className="close-todo">
              <img
                src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
              />
            </Link>
          </li>
          <li className="tod" >
            <i class="todo-line"></i>

            <p>
            Your Team “Karthik” have applied for a Sick Leave, Approve Now
              <Link to="#" className="open-todo"><img src={rightArrow} /></Link>
            </p>
            <Link to="#" className="close-todo">

              <img
                src="https://d29fhpw069ctt2.cloudfront.net/icon/image/39219/preview.png"
              />
            </Link>
          </li>

        </ul> */}
      </div>

      {/* <div onClick={"#"} className="Open-To-do-list">
        <p>Open To-do list</p>
      </div> */}
      <hr className="horizontalLine" />
    </>
  );
};
export default Todolist;
