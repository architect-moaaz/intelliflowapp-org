import React, { useEffect, useRef } from "react";

const luckysheet = window.luckysheet;

export default function Intellisheetv2({ intellisheetData }) {
  const luckyCss = {
    margin: "0px",
    padding: "0px",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: "0px",
    top: "180px",
  };

  const sheetRef = useRef(null);

  useEffect(() => {
    loadData();
  }, [intellisheetData]);

  function loadData() {
    if (luckysheet) luckysheet?.destroy();

    luckysheet?.create({
      container: "luckysheet",
      showinfobar: true,
      data: intellisheetData?.sheets,
      title: intellisheetData?.info?.name,
      userInfo: intellisheetData?.info?.name?.creator,
    });
  }

  return (
    <div style={{ "margin-top": "100px" }}>
      {intellisheetData ? (
        <div id="luckysheet" ref={sheetRef} style={luckyCss} />
      ) : null}
    </div>
  );
}
