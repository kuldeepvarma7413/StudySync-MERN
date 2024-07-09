import React from "react";
import "./css/reportstable.css";

const ReportsTable = ({ allReports }) => {
  if (!allReports) {
    return <p>Loading reports...</p>;
  }

  return (
    <div className="reports-table-container">
      <table>
        <thead>
          <tr>
            <th>Bug/Feature</th>
            <th>Description</th>
            <th>Subject</th>
            <th>User</th>
            <th>User Image</th>
          </tr>
        </thead>
        <tbody>
          {allReports.map((report, index) => (
            <tr key={index}>
              <td>{report.bugOrFeature}</td>
              <td>{report.description}</td>
              <td>{report.subject}</td>
              <td>{report.user?.username || "—"}</td>
              <td className="photo-col">
                <img
                  src={
                    report.user?.photo ||
                    "https://res.cloudinary.com/dkjgwvtdq/image/upload/f_auto,q_auto/v1/profilephotos/pjo2blwkflwzxg8mhpoa"
                  } // Default image
                  alt={`User image for ${
                    report.user?.name || report.user?.username || "Unknown"
                  }`}
                  width="40"
                  height="40"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
