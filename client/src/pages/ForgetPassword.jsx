import React, { useState, useRef } from "react";
import "./css/forgetpassword.css";
import Snackbar from "../components/common/SnackbarCustom";

function ForgetPassword() {
  document.title = "Forget Password | StudySync";
  const [email, setEmail] = useState("");

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  // loading
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    } else {
      setLoading(true);
      try{
          const res = await fetch(
            `/auth/forget-password/${email}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
          const data = await res.json();
          if (data.status === "OK") {
            setMessage("Reset password link sent to your email address");
            setSnackBarType("success");
            snackbarRef.current.show();
          } else {
            setMessage(data.message);
            setSnackBarType("error");
            snackbarRef.current.show();
          }
      }finally{
          setLoading(false);
      }
    }
    // Send email with reset password link
    // Implement your logic here
  };

  return (
    <div className="forget-password-container">
      <h2 className="forget-password-title">Forget Password</h2>
      <form onSubmit={handleSubmit} className="forget-password-form">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />
        <button type="submit">
          {loading == true ? "loading..." : "Reset Password"}
        </button>
      </form>
      <Snackbar ref={snackbarRef} message={message} type={SnackbarType} />
    </div>
  );
}

export default ForgetPassword;
