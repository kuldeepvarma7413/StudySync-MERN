import React, { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import "./css/admin.css";
import SnackbarCustom from "../components/common/SnackbarCustom";
import UsersTable from "../components/admin/UsersTable";
import ReportsTable from "../components/admin/ReportsTable";
import Overview from "../components/admin/Overview";
import Courses from "../components/admin/Courses";
import Files from "../components/admin/Files";
import Discussions from "../components/admin/Discussions";

function Admin() {
  document.title = "Dashboard | StudySync";
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Overview");

  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  //   data
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [caFiles, setCaFiles] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [reports, setReports] = useState([]);

  const showSnackbar = (message, type) => {
    setMessage(message);
    setSnackBarType(type);
    snackbarRef.current.show();
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/user/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") setUsers(data.users);
      else throw new Error("Error fetching users");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch(`/report/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") setReports(data.reports);
      else throw new Error("Error fetching reports");
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`/courses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") {
        setCourses(data.data);
      } else {
        throw new Error("Error fetching courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchPdfFiles = async () => {
    try {
      const response = await fetch(`/content/pdffiles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") {
        setPdfFiles(data.data);
      } else {
        throw new Error("Error fetching pdf files");
      }
    } catch (error) {
      console.error("Error fetching pdf files:", error);
      showSnackbar("Error fetching pdf files", "error");
    }
  };

  const fetchCAFiles = async () => {
    try {
      const response = await fetch(`/content/cafiles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") {
        setCaFiles(data.data);
      } else {
        throw new Error("Error fetching ca files");
      }
    } catch (error) {
      console.error("Error fetching ca files:", error);
      showSnackbar("Error fetching ca files", "error");
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/questions`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") {
        setQuestions(data.data);
      } else {
        throw new Error("Error fetching questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      showSnackbar("Error fetching questions", "error");
    }
  };

  const fetchAnswers = async () => {
    try {
      const response = await fetch(`/answers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await response.json();
      if (data.status === "OK") {
        setAnswers(data.data);
      } else {
        throw new Error("Error fetching answers");
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      showSnackbar("Error fetching answers", "error");
    }
  };

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();
  const navigate = useNavigate();

  const updateQueryParameter = (key, value) => {
    query.set(key, value);
    navigate(`?${query.toString()}`, { replace: true });
  };

  useEffect(() => {
    const tabb = query.get("tab");
    if (tabb) {
      setTab(tabb);
    } else {
      updateQueryParameter("tab", tab);
    }
  }, []);

  useEffect(() => {
    updateQueryParameter("tab", tab);
  }, [tab]);

  const checkAccess = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      });
      const data = await res.json();
      if (data.status === "OK") {
        if (data.user.role !== "admin") {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();

    // promise all
    fetchUsers();
    fetchReports();
    fetchCourses();
    fetchPdfFiles();
    fetchCAFiles();
    fetchQuestions();
    fetchAnswers();
  }, []);

  return (
    <div className="admin">
      {loading ? (
        <div className="loading">
          <p className="loader"></p>
        </div>
      ) : (
        <>
          <div className="left-container">
            <ul>
              <NavLink
                to="?tab=Overview"
                className={tab === "Overview" ? "selected" : ""}
                onClick={() => setTab("Overview")}
              >
                Overview
              </NavLink>
              <NavLink
                to="?tab=Files"
                className={tab === "Files" ? "selected" : ""}
                onClick={() => setTab("Files")}
              >
                Files
              </NavLink>
              <NavLink
                to="?tab=Courses"
                className={tab === "Courses" ? "selected" : ""}
                onClick={() => setTab("Courses")}
              >
                Courses
              </NavLink>
              <NavLink
                to="?tab=Discussion"
                className={tab === "Discussion" ? "selected" : ""}
                onClick={() => setTab("Discussion")}
              >
                Discussion
              </NavLink>
              <NavLink
                to="?tab=Reports"
                className={tab === "Reports" ? "selected" : ""}
                onClick={() => setTab("Reports")}
              >
                Reports
              </NavLink>
              <NavLink
                to="?tab=Users"
                className={tab === "Users" ? "selected" : ""}
                onClick={() => setTab("Users")}
              >
                Users
              </NavLink>
            </ul>
          </div>
          <div className="right-container">
            {tab === "Overview" && (
              <Overview
                data={{
                  users: users.length,
                  reports: reports.length,
                  questions: questions.length,
                  answers: answers.length,
                  pdffiles: pdfFiles.length,
                  cafiles: caFiles.length,
                }}
              />
            )}
            {tab === "Files" && (
              <Files
                pdffiles={pdfFiles}
                cafiles={caFiles}
                snackbar={showSnackbar}
              />
            )}
            {tab === "Courses" && (
              <Courses allCourses={courses} snackbar={showSnackbar} />
            )}
            {tab === "Discussion" && (
              <Discussions
                snackbar={showSnackbar}
                questions={questions}
                answers={answers}
              />
            )}
            {tab === "Reports" && <ReportsTable allReports={reports} />}
            {tab === "Users" && <UsersTable allUsers={users} />}
          </div>
          <SnackbarCustom
            ref={snackbarRef}
            message={message}
            type={SnackbarType}
          />
        </>
      )}
    </div>
  );
}

export default Admin;
