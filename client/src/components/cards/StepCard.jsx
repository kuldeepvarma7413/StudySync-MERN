import React from "react";
import "./css/stepCard.css";

function StepCard(props) {
  return (
    <div className="step-card">
      <p className="index">{props.idx+1}</p>
      <h3 className="title">{props.title}</h3>
      <p className="description">{props.description}</p>
    </div>
  );
}

export default StepCard;
