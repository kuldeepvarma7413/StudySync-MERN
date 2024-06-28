import React, { useEffect, useState, useRef } from "react";
import "./css/question.css";
import "./css/answer.css";
import timeAgo from "../../utils/timeAgo";
import { BiSolidUpvote } from "react-icons/bi";
import Cookies from "js-cookie";
import SnackbarCustom from "../common/SnackbarCustom";
import { NavLink } from "react-router-dom";

function Answer({ answer }) {
  const [voted, setVoted] = React.useState(false);
  const [votes, setVotes] = React.useState(answer.upvotes.length);

  const user = JSON.parse(localStorage.getItem("user"));

  // snack bar
  const snackbarRef = useRef(null);
  const [snackBarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");

  // if user already upvoted
  useEffect(() => {
    if (user && answer.upvotes.includes(user._id)) {
      setVoted(true);
    }
  }, []);

  // upvote and remove upvote
  const addVote = async () => {
    if (!user) {
      setSnackBarType("error");
      setMessage("Please login to upvote");
      snackbarRef.current.show();
      return;
    }
    if (!voted) {
      // Upvote
      setVotes((prevVotes) => prevVotes + 1);
      setVoted(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/answers/addvote/${answer._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + Cookies.get("token"),
            },
          }
        );
        const data = await res.json();
        if (data.status !== "OK") {
          console.log("upvoted error");
          setVotes((prevVotes) => prevVotes - 1);
          setVoted(false);
        }
      } catch (err) {
        console.log(err);
        console.log("upvoted error 2");
        setVotes((prevVotes) => prevVotes - 1);
        setVoted(false);
      }
    } else {
      // remove upvote
      setVotes((prevVotes) => prevVotes - 1);
      setVoted(false);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/answers/removevote/${answer._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + Cookies.get("token"),
            },
          }
        );
        const data = await res.json();
        if (data.status !== "OK") {
          console.log("downvoted error");
          setVotes((prevVotes) => prevVotes + 1);
          setVoted(true);
        }
      } catch (err) {
        console.log(err);
        console.log("downvoted error 2");
        setVotes((prevVotes) => prevVotes + 1);
        setVoted(true);
      }
    }
  };

  return (
    <div className="question-card answer-card">
      <SnackbarCustom ref={snackbarRef} type={snackBarType} message={message} />
      <div className="analysis">
        <img src={answer.user.photo} alt="user image" />
        <div className="analysis-action">
          <BiSolidUpvote
            className="upvote"
            onClick={addVote}
            style={voted && { color: "#4E3366" }}
          />
          <p>{votes}</p>
          {/* <BiSolidUpvote
                    className="downvote"
                    onClick={removeVote}
                    style={downvoted && { color: "#4E3366" }}
                  /> */}
        </div>
      </div>
      <div className="details">
        <p className="description">{answer.description}</p>
        <div className="bottom">
          <p>Replied {timeAgo(answer.createdAt)}</p>
          <p>
            by{" "}
            <NavLink to={`/profile/${answer.user._id}`}>
              <u>{answer.user.username}</u>
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Answer;
