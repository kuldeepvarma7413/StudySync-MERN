import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./css/navbar.css";
import Logo from "../../images/logo.png";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [userImage, setUserImage] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  
  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  useEffect(() => {
    addSelectedClass();
  }, []);

  useEffect(() => {
    fetchData();
  }, [authenticated]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const closeMenuOnMobile = () => {
    if (window.innerWidth <= 1150) {
      setShowMenu(false);
    }
  };

  async function fetchData() {
    const token = Cookies.get("token");
    if (token) {
      setAuthenticated(true);
      // decode token and get user data
      const decoded = jwtDecode(token);
      // fetch user data and store in local storage
      try {
        const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/?email=${decoded.email}&accountType=${decoded.accountType}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.status === "OK") {
          localStorage.setItem("user", JSON.stringify(data.user));
          setUserImage(data.user.photo);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const Logout = () => {
    handleProfileMenuClick();
    // redirect to home using navigate
    navigate("/");
    window.location.reload();
    setAuthenticated(false);
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  const handleProfileMenuClick = () => {
    setProfileMenu(!profileMenu);
  };

  // add selected class when we click on the nav item
  const addSelectedClass = () => {
    const navItem = document.querySelectorAll(".nav__item");
    navItem.forEach((item) => {
      item.addEventListener("click", () => {
        console.log("clicked");
        navItem.forEach((item) => item.classList.remove("selected"));
        item.classList.add("selected");
      });
    });

    // add selected class based on window.location
    const currentPath = window.location.pathname;
    const currentNavItem = document.querySelector(
      `.nav__item a[href="${currentPath}"]`
    );
    if (currentNavItem) {
      currentNavItem.parentElement.classList.add("selected");
    }
  };

  // container style
  const location = useLocation();

  const containerStyle =
    location.pathname === "/"
      ? {
          background:
            "linear-gradient(rgba(78, 51, 102, 0.8), rgba(78, 51, 102, 0.5), rgba(78, 51, 102, 0.02))",
        }
      : { background: "none" };

  const menuItemStyle =
    location.pathname === "/code-editor"
      ? { color: "white" }
      : { color: "#4e3366" };

  return (
    <header className="header">
      <nav className="nav container" style={containerStyle}>
        <NavLink to="/" className="nav__logo">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <div
          className={`nav__menu ${showMenu ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <NavLink
                to="/code-editor"
                className="nav__link"
                onClick={closeMenuOnMobile}
                style={menuItemStyle}
              >
                Practice
              </NavLink>
            </li>
            <li className="nav__item">
              <NavLink
                to="/discuss"
                className="nav__link"
                onClick={closeMenuOnMobile}
                style={menuItemStyle}
              >
                Discuss
              </NavLink>
            </li>
            {authenticated ? (
              <>
                <li className="nav__item">
                  <NavLink
                    to="/upload"
                    className="nav__link"
                    onClick={closeMenuOnMobile}
                    style={menuItemStyle}
                  >
                    Upload
                  </NavLink>
                </li>
                <li className="nav__item">
                  <NavLink
                    to="/resources"
                    className="nav__link"
                    onClick={closeMenuOnMobile}
                    style={menuItemStyle}
                  >
                    Resources
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav__item">
                  <Link
                    to={'/#download'}
                    className="nav__link"
                    onClick={closeMenuOnMobile}
                    style={menuItemStyle}
                  >
                    Download
                  </Link>
                </li>
                <li className="nav__item">
                  <NavLink
                    to="/our-team"
                    className="nav__link"
                    onClick={closeMenuOnMobile}
                    style={menuItemStyle}
                  >
                    Our Team
                  </NavLink>
                </li>
              </>
            )}
            <li className="userProfile">
              {authenticated ? (
                <>
                  <img
                    src={userImage}
                    className="user-image"
                    onClick={handleProfileMenuClick}
                  />
                  <ul className={`profile-menu ${profileMenu ? "show" : ""}`}>
                    <li>
                      <NavLink
                        to={`/profile/${user._id}`}
                        onClick={() => {
                          handleProfileMenuClick();
                          closeMenuOnMobile();
                        }}
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/report"
                        onClick={() => {
                          handleProfileMenuClick();
                          closeMenuOnMobile();
                        }}
                      >
                        Report
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={() => {
                          Logout();
                          handleProfileMenuClick();
                          closeMenuOnMobile();
                        }}
                        className="nav_link"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="nav__link nav__cta btn"
                    style={menuItemStyle}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/signup"
                    className="nav__link nav__cta signup btn"
                  >
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
