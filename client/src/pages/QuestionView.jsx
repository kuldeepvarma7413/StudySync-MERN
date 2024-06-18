import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FooterSmall from "../components/common/FooterSmall";
import { FaRegEye } from "react-icons/fa";
import { BiSolidUpvote } from "react-icons/bi";
import { FaReply } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "../components/cards/css/question.css";
import "./css/questionview.css";

function QuestionView() {
  const param = useParams();

  const questionId = param.id;

  const [answerDescription, changeAnswerDescription] = useState("");

  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);

  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerLoading, setIsAnswerLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setVotes(data.upvotes.length);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    setIsAnswerLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setAnswers(data);
        setIsAnswerLoading(false);
      });
  }, []);

  //   post answer
  const handlePostAnswer = (e) => {
    e.preventDefault();
    if (answerDescription.length === 0) return alert("Please write something");
    fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        description: answerDescription,
        questionId: questionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "OK") {
          changeAnswerDescription("");
          fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setAnswers(data);
            });
        }
      });
  };

  // upvote and downvote

  // const addVote = () => {
  //   if (votes == question.upvotes.length) {
  //     setVotes(votes + 1);
  //     setVoted(true);
  //     setDownvoted(false);
  //   } else if (votes - 1 == question.upvotes.length) {
  //     setVotes(votes - 1);
  //     setVoted(false);
  //     setDownvoted(false);
  //   } else if (votes == question.upvotes.length - 1) {
  //     setVotes(votes + 2);
  //     setVoted(true);
  //     setDownvoted(false);
  //   } else {
  //     return;
  //   }
  // };

  // const removeVote = () => {
  //   // if already upvoted remove that vote and -1 vote else -1 vote
  //   if (votes == question.upvotes.length) {
  //     setVotes(votes - 1);
  //     setVoted(false);
  //     setDownvoted(true);
  //   } else if (votes + 1 == question.upvotes.length) {
  //     setVotes(votes + 1);
  //     setVoted(false);
  //     setDownvoted(false);
  //   } else if (votes == question.upvotes.length + 1) {
  //     setVotes(votes - 2);
  //     setVoted(false);
  //     setDownvoted(true);
  //   } else {
  //     return;
  //   }
  // };

  return (
    <>
      <div className="question-view">
        {isLoading && <p className="loader"></p>}
        {!isLoading && (
          <>
            <p className="pathline">
              <NavLink to={"/discuss"}>Discuss</NavLink> &gt;
              <NavLink>{questionId}</NavLink>
            </p>
            <div className="question-card">
              <div className="analysis">
                <img src={question.user.photo} alt="user image" />
                <div className="data-analysis">
                  <span>
                    {/* <FaRegEye /> */}
                    <p>{question.views} views</p>
                  </span>
                  <span>
                    {/* <FaReply /> */}
                    <p>{question.answers.length} answers</p>
                  </span>
                </div>
                {/* <div className="analysis-action">
                  <BiSolidUpvote
                    className="upvote"
                    onClick={addVote}
                    style={voted && { color: "#4E3366" }}
                  />
                  <p>{votes}</p>
                  <BiSolidUpvote
                    className="downvote"
                    onClick={removeVote}
                    style={downvoted && { color: "#4E3366" }}
                  />
                </div> */}
              </div>
              <div className="details">
                <h3>
                  <NavLink className="question-title">{question.title}</NavLink>
                </h3>
                <p className="description">{question.description}</p>
                <div className="bottom">
                  <div className="tags">
                    {question.tags.map((tag, index) => {
                      return <p key={index}>{tag}</p>;
                    })}
                  </div>
                  <p>
                    <span>{question.user.email}</span>
                    <p>asked {timeAgo(question.createdAt)}</p>
                  </p>
                </div>
              </div>
            </div>
            {/* answers */}
            <p className="answers-title">Answers</p>
            {/* all answers */}
            {isAnswerLoading && <p className="loader loader-small"></p>}
            {answers.length > 0 && (
              <>
              <div className="answers">
                {answers.map((answer, index) => {
                  return (
                    <div className="question-card answer-card">
                      <div className="analysis">
                        <img src={answer.user.photo} alt="user image" />
                        {/* <div className="analysis-action">
                          <BiSolidUpvote className="upvote" />
                          <p>{answer.upvotes.length}</p>
                          <BiSolidUpvote className="downvote" />
                        </div> */}
                      </div>
                      <div className="details">
                        <p className="description">{answer.description}</p>
                        <div className="bottom">
                          <p>Replied {timeAgo(answer.createdAt)}</p>
                          <p>by {answer.user.email}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* reply */}
              </div>
                <form>
                  <div className="reply">
                    <textarea
                      placeholder="Write your answer here"
                      value={answerDescription}
                      required={true}
                      onChange={(e) => changeAnswerDescription(e.target.value)}
                    ></textarea>
                    <button onClick={(e) => handlePostAnswer(e)}>
                      Post Answer
                    </button>
                  </div>
                </form>
                </>
            )}
          </>
        )}
      </div>
      <FooterSmall />
    </>
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

export default QuestionView;
