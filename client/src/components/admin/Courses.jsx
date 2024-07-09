import React, { useState, useEffect } from "react";
import "./css/courses.css";
import Cookies from "js-cookie";

const Courses = ({ allCourses, snackbar }) => {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  //   loaders
  const [addingCourse, setAddingCourse] = useState(false);

  useEffect(() => {
    setCourses(allCourses);
  }, [allCourses]);

  const handleAddCourse = async (e) => {
    e.preventDefault();

    if (!newCourseName || !newCourseCode) {
      snackbar("Please enter course name and code.", "error");
      return;
    }

    try {
      setAddingCourse(true);
      const response = await fetch(`/courses/add-course`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
        body: JSON.stringify({
          courseTitle: newCourseName,
          courseCode: newCourseCode,
        }),
      });

      const newCourse = await response.json();
      if (newCourse.status === "OK") {
        setCourses([...courses, newCourse]);
        setNewCourseName("");
        setNewCourseCode("");
        snackbar("Course added successfully.", "success");
      } else {
        throw new Error("Error adding course");
      }
    } catch (err) {
      snackbar("Failed to add course.", "error");
    } finally {
      setAddingCourse(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    const response = await fetch(
      `/courses/delete-course/${courseId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
      }
    );

    const res = await response.json();

    if (res.status === "OK") {
      setCourses(courses.filter((course) => course._id !== courseId));
      snackbar("Course deleted successfully.", "success");
    } else {
      snackbar("Failed to delete course.", "error");
    }
  };

  const handleEditCourse = (courseId) => {
    setEditMode(editMode === courseId ? null : courseId);
  };

  const handleUpdateCourse = async (courseId) => {
    const updatedCourse = {
      ...courses.find((course) => course._id === courseId),
    };

    updatedCourse.courseTitle = document.getElementById(
      `courseName-${courseId}`
    ).value;
    updatedCourse.courseCode = document.getElementById(
      `courseCode-${courseId}`
    ).value;

    const response = await fetch(
      `/courses/update-course/${courseId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + Cookies.get("token"),
        },
        body: JSON.stringify({
          courseCode: updatedCourse.courseCode,
          courseTitle: updatedCourse.courseTitle,
        }),
      }
    );

    const res = await response.json();

    if (res.status === "OK") {
      setCourses(
        courses.map((course) =>
          course._id === courseId ? updatedCourse : course
        )
      );
      setEditMode(null);
      snackbar("Course updated successfully.", "success");
    } else {
      snackbar("Failed to update course.", "error");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseTitle.toLowerCase().includes(searchTerm) ||
      course.courseCode.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="courses-container">
      <h2>Manage Courses</h2>
      <div className="add-course-form">
        <form onSubmit={handleAddCourse}>
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            required
          />
          <label htmlFor="courseCode">Course Code:</label>
          <input
            type="text"
            id="courseCode"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            required
          />
          <button type="submit" disabled={addingCourse}>
            {addingCourse ? "Adding..." : "Add Course"}
          </button>
        </form>
      </div>
      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search by course name or code"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>Course Code</th>
            <th>Course Title</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map((course) => (
            <tr key={course._id}>
              {editMode === course._id ? (
                <>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      id={`courseCode-${course._id}`}
                      defaultValue={course.courseCode}
                      required
                    />
                  </td>
                  <td>
                    <input
                      className="edit-input"
                      type="text"
                      id={`courseName-${course._id}`}
                      defaultValue={course.courseTitle}
                      required
                    />
                  </td>
                  <td>
                    <button onClick={() => handleUpdateCourse(course._id)}>
                      Update
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{course.courseCode}</td>
                  <td>{course.courseTitle}</td>
                  <td className="actions-btns">
                    <button onClick={() => handleDeleteCourse(course._id)}>
                      Delete
                    </button>
                    <button onClick={() => handleEditCourse(course._id)}>
                      Edit
                    </button>
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

export default Courses;
