import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./css/filecard.css";
import { useNavigate } from "react-router-dom";

function FileCard({file, fileType}) {
  const [loading, setLoading] = useState(true);

  const dateObject = new Date(file.createdAt);
  const dateCaObject = new Date(file.caDate);
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`view?${file._id}&fileType=${fileType}`, {
      state: { file: file},
    });
  };

  return (
    <div className="filecard">
      <div className="thumbnail">
        {file.fileUrl && (
          <Document
            file={file.fileUrl}
            onLoadSuccess={() => setLoading(false)}
          >
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
        <h3 onClick={handleNavigate} className="filecard-title">
          {file.unit
            ? file.title
            : "CA " + file.caNumber + " " + file.courseCode + " " + dateCaObject.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <p className="coursename">{file.courseCode}</p>
        <p className="filecard-text">
          Uploaded by {file.uploadedBy}
          <br />
          on {dateObject.toLocaleString()}
        </p>
        <p className="filecard-text">
          Views: {file.views} 
          {/* Likes: {file.likes} */}
        </p>
      </div>
    </div>
  );
}

export default FileCard;
