import React, { useEffect, useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./navbar.css";
import Logo from "../../images/logo.png";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  // snackbar
  const [SnackbarType, setSnackBarType] = useState('false');
  const [message, setMessage]=useState('');
  const snackbarRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthenticated(true);
    }
  }, []);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  const Logout = () => {
    console.log("Logout");
    localStorage.removeItem("token");
    setAuthenticated(false);
    // show snackbar
    setMessage("Log out successful")
    setSnackBarType('success');
    snackbarRef.current.show();
  };
  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to='/' className="nav__logo">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink
                to="/resources"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Resources
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/practice"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Practice
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/discuss"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Discuss
              </NavLink>
            </li>
            <li className="nav__item">
              <AnchorLink href="#download"
              className="nav__link"
              onClick={closeMenuOnMobile}>
                Download
              </AnchorLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/our-team"
                className="nav__link"
                onClick={closeMenuOnMobile}
              >
                Our Team
              </NavLink>
            </li>
            <li className="nav__item">
              {authenticated ? (
                <NavLink onClick={Logout} className="nav__link nav__cta">
                  Logout
                </NavLink>
              ) : (
                <>
                  <NavLink to="/login" className="nav__link nav__cta">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="nav__link nav__cta">
                    Sign Up
                  </NavLink>
                </>
              )}
            </li>
          </ul>
          <div className="nav__close" id="nav-close" onClick={toggleMenu}>
            <IoClose />
          </div>
        </div>

        <div className="nav__toggle" id="nav-toggle" onClick={toggleMenu}>
          <IoMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
