import React, { useEffect, useState } from "react";
import "./css/fileview.css";
import { useLocation } from "react-router-dom";
import FooterSmall from "../components/common/FooterSmall";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import Cookies from "js-cookie";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function FileView() {
  document.title = "File | StudySync";
  const file = useLocation().state.file;
  const dateObject = new Date(file.createdAt);

  const fileType = new URLSearchParams(useLocation().search).get("fileType");

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // increment view
  useEffect(() => {
    if (fileType === "ppt") {
      fetch(
        `${process.env.REACT_APP_BACKEND_URL}/content/pdfview/${file._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/content/caview/${file._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    }
  }, []);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <>
      <div className="fileview">
        <div className="fileview-content">
          <div className="fileview-header">
            {fileType == "ppt" ? (
              <h1 className="fileview-title">{file.title}</h1>
            ) : (
              <h1 className="fileview-title">CA {file.caNumber} {file.courseCode}</h1>
            )}
            <p className="fileview-text analysis">
              <span>
                Views: {file.views}, Pages: {numPages}
                {/* Likes: {file.likes}  */}
              </span>
              <span>
                Uploaded by{" "}
                <span className="fileview-text-bold">{file.uploadedBy}</span> on{" "}
                <b>{dateObject.toLocaleString()}</b>
              </span>
            </p>
            <div className="fileview-description">
              <p className="fileview-text">Description: {file.description}</p>
            </div>
          </div>
          <div className="fileview-body">
            <div className="fileview-thumbnail">
              {/* <div className='loader'></div> */}
              <div className="pdfview">
                {loading && <div className="loader"></div>}
                <Document
                  file={file.fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  {Array.apply(null, Array(numPages))
                    .map((x, i) => i + 1)
                    .map((page) => {
                      return (
                        <Page
                          pageNumber={page}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      );
                    })}
                </Document>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterSmall />
    </>
  );
}

export default FileView;
