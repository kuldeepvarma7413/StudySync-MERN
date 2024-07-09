import React from "react";
import "./css/question.css";
import { NavLink } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import timeAgo from "../../utils/timeAgo";

function Question({ question }) {
  return (
    <div className="question-card">
      <div className="analysis">
        <img src={question.user.photo ? question.user.photo : "https://res.cloudinary.com/dkjgwvtdq/image/upload/f_auto,q_auto/v1/profilephotos/pjo2blwkflwzxg8mhpoa"} alt="user image" />
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
        <h3>
          <NavLink to={`view-question/${question._id}`}>
            {question.title}
          </NavLink>
        </h3>
        <p className="line-limit-3">{question.description}</p>
        <div className="bottom">
          <div className="tags">
            {question.tags.map((tag, index) => {
              return <p key={index}>{tag}</p>;
            })}
          </div>
          <div className="asked-by">
            <NavLink to={`/profile/${question.user._id}`}><u>{question.user.username}</u></NavLink>
            <p> asked {timeAgo(question.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Question;
