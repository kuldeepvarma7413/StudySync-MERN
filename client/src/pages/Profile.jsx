import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import "./css/profile.css";
import { BiSolidUpvote } from "react-icons/bi";


function Profile() {
  document.title = "Profile | StudySync";
  const params = useParams();
  const userId = params.id;
  const [user, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      try {
        let res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${userId}`);
        res = await res.json();
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  },[]);

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
            <div className="nav-item">
                <NavLink to={'/profile/' + userId } activeClassName="active">Profile</NavLink>
                <NavLink to={'/profile/' + userId +'/change-password' } >Change Password</NavLink>
                <NavLink to={'/profile/' + userId + '/questions' } >Questions</NavLink>
                <NavLink to={'/profile/' + userId + '/answers' } >Answers</NavLink>
            </div>
            <div className="content">

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
