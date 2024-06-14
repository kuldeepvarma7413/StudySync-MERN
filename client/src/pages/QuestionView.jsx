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

  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerLoading, setIsAnswerLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://studysync-uunh.onrender.com/questions/${questionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    setIsAnswerLoading(true);
    fetch(`https://studysync-uunh.onrender.com/answers/${questionId}`, {
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
    fetch(`https://studysync-uunh.onrender.com/answers/add`, {
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
          fetch(`https://studysync-uunh.onrender.com/answers/${questionId}`, {
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

  return (
    <>
      <div className="question-view">
        {isLoading && <p className="loader"></p>}
        {!isLoading && (
          <>
            <div className="question-card">
              <div className="analysis">
                <div className="data-analysis">
                  <span>
                    <FaRegEye />
                    <p>{question.views}</p>
                  </span>
                  <span>
                    <FaReply />
                    <p>{question.answers.length}</p>
                  </span>
                </div>
                <div className="analysis-action">
                  <BiSolidUpvote className="upvote" />
                  <p>{question.upvotes.length}</p>
                  <BiSolidUpvote className="downvote" />
                </div>
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
                    <span>
                      <img src={question.user.photo} alt="user image" />
                      {question.user.email}
                    </span>
                    <p>asked {timeAgo(question.createdAt)}</p>
                  </p>
                </div>
              </div>
            </div>
            {/* answers */}
            <p className="answers-title">Answers</p>
            {/* all answers */}
            {isAnswerLoading && <p className="loader loader-small"></p>}
            {answers && (
              <div className="answers">
                {answers.map((answer, index) => {
                  return (
                    <div className="question-card answer-card">
                      <div className="analysis">
                        <img src={answer.user.photo} alt="user image" />
                        <div className="analysis-action">
                          <BiSolidUpvote className="upvote" />
                          <p>{answer.upvotes.length}</p>
                          <BiSolidUpvote className="downvote" />
                        </div>
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
                <form>
                  <div className="reply">
                    <textarea
                      placeholder="Write your answer here"
                      value={answerDescription}
                      required={true}
                      onChange={(e) => changeAnswerDescription(e.target.value)}
                    ></textarea>
                    <button onClick={(e)=>handlePostAnswer(e)}>Post Answer</button>
                  </div>
                </form>
              </div>
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
