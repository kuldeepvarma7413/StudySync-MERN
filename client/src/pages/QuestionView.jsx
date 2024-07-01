import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import FooterSmall from "../components/common/FooterSmall";
import { BiSolidUpvote } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import "../components/cards/css/question.css";
import "./css/questionview.css";
import Answer from "../components/cards/Answer";
import timeAgo from "../utils/timeAgo";
import Cookies from "js-cookie";
import SnackbarCustom from "../components/common/SnackbarCustom";
// import { FaRegEye } from "react-icons/fa";
// import { FaReply } from "react-icons/fa";

function QuestionView() {
  document.title = "Question | StudySync";

  const param = useParams();

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const questionId = param.id;

  const [answerDescription, changeAnswerDescription] = useState("");

  const [question, setQuestion] = useState({});
  const [answers, setAnswers] = useState([]);

  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isAnswerLoading, setIsAnswerLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/${questionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + Cookies.get("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data);
        setVotes(data.upvotes.length);
        // if user has already upvoted
        if (user && data.upvotes.includes(user._id)) {
          setVoted(true);
        }
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    setIsAnswerLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + Cookies.get("token"),
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
    if (!user) {
      setMessage("Please login to post an answer");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    if (answerDescription.length === 0) {
      setMessage("Please write an answer");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }

    setIsPosting(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + Cookies.get("token"),
      },
      body: JSON.stringify({
        description: answerDescription,
        questionId: questionId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          changeAnswerDescription("");
          fetch(`${process.env.REACT_APP_BACKEND_URL}/answers/${questionId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + Cookies.get("token"),
            },
          })
            .then((res) => res.json())
            .then((data) => {
              setAnswers(data);
            });
        } else {
          setMessage(data.error);
          setSnackBarType("error");
          snackbarRef.current.show();
        }
      })
      .finally(() => {
        setIsPosting(false);
      });
  };

  // upvote and remove upvote
  const addVote = async () => {
    if (!user) {
      setMessage("Please login to upvote the question");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }
    if (!voted) {
      // Upvote
      setVotes((prevVotes) => prevVotes + 1);
      setVoted(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/questions/addvote/${questionId}`,
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
          setVotes((prevVotes) => prevVotes - 1);
          setVoted(false);
        }
      } catch (err) {
        console.log(err);
        setVotes((prevVotes) => prevVotes - 1);
        setVoted(false);
      }
    } else {
      // remove upvote
      setVotes((prevVotes) => prevVotes - 1);
      setVoted(false);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/questions/removevote/${questionId}`,
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
    <>
      <div className="question-view">
        <SnackbarCustom
          ref={snackbarRef}
          message={message}
          type={SnackbarType}
        />
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
                    <NavLink to={`/profile/${question.user._id}`}>
                      <u>{question.user.username}</u>
                    </NavLink>
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
                  {answers.map((answer, index) => (
                    <Answer key={index} answer={answer} />
                  ))}
                </div>
              </>
            )}
            {/* reply */}
            <form>
              <div className="reply">
                <textarea
                  placeholder="Write your answer here"
                  value={answerDescription}
                  required={true}
                  onChange={(e) => changeAnswerDescription(e.target.value)}
                ></textarea>
                <button
                  onClick={(e) => handlePostAnswer(e)}
                  disabled={isPosting ? true : false}
                >
                  {isPosting ? "Posting..." : "Post Answer"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
      <FooterSmall />
    </>
  );
}

export default QuestionView;
