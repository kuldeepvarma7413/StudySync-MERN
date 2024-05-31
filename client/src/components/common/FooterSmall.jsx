import React from 'react'
import './css/footersmall.css'
import { FaTelegramPlane } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

function FooterSmall() {
  return (
    <div className='footer-small'>
        <div className="social-media">
          <a href="https://t.me/teamstudysync" target='_blank'>
            <FaTelegramPlane />
          </a>
          <a href="https://www.instagram.com/teamstudysync/" target='_blank'>
            <FaInstagram />
          </a>
          <a href="https://x.com/kuldeepvarma74" target='_blank'>
            <FaTwitter />
          </a>
          <a href="https://github.com/kuldeepvarma7413" target='_blank'>
            <FaGithub />
          </a>
        </div>
        <ul>
            <li><NavLink to={'/our-team'}>Our Team</NavLink></li>
            <li><NavLink to={'/#download'}>Download</NavLink></li>
            <li><NavLink to={'/#footer'}>Contact</NavLink></li>
        </ul>
        <p className="copy-right">© 2024 StudySync. All rights reserved.</p>
    </div>
  )
}

export default FooterSmall