import React, { useState } from "react";
import "./css/Login.css";
import Logo from "../images/logo.png";
import Character from "../images/Character-sitting-chair.png";
import Cactus from "../images/cactus.png";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

function Login() {
  document.title = "Login | StudySync";
  // input values for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // msgs
  const [errmsg, setErrmsg] = useState("");
  const [successmsg, setSuccessmsg] = useState("");

    async function loginUser(e) {
        e.preventDefault()
        setErrmsg('')
        setSuccessmsg('')
        // validate
        if(!email || !password){
          setErrmsg('Please fill all the fields')
          setLoading(false)
          return
        }
        setLoading(true)
        try {
            const response = await fetch(`/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            })
            const data = await response.json()
            if(data.status === 'ERROR'){
                setErrmsg(data.message)
            }else{
                setSuccessmsg(data.message)
                // add in cookies
                Cookies.set('token', data.token)
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

  function navigateURL(url) {
    window.location.href = url;
  }

  async function auth() {
    setErrmsg("");
    setSuccessmsg("");
    const response = await fetch(`/request`, {
      method: "POST",
    });
    const data = await response.json();
    navigateURL(data.url);
  }

  return (
    <div className="login-container">
      <div className="login-container-main">
        <div className="left-side">
          <div className="form-container">
            <img src={Logo} alt="" className="logo-login" />

            <form onSubmit={loginUser}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
              />

              <label htmlFor="password" className="password-label">
                Password<Link to={"/forgot-password"}>Forgot Password?</Link>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
              {errmsg && <p className="errmsg">{errmsg}</p>}
              {successmsg && <p className="successmsg">{successmsg}</p>}
              <button className="btn login-btn">
                {loading ? "Loading..." : "Login"}
                {/* icon */}
              </button>
            </form>

            <p>or continue with</p>

            <button className="btn google-btn" onClick={auth}>
              <FcGoogle size={22} />
            </button>

            <p className="login-line">
              Don't have an account yet? <a href="/signup">Sign up for free</a>
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

export default Login;
