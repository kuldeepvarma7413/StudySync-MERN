import React from 'react'
import Logo from '../../images/logo.png'

function header() {
  return (
    <div className='header'>
        <div className='header-logo'>
            <Logo />
        </div>
        <div className='header-nav'>
            <div className='links'>
                <ul>
                    <li><a href="">OUR TEAM</a></li>
                    <li><a href="">DOWNLOAD</a></li>
                    <li><a href="">CONTACT</a></li>
                    <li><a href="">PRACTICE</a></li>
                    <li><a href="">DISCUSS</a></li>
                    <li><a href="">RESOURCES</a></li>
                </ul>
            </div>
            <div className='header-buttons'>
                <button className='btn login-btn'>
                    Login
                </button>
                <button className='btn signup-btn'>
                    Signup
                </button>
            </div>
        </div>
    </div>
  )
}

export default header