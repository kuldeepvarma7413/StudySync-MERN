import React, { useEffect, useState, useRef } from "react";
import {
  Link,
  useParams,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./css/profile.css";
import { BiSolidUpvote } from "react-icons/bi";
import getDate from "../utils/getDate";
import validatePassword from "../utils/validatePassword";
import Cookies from "js-cookie";
import SnackbarCustom from "../components/common/SnackbarCustom";
import EditProfile from "../components/profile/EditProfile";

function Profile() {
  document.title = "Profile | StudySync";
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState({});
  const [isUser, setIsUser] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const getUser = async () => {
      try {
        let res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/${params.id}`,
          {
            headers: {
              Authorization: "Bearer " + Cookies.get("token"),
            },
          }
        );
        res = await res.json();
        if (res.status === "OK") {
          setUser(res.data);
          setIsUser(res.isUser);
        } else {
          console.log(res.message);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError.status === false) {
      setMessage(validationError.message);
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    if (oldPassword === newPassword) {
      setMessage("New password cannot be same as old password.");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/user/change-password/${params.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + Cookies.get("token"),
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );
      const data = await res.json();
      if (data.success === "OK") {
        setMessage("Password updated successfully");
        setSnackBarType("success");
        snackbarRef.current.show();
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage(data.message);
        setSnackBarType("error");
        snackbarRef.current.show();
      }
    } catch (err) {
      setMessage("Error updating password.");
      setSnackBarType("error");
      snackbarRef.current.show();
    }
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();

  useEffect(() => {
    const section = query.get("section");
    if (section) {
      setSelectedSection(section);
    } else {
      setSelectedSection("profile");
      updateQueryParameter("section", "profile");
    }
  }, []);

  const updateQueryParameter = (key, value) => {
    query.set(key, value);
    navigate(`?${query.toString()}`, { replace: true });
  };

  useEffect(() => {
    if (selectedSection) {
      updateQueryParameter("section", selectedSection);
    }
  }, [selectedSection]);

  // close edit profile
  const handleClose = () => {
    setEditingProfile(false);
  };

  // profile updated, open snackbar
  const handleProfileEdited = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setSnackBarType("success");
    setMessage("Profile Updated Successfully");
    snackbarRef.current.show();
    setEditingProfile(false);
  };

  // error while updating profile
  const handleEditError = (message) => {
    setSnackBarType("error");
    setMessage(message);
    snackbarRef.current.show();
  };

  return (
    <>
      {user ? (
        <div className="profile-container">
          <section className="left-section">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <img loading="lazy"
                  src={
                    user.profilePic
                      ? user.profilePic
                      : "https://res.cloudinary.com/dkjgwvtdq/image/upload/f_auto,q_auto/v1/profilephotos/pjo2blwkflwzxg8mhpoa"
                  }
                  alt="profile-pic"
                />
                <div className="profile-analysis">
                  <h2>{user.name}</h2>
                  <p className="username">@{user.username}</p>
                  <p className="upvote">
                    {user.totalUpvotes}
                    <BiSolidUpvote className="upvoteIcon" />
                  </p>
                </div>
                {isUser && (
                  <>
                    <button
                      className="btn edit-profile"
                      onClick={() => setEditingProfile(!editingProfile)}
                    >
                      Edit
                    </button>
                    {editingProfile ? (
                      <EditProfile
                        user={user}
                        close={handleClose}
                        onSuccess={handleProfileEdited}
                        onError={handleEditError}
                      />
                    ) : null}
                  </>
                )}
              </>
            )}
          </section>
          <section className="right-section">
            <div className="nav-items">
              <Link
                className={`nav-item ${
                  selectedSection === "profile" ? "selected" : ""
                }`}
                onClick={() => setSelectedSection("profile")}
              >
                Profile
              </Link>
              {isUser && (
                <>
                  <Link
                    className={`nav-item ${
                      selectedSection === "changePassword" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSection("changePassword")}
                  >
                    Change Password
                  </Link>
                  <Link
                    className={`nav-item ${
                      selectedSection === "questions" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSection("questions")}
                  >
                    Questions
                  </Link>
                  <Link
                    className={`nav-item ${
                      selectedSection === "answers" ? "selected" : ""
                    }`}
                    onClick={() => setSelectedSection("answers")}
                  >
                    Answers
                  </Link>
                </>
              )}
            </div>
            <div className="content">
              {isLoading ? (
                <div className="loader-container">
                  <p className="loading"></p>
                </div>
              ) : (
                <>
                  {selectedSection === "profile" && (
                    <div className="profile">
                      <p>
                        <span>Name:</span> {user.name}
                      </p>
                      <p>
                        <span>Username:</span> {user.username}
                      </p>
                      <p>
                        <span>Email:</span> {user.email}
                      </p>
                      <p>
                        <span>Status:</span> {user.status}
                      </p>
                      <p>
                        <span>Total Questions:</span> {user.totalQuestions}
                      </p>
                      <p>
                        <span>Total Answers:</span> {user.totalAnswers}
                      </p>
                      <p>
                        <span>User Since:</span> {getDate(user.createdAt)}
                      </p>
                      <p>
                        <span>Last Updated:</span> {getDate(user.lastUpdated)}
                      </p>
                    </div>
                  )}
                  {isUser && (
                    <>
                      {selectedSection === "changePassword" && (
                        <div className="change-password">
                          <form onSubmit={handleSubmit}>
                            <div>
                              <label htmlFor="old-password">Old Password</label>
                              <input
                                type="password"
                                id="old-password"
                                placeholder="********"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <label htmlFor="new-password">New Password</label>
                              <input
                                type="password"
                                id="new-password"
                                placeholder="********"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </div>
                            <div>
                              <label htmlFor="confirm-password">
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                id="confirm-password"
                                placeholder="********"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                            </div>
                            <button type="submit" className="btn">
                              Update
                            </button>
                          </form>
                        </div>
                      )}
                      {selectedSection === "questions" && (
                        <div className="questions">
                          {user.questions && user.questions.length > 0 ? (
                            user.questions.map((question, index) => (
                              <div className="question" key={question._id}>
                                <NavLink
                                  to={`/discuss/view-question/${question._id}`}
                                  className="question-title"
                                >
                                  {index + 1}. {question.title}
                                </NavLink>
                                <p className="question-description">
                                  {question.description}
                                </p>
                                <p className="question-bottom">
                                  {question.views} views,{" "}
                                  {question.upvotes.length} upvotes,{" "}
                                  {question.answers.length} answers{" "}
                                  <span>{getDate(question.createdAt)}</span>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No questions found</p>
                          )}
                        </div>
                      )}
                      {selectedSection === "answers" && (
                        <div className="questions answers">
                          {user.answers && user.answers.length > 0 ? (
                            user.answers.map((answer, index) => (
                              <div className="question answer" key={answer._id}>
                                <NavLink
                                  to={`/discuss/view-question/${answer.question}`}
                                  className="question-description"
                                >
                                  {index + 1}. {answer.description}
                                </NavLink>
                                <p className="question-bottom">
                                  {answer.upvotes.length} upvotes
                                  <span>{getDate(answer.createdAt)}</span>
                                </p>
                              </div>
                            ))
                          ) : (
                            <p>No answers found</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </section>
        </div>
      ) : (
        "User Not Found"
      )}
      <SnackbarCustom ref={snackbarRef} message={message} type={SnackbarType} />
    </>
  );
}

export default Profile;
