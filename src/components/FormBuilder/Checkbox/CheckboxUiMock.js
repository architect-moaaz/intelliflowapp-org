import React from "react";
import iconSet from "../../../assets/icons.json";
import IcomoonReact from "icomoon-react";
import parse from "html-react-parser";

const CheckboxUiMock = ({ onClick, item, deleteItem }) => {
  const renderChoices = () => {
    return (
      <div 
        style={{
          display:"grid",
          gridTemplateColumns: `repeat(${item?.showDataCols}, auto)`
        }}
      >
        {item.choices.map((item) => {
          return (
            <div key={item.key}>
              <input type="checkbox" id="checkBoxUiMocak-checkbox-input" />
              <label className="secondaryColor">{item.choice}</label>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div>
      <div className="mockElement ">
        <IcomoonReact
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="Checkbox"
        />
        <span className="mockElementSpan secondaryColor">
          {item.fieldName ? parse(item.fieldName) : "Question you wanna ask!!"}
        </span>
        <IcomoonReact
          className="mock-ui-del-icon"
          id="checkBoxUiMocak-delete-IcomoonReact"
          iconSet={iconSet}
          color="#C4C4C4"
          size={20}
          icon="DeleteIcon"
          onClick={(e) => deleteItem(e, item.id)}
        />
      </div>
      {renderChoices()}
    </div>
  );
};

export default CheckboxUiMock;
