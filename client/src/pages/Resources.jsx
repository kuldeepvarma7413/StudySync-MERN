import React, { useEffect } from "react";
import "./css/resources.css";
import FileCard from "../components/cards/FileCard";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import FooterSmall from "../components/common/FooterSmall";

function Resources() {
  // filters
  const [fileType, setFileType] = useState("ppt");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [uploadedByVal, setUploadedByVal] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 15; // Number of files per page
  const [files, setFiles] = useState([]); // Your array of files

  // ca
  const [caFiles, setCaFiles] = useState([]);
  // courses
  const [courses, setcourses] = useState([]);

  // Logic to slice files based on current page
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let queryParams = "?";
    if (subjectFilter) {
      queryParams += `&subject=${subjectFilter}`;
    }
    if (uploadedByVal) {
      queryParams += `&uploadedBy=${uploadedByVal}`;
    }
    if (dateFilter) {
      queryParams += `&date=${dateFilter}`;
    }

    if (fileType === "ppt") {
      fetch(`https://studysync-uunh.onrender.com/content/pdffiles${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data);
          setFiles(res.data);
        });
    } else {
      // ca
      fetch(`https://studysync-uunh.onrender.com/content/cafiles${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log(res.data);
          setCaFiles(res.data);
        });
    }
  }, [subjectFilter, uploadedByVal, dateFilter, fileType]);

  useEffect(() => {
    // fetch courses
    fetch("https://studysync-uunh.onrender.com/courses", {
      headers: {
        authorization:
          "Bearer " + localStorage.getItem("token").replace("Bearer ", ""),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setcourses(res.data);
      });
  }, []);

  const handleClearFilters = () => {
    setSubjectFilter("");
    setDateFilter("");
    setUploadedByVal("");
  };

  return (
    <>
      <div className="resources-container">
        {/* filters */}
        <div className="filters">
          <div className="filter">
            <select
              name=""
              id=""
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
            >
              <option value="">Select Subject</option>
              {courses.map((course, index) => (
                <option key={index} value={course._id}>
                  {course.courseCode}: {course.courseTitle}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <select
              name=""
              id=""
              value={uploadedByVal}
              onChange={(e) => setUploadedByVal(e.target.value)}
            >
              <option value="">Uploaded By</option>
              <option value="studysync">StudySync</option>
              <option value="users">All</option>
            </select>
            <a onClick={handleClearFilters}>Clear All</a>
          </div>
          <div className="filetype">
            <select
              name=""
              id=""
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
            >
              <option value="ppt">PPTs</option>
              <option value="ca">CA</option>
            </select>
          </div>
        </div>
        {/* result */}
        <div className="result">
          <p>{fileType=='ppt' ? files.length : caFiles.length} Results Found</p>
        </div>
        {/* resources */}
        <div className="resources">
          {fileType === "ppt" ? (
            <>
              {currentFiles.map((file, index) => (
                <FileCard key={index} {...file} />
              ))}
            </>
          ) : (
            <>
              {caFiles.map((file, index) => (
                <FileCard key={index} {...file} />
              ))}
            </>
          )}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(files.length / filesPerPage)}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={({ selected }) => handlePageChange(selected + 1)}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>
      <FooterSmall />
    </>
  );
}

export default Resources;
