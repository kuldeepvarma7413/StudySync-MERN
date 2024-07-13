import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "./css/files.css";

const Files = ({ cafiles, pdffiles, snackbar }) => {
  const [fileType, setFileType] = useState("ppt");
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (fileType === "ppt") {
      setFiles(pdffiles);
    } else {
      setFiles(cafiles);
    }
  }, [fileType, pdffiles, cafiles]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const res = await fetch(`/content/delete-${fileType}/${fileId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = await res.json();
      if (data.status === "OK") {
        snackbar("File deleted successfully", "success");
      } else {
        throw new Error("Error deleting file");
      }
    } catch (error) {
      console.error("Error deleting file", error);
      snackbar("Error deleting file", "error");
    } finally {
      setFiles(files.filter((file) => file._id !== fileId));
    }
  };

  const [editMode, setEditMode] = useState(null);

  const handleEditFile = (fileId) => {
    setEditMode(editMode === fileId ? null : fileId);
  };

  const handleUpdateFile = async (fileId) => {
    let updatedFile = files.find((file) => file._id === fileId);

    if (fileType === "ca") {
      snackbar("CA files cannot be edited", "error");
      return;
    }
    updatedFile = {
      ...updatedFile,
      title: document.getElementById(`filename-${fileId}`).value,
      unit: document.getElementById(`fileunit-${fileId}`).value,
    };

    console.log(updatedFile);

    try {
      const response = await fetch(`/content/edit-${fileType}file/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
          body: JSON.stringify({
            title: updatedFile.title,
            unit: updatedFile.unit,
          }),
        }
      );
      const data = await response.json();
      if (data.status === "OK") {
        setFiles(
          files.map((file) => (file._id === fileId ? updatedFile : file))
        );
        setEditMode(null);
        snackbar("File updated successfully", "success");
      } else {
        throw new Error("Error updating file");
      }
    } catch (error) {
      console.error("Error updating file", error);
      snackbar("Error updating file", "error");
    }
  };

  return (
    <div className="files-container">
      <div className="files-header">
        <h2>Manage Files</h2>
        <div className="search-and-filter">
          <select
            value={fileType}
            className="file-type-dropdown"
            onChange={(e) => setFileType(e.target.value)}
          >
            <option value="ppt">PDF</option>
            <option value="ca">CA</option>
          </select>
          <input
            type="text"
            placeholder="Search by filename"
            className="file-search-bar"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Upload Date</th>
            <th>Uploaded By</th>
            <th>PDF Link</th>
            <th>Unit</th>
            <th>Views</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0
            ? "No files Found"
            : files
                .filter((file) => {
                  if (fileType === "ca") {
                    return (
                      file.courseCode &&
                      (("CA " + file.caNumber || "") + " " + file.courseCode)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    );
                  } else {
                    const filenameMatch =
                      file.title &&
                      file.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());
                    return filenameMatch;
                  }
                })
                .map((file) => (
                  <tr key={file._id} data-id={file._id}>
                    {editMode === file._id && fileType === "ppt" ? (
                      // Edit mode: render input fields
                      <>
                        <td>
                          <input
                            type="text"
                            defaultValue={file.title || ""}
                            id={`filename-${file._id}`}
                            required
                          />
                        </td>
                        <td>
                          {file.createdAt
                            ? new Date(file.createdAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td>{file.uploadedBy || ""}</td>
                        <td>
                          <Link
                            to={`/resources/view?id=${file._id}&fileType=${fileType}`}
                          >
                            View PDF
                          </Link>
                        </td>
                        <td>
                          <input
                            type="text"
                            defaultValue={file.unit || ""}
                            id={`fileunit-${file._id}`}
                            required
                          />
                        </td>
                        <td>{file.views}</td>
                        {fileType === "ppt" && (
                          <td>
                            <button onClick={() => handleUpdateFile(file._id)}>
                              Update
                            </button>
                            <button onClick={() => setEditMode(null)}>
                              Cancel
                            </button>
                          </td>
                        )}
                      </>
                    ) : (
                      // Normal mode: display file information
                      <>
                        <td>
                          {fileType === "ppt"
                            ? file.title
                            : `CA ${file.caNumber} ${file.courseCode || ""}`}
                        </td>
                        <td>
                          {file.createdAt
                            ? new Date(file.createdAt).toLocaleDateString()
                            : ""}
                        </td>
                        <td>{file.uploadedBy || ""}</td>
                        <td>
                          <Link
                            to={`/resources/view?id=${file._id}&fileType=${fileType}`}
                          >
                            View PDF
                          </Link>
                        </td>
                        <td>{fileType === "ppt" ? file.unit || "" : "-"}</td>
                        <td>{file.views}</td>
                        <td>
                          <button onClick={() => handleDeleteFile(file._id)}>
                            Delete
                          </button>
                          {fileType === "ppt" && (
                            <button onClick={() => handleEditFile(file._id)}>
                              Edit
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
        </tbody>
      </table>
    </div>
  );
};

export default Files;
