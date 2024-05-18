import React, { useState, forwardRef, useImperativeHandle } from "react";
import "./css/snackbar.css";
import { IoClose } from "react-icons/io5";


const Snackbar = forwardRef((props, ref) => {
  const [showSnackbar, setShowSnackbar] = useState(false);

  useImperativeHandle(ref, () => ({
    show() {
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
      }, 3000);
    },
  }));
  return (
    <div
      className="snackbar"
      id={showSnackbar ? "show" : "hide"}
      style={{
        backgroundColor: props.type === "success" ? "#02ff38d7" : "#ff0202d7",
        color: props.type === "success" ? "black" : "white",
      }}
    >
      <div className="message">{props.message}</div>
      <div className="symbol">
        {props.type === "success" ? <h1>&#x2713;</h1> : <IoClose size={26} />}
      </div>
    </div>
  );
});

export default Snackbar;