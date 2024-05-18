import React from 'react'
import './css/footersmall.css'
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function FooterSmall() {
  return (
    <div className='footer-small'>
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
        <ul>
            <li><a>Our Team</a></li>
            <li><a>Download</a></li>
            <li><a>Contact</a></li>
        </ul>
        <p className="copy-right">© 2024 StudySync. All rights reserved.</p>
    </div>
  )
}

export default FooterSmall