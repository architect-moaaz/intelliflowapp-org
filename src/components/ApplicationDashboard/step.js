import React from "react";
import "./ApplicationDashboard.css";
export default function Step(props) {
    return (
        <div className={"stepBlock stepContainer  " + (props.selected ? " selected " : "")}>
             <div >
             <span id="step-container-sapn" className={props.fontcolortype}>{props.label}</span>
             </div>
            <div className="circleWrapper" id="step-update-sapn" onClick={() => props.updateStep(props.index + 1)}>
                <div className="circle">{}</div>
            </div>
           
        </div>
    )
}