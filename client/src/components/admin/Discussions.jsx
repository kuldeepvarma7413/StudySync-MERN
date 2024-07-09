import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./css/discussions.css";

const Discussions = ({ questions, answers, snackbar }) => {
  const [filterType, setFilterType] = useState("questions");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(filterType === "questions" ? questions : answers);
  }, [filterType, questions, answers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchTermLower = e.target.value.toLowerCase();
    if (filterType === "questions") {
      setFilteredData(
        questions.filter(
          (question) =>
            question.title.toLowerCase().includes(searchTermLower) ||
            question.user?.username.toLowerCase().includes(searchTermLower) ||
            "" ||
            question.answers.some((answer) =>
              answer.description.toLowerCase().includes(searchTermLower)
            )
        )
      );
    } else {
      setFilteredData(
        answers.filter(
          (answer) =>
            answer.description.toLowerCase().includes(searchTermLower) ||
            answer.user?.username.toLowerCase().includes(searchTermLower) ||
            "" ||
            answer.questionTitle?.toLowerCase().includes(searchTermLower) ||
            ""
        )
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `/${filterType.slice(0, -1)}s/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === "OK") {
        setFilteredData(filteredData.filter((item) => item._id !== id));
        snackbar(
          `${filterType.slice(0, -1).toUpperCase()} deleted successfully`,
          "success"
        );
      } else {
        throw new Error("Error deleting");
      }
    } catch (error) {
      console.error("Error deleting", error);
      snackbar(`Error deleting ${filterType.slice(0, -1)}`, "error");
    }
  };

  return (
    <div className="discussions-container">
      <div className="discussions-header">
        <h2>Manage Discussions</h2>
        <div className="search-and-filter">
          <select
            value={filterType}
            className="filter-type-dropdown"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="questions">Questions</option>
            <option value="answers">Answers</option>
          </select>
          <input
            type="text"
            placeholder="Search by username, title, or description"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            {filterType === "questions" ? (
              <>
                <th>Title</th>
                <th>Username</th>
                <th>Created At</th>
                <th>Tags</th>
                <th>Upvotes</th>
                <th>Answers</th>
                <th>Actions</th>
              </>
            ) : (
              <>
                <th>Description</th>
                <th>Username</th>
                <th>Question Title</th>
                <th>Created At</th>
                <th>Upvotes</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0
            ? "loading..."
            : filteredData.map((item) => (
                <tr key={item._id} data-id={item._id}>
                  {filterType === "questions" ? (
                    <>
                      <td>{item.title}</td>
                      <td>{item.user?.username}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.tags?.join(", ")}</td>
                      <td>{item.upvotes?.length}</td>
                      <td>{item.answers?.length}</td>
                      <td>
                        <button
                          className="delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.description}</td>
                      <td>{item.user?.username}</td>
                      <td>{item.questionTitle}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td>{item.upvotes?.length}</td>
                      <td>
                        <button
                          className="delete"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default Discussions;
