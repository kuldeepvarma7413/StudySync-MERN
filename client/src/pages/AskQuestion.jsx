import React, { useState, useRef } from "react";
import "./css/askquestion.css";
import { FaArrowRight } from "react-icons/fa";
import FooterSmall from "../components/common/FooterSmall";
import SnackbarCustom from "../components/common/SnackbarCustom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";

function AskQuestion() {
  document.title = "Ask Question | StudySync";
  // input validation
  const [isTitle, setIsTitle] = useState(true);
  const [isDescription, setIsDescription] = useState(false);
  const [isTags, setIsTags] = useState(false);

  // values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTags] = useState("");

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  const setTitleValue = (e) => {
    setTitle(e.target.value);
    if (e.target.value.length > 0) {
      setIsDescription(true);
      setIsTags(true);
    } else {
      setIsDescription(false);
      setIsTags(false);
    }
  };

  const setDescriptionValue = (e) => {
    setDescription(e.target.value);
    if (e.target.value.length > 0) {
      setIsTags(true);
    } else {
      setIsTags(false);
    }
  };

  const handleSubmit = () => {
    if (isTitle && isDescription && isTags && tag.length > 0) {
      // send request if all fields are unblocked (all fields have content) and also check tags in end
      fetch(`${process.env.REACT_APP_BACKEND_URL}/questions/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
        body: JSON.stringify({
          title,
          description,
          tag,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "OK") {
            setMessage("Question added successfully");
            setSnackBarType("success");
            snackbarRef.current.show();
            // stop for 1 second
            setTimeout(() => {}, 1000);
            window.location.href = "/discuss";
          }else{
            // throw exception
            throw new Error("Failed to add question");
          }
        })
        .catch((error) => {
          console.log(error);
          setMessage("Failed to add question");
          setSnackBarType("error");
          snackbarRef.current.show();
        });

        // fetch questions and console
        fetch(`${process.env.REACT_APP_BACKEND_URL}/questions`)
        .then((res) => res.json())
    } else {
      setMessage("Please fill all the fields");
      setSnackBarType("error");
      snackbarRef.current.show();
    }
  };

  return (
    <>
      <div className="ask-question">
        <p className="pathline"><NavLink to={'/discuss'}>Discuss</NavLink> &gt;<NavLink>Ask Question</NavLink></p>
        <div className="inputs">
          {/* title */}
          <div className="input-div">
            {!isTitle && <div className="overlay"></div>}
            <div className="title input-top">
              <p>Title</p>
              <FaArrowRight className="arrow" />
            </div>
            <textarea
              type="text"
              rows={2}
              id="title"
              value={title}
              onChange={(e) => setTitleValue(e)}
              placeholder="Enter title here"
            />
          </div>
          {/* description */}
          <div className="input-div">
            {!isDescription && <div className="overlay"></div>}
            <div className="title input-top">
              <p>Description</p>
              <FaArrowRight className="arrow" />
            </div>
            <textarea
              type="text"
              rows={15}
              id="title"
              value={description}
              onChange={(e) => setDescriptionValue(e)}
              placeholder="Enter description here"
            />
          </div>
          {/* tags */}
          <div className="input-div">
            {!isTags && <div className="overlay"></div>}
            <div className="title input-top">
              <p>Tags</p>
              <FaArrowRight className="arrow" />
            </div>
            <p className="tags-instructions">
              Add upto 5 tags to describe your question. saparate them with
              comma (,)
            </p>
            <textarea
              type="text"
              rows={1}
              id="title"
              value={tag}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags here"
            />
          </div>
        </div>
        <button className="submit-btn btn" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <SnackbarCustom ref={snackbarRef} message={message} type={SnackbarType} />
      <FooterSmall />
    </>
  );
}

export default AskQuestion;
