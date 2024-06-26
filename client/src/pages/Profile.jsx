import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./css/profile.css";
import { BiSolidUpvote } from "react-icons/bi";
import getDate from "../utils/getDate";

function Profile() {
  document.title = "Profile | StudySync";
  const params = useParams();
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        let res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/user/${params.id}`
        );
        res = await res.json();
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [params.id]);

  useEffect(() => {
    // onclick on each nav item and add selected class
    const addSelectedClass = () => {
      const navItem = document.querySelectorAll(".nav-item");
      navItem.forEach((item) => {
        item.addEventListener("click", () => {
          navItem.forEach((item) => {
            item.classList.remove("selected");
          });
          item.classList.add("selected");
        });
      });
    };

    addSelectedClass();
  }, []);

  return (
    <>
      {user != null ? (
        <div className="profile-container">
          <section className="left-section">
            <img src={user.profilePic} alt="profile-pic" />
            <h2>{user.name}</h2>
            <p className="username">@{user.username}</p>
            <p className="upvote">
              {user.totalUpvotes}
              <BiSolidUpvote className="upvoteIcon" />
            </p>
            <p className="profile-views">20 views</p>
          </section>
          <section className="right-section">
            <div className="nav-items">
              <Link className="nav-item selected">Profile</Link>
              <Link className="nav-item">Change Password</Link>
              <Link className="nav-item">Questions</Link>
              <Link className="nav-item">Answers</Link>
            </div>
            <div className="content">
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
            </div>
          </section>
        </div>
      ) : (
        "Unauthorized Access"
      )}
    </>
  );
}

export default Profile;
