import React, { useState } from "react";
import "./css/Login.css";
import Logo from "../images/logo.png";
import Character from "../images/Character-sitting-chair.png";
import Cactus from "../images/cactus.png";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import validatePassword from "../utils/validatePassword";
import validateEmail from "../utils/validateEmail";
import validateUsername from "../utils/validateUsername";

function Signup() {
  document.title = "Sign Up | StudySync";
  // input values for email and password
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // msgs
  const [errmsg, setErrmsg] = useState("");
  const [successmsg, setSuccessmsg] = useState("");

  async function registerUser(e) {
    e.preventDefault();
    setErrmsg("");
    setSuccessmsg("");
    if (!name || !email || !password || !username) {
      setErrmsg("Please fill all the fields");
      return;
    }
    const validateE = validateEmail(email);
    if (validateE.status === false) {
      setErrmsg(validateE.message);
      return;
    }
    const validate = validatePassword(password);
    if (validate.status === false) {
      setErrmsg(validate.message);
      return;
    }

    const validateU = validateUsername(username);
    if (validateU.status === false) {
      setErrmsg(validateU.message);
      return;
    }

    try {
      const response = await fetch(
        `/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            username,
            email,
            password,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "ERROR") {
        setErrmsg(data.error);
      } else {
        setSuccessmsg(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function navigateURL(url) {
    window.location.href = url;
  }

  async function auth() {
    const response = await fetch(
      `/request`,
      {
        method: "POST",
      }
    );
    const data = await response.json();
    navigateURL(data.url);
  }

  return (
    <div className="login-container">
      <div className="login-container-main">
        <div className="left-side">
          <div className="form-container">
            <img src={Logo} alt="" className="logo-login" />

            <form onSubmit={registerUser}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your name"
              />
              
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your username"
              />

              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />

              <label htmlFor="password" className="password-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
              {errmsg && <p className="error-msg">{errmsg}</p>}
              {successmsg && <p className="success-msg">{successmsg}</p>}
              <button className="btn login-btn">
                Sign up
                {/* icon */}
              </button>
            </form>

            <p>or continue with</p>

            <button className="btn google-btn" onClick={auth}>
              <FcGoogle size={22} />
            </button>

            <p className="login-line">
              Alreadt have an account? <a href="/login">login for free</a>
            </p>
          </div>
        </div>
        <div className="right-side">
          <img src={Cactus} alt="" className="cactus" />
          <img src={Character} alt="" className="character" />
        </div>
      </div>
    </div>
  );
}

export default Signup;
