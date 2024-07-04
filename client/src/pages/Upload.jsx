import React, { useCallback, useState, useRef, useEffect } from "react";
import "./css/upload.css";
import { TiCloudStorage } from "react-icons/ti";
import FooterSmall from "../components/common/FooterSmall";
import { useDropzone } from "react-dropzone";
import { RxCross2 } from "react-icons/rx";
import { NavLink } from "react-router-dom";
import Select from "react-select";
import Cookies from "js-cookie";
import SnackbarCustom from "../components/common/SnackbarCustom";

function Upload() {
  document.title = "Upload | StudySync";
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
  const [filetype, setFiletype] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [canumber, setCaNumber] = useState("");
  const [cadate, setCaDate] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // courses
  const [courses, setcourses] = useState([]);

  // validate files
  const validateFiles = (files) => {
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      alert("Only image files (JPEG, PNG, GIF) and PDFs are allowed.");
      return false;
    }
    return true;
  };

  function fillField() {
    setMessage("Please fill all fields");
    setSnackBarType("error");
    snackbarRef.current.show();
  }

  // submition
  const handleSubmit = (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage("No file selected");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }
    if (!validateFiles(files)) {
      setMessage("Select only image files (JPEG, PNG, GIF) and PDFs.");
      setSnackBarType("error");
      snackbarRef.current.show();
      return;
    }
    if (title === "" || course.toString() === "") {
      fillField();
      return;
    }
    if (filetype && unit === "") {
      fillField();
      return;
    } else if ( !filetype && (canumber === "" || cadate === "")) {
      fillField();
      return;
    }
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("title", title);
    formData.append("course", course);
    if (filetype) {
      formData.append("unit", unit);
      formData.append("description", description);
    } else {
      formData.append("canumber", canumber);
      // date should not be in future
      const today = new Date();
      const date = new Date(cadate);
      if (date > today) {
        setMessage("CA Date should not be in future");
        setSnackBarType("error");
        snackbarRef.current.show();
        return;
      }
      formData.append("cadate", cadate);
    }
    // if filetype is true, then it is a course file
    formData.append("filetype", filetype === true ? "course" : "ca");

    setIsUploading(true);
    fetch(
      filetype === true
        ? `/content/add-pdffile`
        : `/content/add-cafile`,
      {
        method: "POST",
        body: formData,
        headers: {
          authorization:
            "Bearer " + Cookies.get("token").replace("Bearer ", ""),
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
          setUnit("");
          setDescription("");
          setCaNumber("");
          setCaDate("");
        } else {
          setMessage("Failed to upload file");
          setSnackBarType("error");
          snackbarRef.current.show();
        }
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // fetch courses
  useEffect(() => {
    fetch(`/courses`, {
      headers: {
        authorization: "Bearer " + Cookies.get("token").replace("Bearer ", ""),
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
                  value={courses.find(
                    (course) => course._id === course
                  )}
                  options={courses}
                  getOptionLabel={(option) =>
                    option.courseCode + ": " + option.courseTitle
                  }
                  getOptionValue={(option) => option._id}
                  onChange={(e) => setCourse(e._id.toString())}
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
                {isUploading ? "Uploading..." : "Upload"}
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
