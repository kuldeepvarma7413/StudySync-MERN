import React, { useState, useRef } from "react";
import FooterSmall from "../components/common/FooterSmall";
import "./css/report.css";
import SnackbarCustom from "../components/common/SnackbarCustom";

function Report() {
  const [subject, setSubject] = useState("");
  const [bugOrFeature, setBugOrFeature] = useState("bug");
  const [description, setDescription] = useState("");

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("${process.env.REACT_APP_BACKEND_URL}/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token").replace("Bearer ", ""),
      },
      body: JSON.stringify({ subject, bugOrFeature, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        // show snackbar
        setMessage("Report submitted successfully");
        setSnackBarType("success");
        snackbarRef.current.show();

        setSubject("");
        setBugOrFeature("bug");
        setDescription("");
      })
      .catch((err) => {
        console.log(err);
        // show snackbar
        setMessage("Something went wrong");
        setSnackBarType("error");
        snackbarRef.current.show();
      });
  };

  return (
    <>
      <div className="report-page">
        <h1>Report a Bug or Feature Request</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <br />
          <label htmlFor="bug-or-feature">Bug or Feature:</label>
          <select
            id="bug-or-feature"
            value={bugOrFeature}
            onChange={(e) => setBugOrFeature(e.target.value)}
          >
            <option value="bug">Bug</option>
            <option value="feature">Feature</option>
          </select>
          <br />
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            draggable="false"
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <br />
          <div className="submit-btn">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <SnackbarCustom ref={snackbarRef} message={message} type={SnackbarType} />
      <FooterSmall />
    </>
  );
}

export default Report;
