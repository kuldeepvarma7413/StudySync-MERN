import React, { useState, useEffect } from "react";
import "./css/usertable.css";

const UsersTable = ({ allUsers }) => {
  const [userList, setUserList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleEdit = (index) => {
    alert("Feature not implemented yet");
  };

  const handleDelete = (index) => {
    alert("Feature not implemented yet");
    // const updatedUsers = userList.filter((user, i) => i !== index);
    // setUserList(updatedUsers);
  };

  useEffect(() => {
    setUserList(allUsers);
  }, [allUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredUsers = userList.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="user-table-container">
      <div className="search-and-filter">
        <input
          type="text"
          placeholder="Search by username or email"
          className="search-bar"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th className="photo-col">Photo</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Account Type</th>
            <th>Verified</th>
            <th>Q&A</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length !== 0 ? (
            filteredUsers.map((user, index) => (
              <tr key={index} className={user.isDeleted ? "deleted-row" : ""}>
                <td>
                  <img
                    src={
                      user.photo
                        ? user.photo
                        : "https://res.cloudinary.com/dkjgwvtdq/image/upload/f_auto,q_auto/v1/profilephotos/pjo2blwkflwzxg8mhpoa"
                    }
                    alt="user"
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.accountType}</td>
                <td>{user.verified ? "Yes" : "No"}</td>
                <td>{`${user.questions.length} Q / ${user.answers.length} A`}</td>
                <td>
                  <button
                    disabled={user.isDeleted}
                    onClick={() => handleDelete(index)}
                  >
                    Delete
                  </button>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
