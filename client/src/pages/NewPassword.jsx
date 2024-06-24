import React, { useState } from "react";
import validatePassword from "../utils/validatePassword";
import "./css/newpassword.css";
import { useParams } from "react-router-dom";

function NewPassword() {
  document.title = "New Password | StudySync";
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const params = useParams();

  const userId = params.id;
  const token = params.token;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const validateP = validatePassword(newPassword);
    if (validateP.status === false) {
      setError(validateP.message);
      return;
    }
    // Send backend request
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/auth/set-password/${userId}/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      }
    );

    const data = await res.json();
    if (data.status === "OK") {
      setError("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
      window.location.href = "/login";
    } else {
      setError(data.message);
    }
  };

  return (
    <div className="new-password-container">
      <form onSubmit={handleSubmit} className="new-password-form">
        <label>
          New Password:
          <input
            type={showPasswords ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <label>
          Confirm Password:
          <input
            type={showPasswords ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        <div className="actions">
          <button
            type="button"
            className="toggle-password-visibility"
            onClick={() => setShowPasswords(!showPasswords)}
          >
            {showPasswords ? "Hide" : "Show"} Passwords
          </button>
          <button type="submit">Submit</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
}

export default NewPassword;
