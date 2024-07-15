import React, { useEffect } from "react";
import "./css/resources.css";
import FileCard from "../components/cards/FileCard";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import FooterSmall from "../components/common/FooterSmall";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function Resources() {
  document.title = "Resources | StudySync";

  const [isLoading, setIsLoading] = useState(true);

  // filters
  const [fileType, setFileType] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [uploadedByVal, setUploadedByVal] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 15; // Number of files per page
  const [files, setFiles] = useState([]); // Your array of files
  const [filteredFiles, setFilteredFiles] = useState([]); // Filtered files array

  // ca
  const [caFiles, setCaFiles] = useState([]);
  const [filteredCaFiles, setFilteredCaFiles] = useState([]); // Filtered caFiles array

  // courses
  const [courses, setCourses] = useState([]);

  // Logic to slice files based on current page
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;

  // Determine current files based on fileType
  let currentFiles = [];
  if (fileType === "ppt") {
    currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  } else if (fileType === "ca") {
    currentFiles = filteredCaFiles.slice(indexOfFirstFile, indexOfLastFile);
  }

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  // query params
  useEffect(() => {
    if (subjectFilter) {
      updateQueryParameter("subject", subjectFilter);
    }
    if (uploadedByVal) {
      updateQueryParameter("uploadedBy", uploadedByVal);
    }
    if (dateFilter) {
      updateQueryParameter("date", dateFilter);
    }
    if (fileType) {
      updateQueryParameter("fileType", fileType);
    }
  }, [subjectFilter, uploadedByVal, dateFilter, fileType]);

  // set filters from query
  useEffect(() => {
    const subject = query.get("subject");
    const uploadedBy = query.get("uploadedBy");
    const date = query.get("date");
    const fileType = query.get("fileType");

    if (subject) {
      setSubjectFilter(subject);
    }
    if (uploadedBy) {
      setUploadedByVal(uploadedBy);
    }
    if (date) {
      setDateFilter(date);
    }
    if (fileType) {
      setFileType(fileType);
    } else {
      setFileType("ppt");
    }
  }, []);

  // Fetch files based on file type
  useEffect(() => {
    setIsLoading(true);
    const fetchFiles = async () => {
      try {
        if (fileType === "ppt") {
          const response = await fetch(`/content/pdffiles`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );
          const data = await response.json();
          setFiles(data.data);
          setFilteredFiles(data.data);
        } else if (fileType === "ca") {
          const response = await fetch(`/content/cafiles`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
              },
            }
          );
          const data = await response.json();
          setCaFiles(data.data);
          setFilteredCaFiles(data.data);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
      }finally{
        setIsLoading(false);
      }
    };

    fetchFiles();
  }, [fileType]);

  // Fetch courses
  useEffect(() => {
    fetch(`/courses`, {
      headers: {
        authorization: "Bearer " + Cookies.get("token").replace("Bearer ", ""),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setCourses(res.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  // Apply filters to files
  useEffect(() => {
    const applyFilters = () => {
      const applyFilterLogic = (fileArray) => {
        return fileArray.filter((file) => {
          const subjectMatch = subjectFilter
            ? file.course === subjectFilter
            : true;
          const uploadedByMatch =
            uploadedByVal === "studysync"
              ? file.uploadedBy === "studysync"
              : true;
          const dateMatch = dateFilter
            ? file.createdAt.substring(0, 10) === dateFilter
            : true;
          return subjectMatch && uploadedByMatch && dateMatch;
        });
      };

      if (fileType === "ppt") {
        setFilteredFiles(applyFilterLogic(files));
      } else if (fileType === "ca") {
        setFilteredCaFiles(applyFilterLogic(caFiles));
      }
    };

    applyFilters();
  }, [subjectFilter, uploadedByVal, dateFilter, files, caFiles, fileType]);

  const handleClearFilters = () => {
    setSubjectFilter("");
    setDateFilter("");
    setUploadedByVal("");
    navigate("?", { replace: true });
  };

  return (
    <>
      <div className="resources-container">
        {/* filters */}
        <div className="filters">
          <div className="filter">
            <select
              name=""
              className="course-select"
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
          <p>
            {fileType === "ppt" ? filteredFiles.length : filteredCaFiles.length}{" "}
            Results Found
          </p>
        </div>
        {/* resources */}
        <div className="resources">
          {isLoading ? (
            <div className="loader">
              <div className="loader-spinner"></div>
            </div>
          ) : currentFiles.length === 0 ? (
            <div className="loader">
              <p>No files found</p>
            </div>
          ) : (
            currentFiles.map((file, index) => (
              <FileCard key={index} file={file} fileType={fileType} />
            ))
          )}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(
            (fileType === "ppt"
              ? filteredFiles.length
              : filteredCaFiles.length) / filesPerPage
          )}
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
