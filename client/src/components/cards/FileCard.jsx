import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./css/filecard.css";
import { useNavigate } from "react-router-dom";

function FileCard(props) {
  const [loading, setLoading] = useState(true);

  const dateObject = new Date(props.createdAt);
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
  });

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`view?${props._id}`, {
      state: { file: props },
    });
  };

  return (
    <div className="filecard">
      <div className="thumbnail">
        {props.fileUrl && (
          <Document
            file={props.fileUrl}
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
          {props.unit
            ? props.title
            : "CA " + props.caNumber + " " + props.courseCode}
        </h3>
        <p className="coursename">{props.courseCode}</p>
        <p className="filecard-text">
          Uploaded by {props.uploadedBy}
          <br />
          on {dateObject.toLocaleString()}
        </p>
        <p className="filecard-text">
          Views: {props.views} Likes: {props.likes}
        </p>
      </div>
    </div>
  );
}

export default FileCard;
