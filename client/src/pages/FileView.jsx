import React, { useEffect, useState } from "react";
import "./css/fileview.css";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [file, setFile] = useState({});
  const dateObject = new Date(file.createdAt);

  const fileType = new URLSearchParams(useLocation().search).get("fileType");
  const fileId = new URLSearchParams(useLocation().search).get("id");

  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFile = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/content/${fileType}/${fileId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "OK") {
        setFile(data.data);
      } else {
        throw new Error("Error fetching file");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  // increment view
  useEffect(() => {
    if (fileType === "ppt") {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/content/pdfview/${fileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    } else {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/content/caview/${fileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
    }

    fetchFile();
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
              <h1 className="fileview-title">
                CA {file.caNumber} {file.courseCode}
              </h1>
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
          {/* google ads */}
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386642099973212"
            crossOrigin="anonymous"
          ></script>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-8386642099973212"
            data-ad-slot="3931864628"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

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
      {/* google ads */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8386642099973212"
        crossOrigin="anonymous"
      ></script>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-8386642099973212"
        data-ad-slot="3931864628"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

      <FooterSmall />
    </>
  );
}

export default FileView;
