import React, { useEffect, useState } from "react";
import iconSet from "../../../../assets/icons.json";
import IcomoonReact from "icomoon-react";

export default function TimerUiMock({ onClick, item, deleteItem }) {
  const [date, setDate] = useState({
    day: "",
    day: "",
    month: "",
    year: "",
    hours: "",
    hour: "",
    minute: "",
    ampm: "",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    const tempDate = new Date(item.date);
    const setDateValues = () => {
      if (item.dateFormat == 24) {
        const temp = {
          day: tempDate.getDate(),
          month: months[tempDate.getMonth()],
          year: tempDate.getFullYear(),
          hour: tempDate.getHours(),
          minute: tempDate.getMinutes(),
          ampm: "",
        };
        setDate(temp);
      } else {
        const temp = {
          day: tempDate.getDate(),
          month: months[tempDate.getMonth()],
          year: tempDate.getFullYear(),
          hour: tempDate.getHours() % 12 ?? 12,
          minute: tempDate.getMinutes(),
          ampm: tempDate.getHours() >= 12 ? "PM" : "AM",
        };
        setDate(temp);
      }
    };
    setDateValues();
  }, [item]);

  return (
    // <div
    // // className="bg-white"

    // // onClick={() => onClick()}
    // // style={{
    // //   background: "#FFFFFF",
    // //   border: "1px solid #E5E5E5",
    // //   "box-sizing": "border-box",
    // //   "border-radius": "5px",
    // //   padding: "5px",
    // // }}
    // >
    <div key={item.id} className="mockElement ">
      <IcomoonReact
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DateTime"
      />
      <span className="mockElementSpan secondaryColor">
        {item.date
          ? `${date.month} ${date.day} ${date.year} ${date.hour}:${date.minute} ${date.ampm}`
          : item.elementType.charAt(0).toUpperCase() +
            item.elementType.slice(1)}
      </span>

      <IcomoonReact
        className="mock-ui-del-icon"
        iconSet={iconSet}
        color="#C4C4C4"
        size={20}
        icon="DeleteIcon"
        onClick={() => deleteItem()}
        id="timer-delete-icon"
      />
    </div>
    // </div>
  );
}
