import React from "react";
import { useState, useRef } from "react";
import "./footer.css";
import { HiOutlineMail } from "react-icons/hi";
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import Logo from "../../images/logo.png";
import SnackbarCustom from "./SnackbarCustom";

function Footer() {
  const [email, setEmail] = useState("");

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // validate email
    var regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      setMessage("Invalid email");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    fetch(`https://studysync-uunh.onrender.com/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmail("");
        // show snackbar
        setMessage(data.message);
        setSnackBarType("success");
        snackbarRef.current.show();
      })
      .catch((err) => {
        console.log(err);
        // show snackbar
        setMessage("Failed to subscribe");
        setSnackBarType("error");
        snackbarRef.current.show();
      });
  };

  return (
    <div className="footer">
      <div className="top">
        <div className="contact">
          <p className="title">Contact</p>
          <p className="address">
            377c/18, 2nd Floor
            <br />
            Street 5, Gurunanakpura west
            <br />
            Jalandhar, Punjab, India
            <br />
            144009
          </p>
          <p className="email">teamstudysync@gmail.com</p>
          <p>Phone: (+91) 74139 12366</p>
        </div>
        <div className="site-links">
          <p className="title">Site Links</p>
          <div className="links">
            <a href="">Resources</a>
            <a href="">Discuss</a>
            <a href="">Practice</a>
            <a href="">Download</a>
            <a href="">Our Team</a>
          </div>
        </div>
        <div className="our-newsletter">
          <p className="title">Our Newsletter</p>
          <p className="description">
            Exciting news from StudySync! We're thrilled to provide college
            students with comprehensive digital notes. Say goodbye to paper
            clutter and hello to convenient, accessible, and organized study
            resources. With StudySync, you'll have all your course notes at your
            fingertips.
          </p>
          <form onSubmit={handleSubmit}>
            <p className="email-icon">
              <HiOutlineMail size={22} />
            </p>
            <input
              type="email"
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required={true}
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
      <div className="bottom">
        <img src={Logo} alt="" />
        <div className="social-media">
          <a href="">
            <FaTelegramPlane />
          </a>
          <a href="">
            <FaInstagram />
          </a>
          <a href="">
            <FaTwitter />
          </a>
          <a href="">
            <FaGithub />
          </a>
        </div>
        <p className="copy-right">© 2024 StudySync. All rights reserved.</p>
      </div>
      <SnackbarCustom ref={snackbarRef} message={message} type={SnackbarType} />
    </div>
  );
}

export default Footer;
