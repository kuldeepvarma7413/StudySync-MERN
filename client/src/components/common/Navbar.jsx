import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate, Link } from "react-router-dom";
import { IoClose, IoMenu } from "react-icons/io5";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./css/navbar.css";
import Logo from "../../images/logo.png";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const Navbar = ({authChange}) => {
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [userImage, setUserImage] = useState();
  const user = JSON.parse(localStorage.getItem("user"));
  const profileMenuRef = useRef(null);

  useEffect(() => {
    addSelectedClass();
  }, []);

  useEffect(() => {
    fetchData();
  }, [authenticated]);

  useEffect(() => {
    if (profileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenu]);

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
      authChange()
      // fetch user data and store in local storage
      try {
        const res = await fetch(`/user/`, {
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
    authChange()
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  const handleProfileMenuClick = () => {
    setProfileMenu(!profileMenu);
  };

  const handleClickOutside = (event) => {
    // Check if the clicked element is within the profile menu or its trigger
    if (
      profileMenuRef.current &&
      !event.target.classList.contains("user-image") &&
      !event.target.classList.contains("menu-profile") &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setProfileMenu(false);
    }
  };

  // add selected class when we click on the nav item
  const addSelectedClass = () => {
    const navItem = document.querySelectorAll(".nav__item");
    navItem.forEach((item) => {
      item.addEventListener("click", () => {
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

  const menuItemStyle =
    location.pathname === "/code-editor"
      ? { color: "white" }
      : { color: "#4e3366" };

  return (
    <header className="header">
      <nav className="nav container">
        <NavLink to="/" className="nav__logo">
          <img src={Logo} alt="Logo" />
        </NavLink>

        {user && user.role === "admin" && <p className="admin-label">Admin</p>}

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
                    to={"/#download"}
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
                    loading="lazy"
                    src={
                      userImage
                        ? userImage
                        : "https://res.cloudinary.com/dkjgwvtdq/image/upload/f_auto,q_auto/v1/profilephotos/pjo2blwkflwzxg8mhpoa"
                    }
                    className="user-image"
                    onClick={handleProfileMenuClick}
                    ref={profileMenuRef}
                  />
                  <ul className={`profile-menu ${profileMenu ? "show" : ""}`}>
                    {user && (
                      <>
                        {user.role === "admin" && (
                          <li>
                            <NavLink
                              to="/admin"
                              className={"menu-profile"}
                              onClick={() => {
                                handleProfileMenuClick();
                                closeMenuOnMobile();
                              }}
                            >
                              Admin
                            </NavLink>
                          </li>
                        )}
                        <li>
                          <NavLink
                            to={`/profile/${user._id}`}
                            className={"menu-profile"}
                            onClick={() => {
                              handleProfileMenuClick();
                              closeMenuOnMobile();
                            }}
                          >
                            Profile
                          </NavLink>
                        </li>
                      </>
                    )}
                    <li>
                      <NavLink
                        to="/report"
                        className={"menu-profile"}
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
                        className={"menu-profile"}
                        onClick={() => {
                          Logout();
                          handleProfileMenuClick();
                          closeMenuOnMobile();
                        }}
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