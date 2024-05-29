import React, { useState } from "react";
import "./css/fileview.css";
import { useLocation } from "react-router-dom";
import FooterSmall from "../components/common/FooterSmall";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function FileView() {
  const file = useLocation().state.file;
  const dateObject = new Date(file.createdAt);

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(true);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
  }

  return (
    <>
      <div className="fileview">
        <div className="fileview-content">
          <div className="fileview-header">
            <h1 className="fileview-title">{file.title}</h1>
            <div className="fileview-description">
              <p className="fileview-text">Description: {file.description}</p>
            </div>
            <p className="fileview-text">
              Uploaded by{" "}
              <span className="fileview-text-bold">{file.uploadedBy}</span> on <b>{dateObject.toLocaleString()}</b>
            </p>
            <p className="fileview-text">
              Views: {file.views} Likes: {file.likes} Pages: {numPages}
            </p>
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
