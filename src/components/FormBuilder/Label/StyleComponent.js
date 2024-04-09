import React, { useState, useRef, useEffect } from "react";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import EditButton from "./EditButton";
import { SketchPicker } from "react-color";
import ColorPicker, { useColorPicker } from "react-best-gradient-color-picker";
import leftAlignment from "../../../assets/Icons/leftAlignment.png";
import rightAlignment from "../../../assets/Icons/rightAlignment.png";
import centerAlignment from "../../../assets/Icons/centerAlignment.png";
import topAlignment from "../../../assets/Icons/topAlignment.png";
import bottomAlignment from "../../../assets/Icons/bottomAlignment.png";
import middleAlignment from "../../../assets/Icons/middleAlignment.png";
import Undo from "../../../assets/Icons/Undo.png";
import Redo from "../../../assets/Icons/Redo.png";
import Uunderline from "../../../assets/Icons/Uunderline.png";
import Bold from "../../../assets/Icons/Bold.png";
import Italic from "../../../assets/Icons/Italic.png";
import Ustrike from "../../../assets/Icons/Ustrike.png";
import Reset from "../../../assets/Icons/Reset.png";
import FontPicker from "font-picker-react";
import ReactTooltip from "react-tooltip";
import rgbHex from "rgb-hex";

const StyleComponent = ({ handleChangeValue, element }) => {
  const text = useRef("");

  const [compactPicker, setCompactPicker] = useState("#000000");
  const [backcompactPicker, setBackCompactPicker] = useState("rgba(0,0,0,1)");
  const [selectFamily, setSelectFamily] = useState("Arial");
  // const [selectVarient, setSelectVarient] = useState("select");
  const [selectSize, setSelectSize] = useState("select");
  const [lcrBackground, setLcrBackground] = useState("justifyLeft");
  const [tmbBackground, setTmbBackground] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBackColorPicker, setShowBackColorPicker] = useState(false);
  text.current = element;
  const handleChange = (evt) => {
    text.current = evt.target.value;
    handleChangeValue({ target: { value: text.current } });
  };

  const DataSize = ["select Size", 1, 2, 3, 4, 5, 6, 7];

  const handleSelectFamily = (e) => {
    setSelectFamily(e.family);

    document.execCommand("fontName", false, e.family);
    e.preventDefault();
  };

  const handleSelectSize = (e) => {
    setSelectSize(e.target.value);
    document.execCommand("fontSize", false, e.target.value);
  };

  // const handleSelectOption = (e) => {
  //   setColor(e.target.value);
  //   document.execCommand("foreColor", false, e.target.value);
  // };
  let { valueToHex } = useColorPicker(compactPicker, setCompactPicker);

  const handleColorPicker = (e) => {
    setCompactPicker(e);
  };
  useEffect(() => {
    const hexString = valueToHex();
    const textColor = () => {
      document.execCommand("foreColor", false, hexString);
    };
    textColor();
  }, [compactPicker]);

  const handleBackgroundColorPicker = (backcolor) => {
    setBackCompactPicker(backcolor);
  };

  useEffect(() => {
    const hexString = `#${rgbHex(backcompactPicker)}`;
    const backColor = () => {
      document.execCommand("backColor", false, hexString);
    };
    backColor();
  }, [backcompactPicker]);

  const sanitizeConf = {
    allowedTags: ["b", "i", "em", "strong", "a", "p", "h1", "h2"],
    allowedAttributes: { a: ["href"], p: ["style"] },
    allowedStyles: {
      "*": {
        color: [
          /^#(0x)?[0-9a-f]+$/i,
          /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
        ],
        textAlign: [/^left$/, /^right$/, /^center$/],

        "font-size": [/^\d+(?:px|em|%)$/],
      },
      p: {
        "font-size": [/^\d+rem$/],
      },
    },
  };

  const sanitize = () => {
    text.current = sanitizeHtml(text.current, sanitizeConf);
  };

  const highlightAll = () => {
    setTimeout(() => {
      document.execCommand("selectAll", false, null);
    }, 0);
  };

  const handleLcrAlignment = (id) => {
    setLcrBackground(id);
    document.execCommand(id, false, "");
  };

  // const handleTmbAlignment = (id) => {
  //   setTmbBackground(id);
  // };

  const handleShowBackColorPicker = () => {
    setShowBackColorPicker(!showBackColorPicker);
    setShowColorPicker(false);
  };

  const handleShowColorPicker = () => {
    setShowColorPicker(!showColorPicker);
    setShowBackColorPicker(false);
  };

  const handleReset = () => {
    document.execCommand("removeFormat", false, "");
  };
  const handleRedo = () => {
    document.execCommand("redo", false, "");
  };
  const handleUndo = () => {
    document.execCommand("undo", false, "");
  };
  const handleStrike = () => {
    document.execCommand("strikeThrough", false, "");
  };
  const handleUunderline = () => {
    document.execCommand("underline", false, "");
  };
  const handleItalic = () => {
    document.execCommand("italic", false, "");
  };
  const handleBold = () => {
    document.execCommand("bold", false, "");
  };

  return (
    <>
      <form>
        <div className="form-input">
          <label className="secondaryColor">Editable Content</label>
          <ContentEditable
            className="editable"
            html={element.fieldName}
            onChange={handleChange}
            onBlur={sanitize}
            onFocus={highlightAll}
            id="styleComponent-editable-ContentEditable"
          />
        </div>

        <div className="form-input">
          <label className="secondaryColor">Text</label>
          <div className="select">
            <FontPicker
              apiKey="AIzaSyAaXIFdqZdfK5Rcq2xrB3fRQv6xhyqt_rc"
              activeFontFamily={selectFamily}
              onChange={(nextFont) => handleSelectFamily(nextFont)}
              id="styleComponent-Text-FontPicker"
            />

            <div className="TextStyle">
              <select value={selectSize} id="styleComponent-size-select" onChange={handleSelectSize}>
                {DataSize?.map((option) => {
                  return (
                    <option value={option} key={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
              <div className="VarientContainer" style={{ width: "50%" }}>
                <div
                  className="varientButton"
                  data-tip
                  data-for="12"
                  onClick={() => handleBold()}
                  id="styleComponent-bold"
                >
                  <img src={Bold} alt="Bold" />
                  <ReactTooltip id="12" place="top" effect="solid">
                    Bold
                  </ReactTooltip>
                </div>
                <div
                  className="varientButton"
                  data-tip
                  data-for="13"
                  onClick={() => handleItalic()}
                  id="styleComponent-italic"
                >
                  <img src={Italic} alt="Italic" />
                  <ReactTooltip id="13" place="top" effect="solid">
                    Italic
                  </ReactTooltip>
                </div>
                <div
                  className="varientButton"
                  data-tip
                  data-for="14"
                  onClick={() => handleUunderline()}
                  id="styleComponent-underLine"
                >
                  <img src={Uunderline} alt="Underline" />
                  <ReactTooltip id="14" place="top" effect="solid">
                    Underline
                  </ReactTooltip>
                </div>
                <div
                  className="varientButton"
                  data-tip
                  data-for="15"
                  onClick={() => handleStrike()}
                  id="styleComponent-strike"
                >
                  <img src={Ustrike} alt="Strike" />
                  <ReactTooltip id="15" place="top" effect="solid">
                    Strike Through
                  </ReactTooltip>
                </div>
              </div>
            </div>
            <div className="Alignment">
              <div className="lcrAlignment" style={{ width: "50%" }}>
                <div
                  className={
                    lcrBackground == "justifyLeft"
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="1"
                  onClick={() => handleLcrAlignment("justifyLeft")}
                  id="styleComponent-leftAlignment"
                >
                  <img src={leftAlignment} alt="leftAlignment" />
                  <ReactTooltip id="1" place="top" effect="solid">
                    Left Alignment
                  </ReactTooltip>
                </div>
                <div
                  className={
                    lcrBackground == "justifyCenter"
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="2"
                  onClick={() => handleLcrAlignment("justifyCenter")}
                  id="styleComponent-centerAlignment"
                >
                  <img src={centerAlignment} alt="centerAlignment" />
                  <ReactTooltip id="2" place="top" effect="solid">
                    Center Alignment
                  </ReactTooltip>
                </div>
                <div
                  className={
                    lcrBackground == "justifyRight"
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="3"
                  onClick={() => handleLcrAlignment("justifyRight")}
                  id="styleComponent-rightAlignment"
                >
                  <img src={rightAlignment} alt="rightAlignment" />
                  <ReactTooltip id="3" place="top" effect="solid">
                    Right Alignment
                  </ReactTooltip>
                </div>
              </div>
              {/* <div className="tmbAlignment" style={{ width: "50%" }}>
                <div
                  className={
                    tmbBackground == 1
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="4"
                >
                  <img
                    src={topAlignment}
                    alt="topAlignment"
                    onClick={() => handleTmbAlignment(1)}
                  />
                  <ReactTooltip id="4" place="top" effect="solid">
                    Top Alignment
                  </ReactTooltip>
                </div>
                <div
                  className={
                    tmbBackground == 2
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="5"
                >
                  <img
                    src={middleAlignment}
                    alt="middleAlignment"
                    onClick={() => handleTmbAlignment(2)}
                  />
                  <ReactTooltip id="5" place="top" effect="solid">
                    Middle Alignment
                  </ReactTooltip>
                </div>
                <div
                  className={
                    tmbBackground == 3
                      ? "AlignmentBackground AlignmentBackgroundActive"
                      : "AlignmentBackground"
                  }
                  data-tip
                  data-for="6"
                >
                  <img
                    src={bottomAlignment}
                    alt="bottomAlignment"
                    onClick={() => handleTmbAlignment(3)}
                  />
                  <ReactTooltip id="6" place="top" effect="solid">
                    Bottom Alignment
                  </ReactTooltip>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="form-input">
          <label className="secondaryColor">Fill</label>
          <div className="colorBoxStyleContainer">
            <div className="colorBoxStyle">
              <div
                className="colorBox"
                style={{ background: compactPicker, width: "60px" }}
                onClick={handleShowColorPicker}
                data-tip
                data-for="10"
                id="styleComponent-textColor"
              >
                <ReactTooltip id="10" place="top" effect="solid">
                  Text Color
                </ReactTooltip>
              </div>
              <p>{compactPicker}</p>
            </div>
          </div>
          <div
            className={
              showColorPicker == true ? "displayColorShow " : "displayColorHide "
            }
          >
            {/* <p>Text Color</p> */}
            {/* <SketchPicker
              onChange={(color) => {
                handleColorPicker(color.hex);
              }}
              color={compactPicker}
            /> */}
            <ColorPicker
              hideAdvancedSliders="false"
              hideColorGuide="false"
              hideInputType="false"
              value={compactPicker}
              onChange={handleColorPicker}
              height="125"
              width="250"
              id="styleComponent-handleColorPicker-colorPicker"
            />
          </div>
        </div>

        <div className="form-input">
          <label className="secondaryColor">Background</label>
          <div className="colorBoxStyleContainer">
            <div className="colorBoxStyle">
              <div
                className="colorBox"
                style={{ background: backcompactPicker, width: "60px" }}
                onClick={handleShowBackColorPicker}
                data-tip
                data-for="11"
                id="styleComponent-textBackgroundColor"
              >
                <ReactTooltip id="11" place="top" effect="solid">
                  Text Background Color
                </ReactTooltip>
              </div>
              <p className="secondaryColor">
                {`#${rgbHex(backcompactPicker)}`
                  ?.substring(0, `#${rgbHex(backcompactPicker)}`?.length - 2)
                  .toUpperCase()}
              </p>
            </div>
          </div>

          <div
            className={
              showBackColorPicker == true ? "displayColorShow " : "displayColorHide "
            }
          >
            {/* <p>Text Background Color</p> */}
            {/* <SketchPicker
              onChange={(color) => {
                handleBackgroundColorPicker(color.hex);
              }}
              color={compactPicker}
            /> */}
            <ColorPicker
              hideAdvancedSliders="false"
              hideColorGuide="false"
              hideInputType="false"
              value={backcompactPicker}
              onChange={handleBackgroundColorPicker}
              height="125"
              width="250"
              id="styleComponent-handleBackgroundColorPicker-colorPicker"
            />
          </div>
        </div>

        <div className="form-input">
          {/* <div>{newValue}</div> */}
          <label className="secondaryColor">actions</label>

          <div className="actionButtonContainer" style={{ width: "50%" }}>
            <div
              className="actionButton"
              data-tip
              data-for="7"
              onClick={() => handleUndo()}
              id="styleComponent-undo"
            >
              <img src={Undo} alt="Undo" />
              <ReactTooltip id="7" place="top" effect="solid">
                Undo
              </ReactTooltip>
            </div>
            <div
              className="actionButton"
              data-tip
              data-for="8"
              onClick={() => handleRedo()}
              id="styleComponent-redo"
            >
              <img src={Redo} alt="Redo" />
              <ReactTooltip id="8" place="top" effect="solid">
                Redo
              </ReactTooltip>
            </div>
            <div
              className="actionButton"
              data-tip
              data-for="9"
              onClick={() => handleReset()}
              id="styleComponent-reset"
            >
              <img src={Reset} alt="Reset" />
              <ReactTooltip id="9" place="top" effect="solid">
                Reset
              </ReactTooltip>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default StyleComponent;
