import React from "react";
import "./css/question.css";
import { FaRegEye } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";
import { FaReply } from "react-icons/fa";

function Question({ question }) {
  return (
    <div className="question-card">
      <div className="analysis">
        <img src={question.user.photo} alt="user image" />
        <p>{question.user.email}</p>
        <div className="data-analysis">
          <span>
            <FaRegEye />
            <p>{question.views}</p>
          </span>
          <span>
            <BiSolidUpvote />
            <p>{question.upvotes.length}</p>
          </span>
          <span>
            <FaReply />
            <p>{question.answers.length}</p>
          </span>
        </div>
      </div>
      <div className="details">
        <h3>{question.title}</h3>
        <p>{question.description}</p>
        <div className="bottom">
          <div className="tags">
            {question.tags.map((tag, index) => {
              return <p key={index}>{tag}</p>;
            })}
          </div>
          <p>asked {timeAgo(question.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}

function timeAgo(timestamp) {
  const now = new Date();
  const pastDate = new Date(timestamp);
  const timeDifference = now.getTime() - pastDate.getTime();
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }
}

export default Question;
