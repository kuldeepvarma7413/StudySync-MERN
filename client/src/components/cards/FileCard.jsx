import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./css/filecard.css";
import { useNavigate } from "react-router-dom";

function FileCard({ file, fileType }) {
  const [loading, setLoading] = useState(true);

  const dateObject = new Date(file.createdAt);
  const dateCaObject = new Date(file.caDate);
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  const fileTitle = file.unit
    ? file.title
    : file.title +
      " " +
      dateCaObject.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`view?id=${file._id}&fileType=${fileType}`);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(file.fileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileTitle + ".pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error while fetching file", error);
    }
  };

  return (
    <div className="filecard">
      <div className="thumbnail">
        {file.fileUrl && (
          <Document file={file.fileUrl} onLoadSuccess={() => setLoading(false)}>
            <Page
              pageNumber={1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}
        {loading && <div className="loader"></div>}
      </div>
      <div className="filecard-content">
        <h3
          onClick={handleNavigate}
          className="filecard-title"
          title={fileTitle}
        >
          {fileTitle}
        </h3>
        <p className="coursename">
          {file.caNumber>=0 && "CA " + file.caNumber+" - "} {file.courseCode}
        </p>
        <p className="filecard-text">
          Uploaded by {file.uploadedBy}
          <br />
          on {dateObject.toLocaleString()}
        </p>
        <p className="filecard-text bottom">
          Views: {file.views}
          {/* Likes: {file.likes} */}
          <button onClick={handleDownload} className="btn download-btn">
            Download
          </button>
        </p>
      </div>
    </div>
  );
}

export default FileCard;
