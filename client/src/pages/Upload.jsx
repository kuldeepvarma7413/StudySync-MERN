import React, { useCallback, useState, useRef, useEffect } from "react";
import "./css/upload.css";
import { TiCloudStorage } from "react-icons/ti";
import FooterSmall from "../components/common/FooterSmall";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import SnackbarCustom from "../components/common/SnackbarCustom";

function Upload() {
  // snackbar
  const [SnackbarType, setSnackBarType] = useState("false");
  const [message, setMessage] = useState("");
  const snackbarRef = useRef(null);

  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...acceptedFiles];
      return newFiles.slice(0, 7); // Limit to 7 files
    });
  }, []);

  const handleDelete = (fileToDelete) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== fileToDelete));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // right side
  const [filetype, setFiletype] = useState(true);
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [canumber, setCaNumber] = useState("");
  const [cadate, setCaDate] = useState("");

  // courses
  const [courses, setcourses] = useState([]);

  // submition
  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("No file selected");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }
    if (title === "" || courseCode === "") {
      if (filetype && (unit === "" || description === "")) {
        setMessage("Please fill all fields");
        setSnackBarType("error");
        snackbarRef.current.show();
      } else if (!filetype && (canumber === "" || cadate === "")) {
        setMessage("Please fill all fields");
        setSnackBarType("error");
        snackbarRef.current.show();
      }
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("title", title);
    formData.append("courseCode", courseCode);
    if (filetype) {
      formData.append("unit", unit);
      formData.append("description", description);
    } else {
      formData.append("canumber", canumber);
      formData.append("cadate", cadate);
    }
    // if filetype is true, then it is a course file
    formData.append("filetype", filetype === true ? "course" : "ca");

    fetch(
      filetype === true
        ? "/api/content/add-pdffile"
        : "/api/content/add-cafile",
      {
        method: "POST",
        body: formData,
        headers: {
          authorization:
            "Bearer " + localStorage.getItem("token").replace("Bearer ", ""),
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "OK") {
          setMessage("File uploaded successfully");
          setSnackBarType("success");
          snackbarRef.current.show();
          setFiles([]);
          setTitle("");
          setCourseCode("");
          setUnit("");
          setDescription("");
          setCaNumber("");
          setCaDate("");
        } else {
          setMessage("Failed to upload file");
          setSnackBarType("error");
          snackbarRef.current.show();
        }
      });
  };

  // fetch courses
  useEffect(() => {
    fetch("/api/courses", {
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

  return (
    <>
      <div className="upload-container">
        <form>
          <div className="cont-1 container">
            <div className="top">
              <TiCloudStorage className="icon" />
              <div>
                <h1>Upload Files</h1>
                <p>Select and upload the files of your choice</p>
              </div>
            </div>
            <div
              {...getRootProps()}
              className="drag-drop"
              onClick={(e) => e.preventDefault()}
            >
              {files.length === 7 && (
                <p style={{ color: "red", fontSize: "14px" }}>
                  File limit reached (7 files).
                </p>
              )}
              <p>Drag and drop files here</p>
              <button onClick={handleBrowseClick} className="browse-button">
                Browse Files
              </button>
              <input
                {...getInputProps()}
                ref={fileInputRef}
                accept="image/*, application/pdf"
                style={{ display: "none" }}
              />
              <ul>
                {files.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <RxCross2
                      onClick={() => handleDelete(file)}
                      className="delete-icon"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="cont-2 container">
            <div className="radiogroup">
              <p>
                <input
                  type="radio"
                  name="filetype"
                  id="pdffile"
                  checked={filetype === true}
                  onChange={() => setFiletype(!filetype)}
                />
                <label htmlFor="pdffile" className={filetype ? "selected" : ""}>
                  Course File
                </label>
              </p>
              <p>
                <input
                  type="radio"
                  name="filetype"
                  id="cafile"
                  checked={filetype === false}
                  onChange={() => {
                    setFiletype(!filetype);
                  }}
                />
                <label htmlFor="cafile" className={!filetype ? "selected" : ""}>
                  Class Assesment
                </label>
              </p>
            </div>
            <div className="inputs">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onInput={(e) => setTitle(e.target.value)}
              />
              <span>
                <Select
                  value={courseCode}
                  options={courses}
                  getOptionLabel={(option) =>
                    option.courseCode + ": " + option.courseTitle
                  }
                  getOptionValue={(option) => option.courseCode}
                  onChange={(e) => setCourseCode(e.value)}
                />
                <span className="course-unavailable">
                  *If course is not in list, please report us.{" "}
                  <NavLink to={"/report"}>Click here</NavLink>
                </span>
              </span>
              {filetype ? (
                <>
                  <input
                    type="number"
                    placeholder="Unit"
                    value={unit}
                    onInput={(e) => setUnit(e.target.value)}
                  />
                  <textarea
                    type="text"
                    placeholder="Description"
                    value={description}
                    onInput={(e) => setDescription(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <input
                    type="number"
                    placeholder="Ca Number"
                    value={canumber}
                    onInput={(e) => setCaNumber(e.target.value)}
                  />
                  <input
                    type="date"
                    placeholder="Ca Date"
                    value={cadate}
                    onInput={(e) => setCaDate(e.target.value)}
                  />
                </>
              )}

              <button className="btn submitbtn" onClick={handleSubmit}>
                UPLOAD
              </button>
            </div>
          </div>
        </form>
      </div>
      <SnackbarCustom ref={snackbarRef} message={message} type={SnackbarType} />
      <FooterSmall />
    </>
  );
}

export default Upload;
