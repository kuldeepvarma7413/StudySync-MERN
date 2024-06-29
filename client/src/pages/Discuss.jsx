import React, { useState, useEffect } from "react";
import "./css/discuss.css";
import { NavLink } from "react-router-dom";
import Question from "../components/cards/Question";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";

function Discuss() {
  document.title = "Discuss | StudySync";
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("unanswered");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of questions per page

  // Calculate total pages based on items and items per page
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/questions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + Cookies.get("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredQuestions = questions.filter((question) => {
    const matchesSearchQuery = question.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "answered" && question.answers.length > 0) ||
      (filter === "unanswered" && question.answers.length === 0);

    return matchesSearchQuery && matchesFilter;
  });

  // Logic to slice questions based on current page
  const indexOfLastQuestion = (currentPage + 1) * itemsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - itemsPerPage;
  const currentQuestions = filteredQuestions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  // Handle page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="discuss">
      <section className="section-1">
        <p>All Questions</p>
        <NavLink to={"ask-question"} className="btn ask-btn">
          Ask Question
        </NavLink>
      </section>
      {/* search and filter */}
      <section className="section-2">
        <p>{currentQuestions.length} questions</p>
        <div className="search-filter-div">
          <input
            type="search"
            className="search"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="filters">
            <input
              type="radio"
              id="all-filter"
              name="filter"
              value="all"
              checked={filter === "all"}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label htmlFor="all-filter">All</label>
            <input
              type="radio"
              id="unanswered-filter"
              name="filter"
              value="unanswered"
              checked={filter === "unanswered"}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label htmlFor="unanswered-filter">Unanswered</label>
            <input
              type="radio"
              id="answered-filter"
              name="filter"
              value="answered"
              checked={filter === "answered"}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label htmlFor="answered-filter">Answered</label>
          </div>
        </div>
      </section>
      {/* questions */}
      <section className="section-3 questions">
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <p className="loader loader-small"></p>
          </div>
        ) : (
          <>
            {currentQuestions.length === 0 ? (
              <p>No questions found</p>
            ) : (
              currentQuestions.map((question, index) => (
                <Question key={index} question={question} />
              ))
            )}
          </>
        )}
      </section>
      {/* Pagination */}
      <ReactPaginate
        pageCount={totalPages}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        onPageChange={handlePageChange}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
}

export default Discuss;
