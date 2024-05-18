import React from "react";
import "./css/resources.css";
import FileCard from "../components/cards/FileCard";
import { useState } from "react";
import ReactPaginate from "react-paginate";
import FooterSmall from "../components/common/FooterSmall";

function Resources() {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 15; // Number of files per page
  const files = [{}, {}, {}, {}, {}]; // Your array of files

  // Logic to slice files based on current page
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = files.slice(indexOfFirstFile, indexOfLastFile);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="resources-container">
        {/* filters */}
        <div className="filters">
          <div className="filter">
            <select name="" id="">
              <option value="">Select Subject</option>
            </select>
            <input type="date" />
            <select name="" id="">
              <option value="">Uploaded By</option>
            </select>
            <a>Clear All</a>
          </div>
          <div className="filetype">
            <select name="" id="">
              <option value="ppt">PPTs</option>
              <option value="ca">CA</option>
            </select>
          </div>
        </div>
        {/* result */}
        <div className="result">
          <p>18 Results Found</p>
        </div>
        {/* resources */}
        <div className="resources">
          {currentFiles.map((file, index) => (
            <FileCard key={index} {...file} />
          ))}
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
