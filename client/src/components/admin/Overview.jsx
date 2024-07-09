import React, { useState, useEffect } from "react";
import "./css/overview.css";

const Overview = ({ data }) => {
  return (
    <div className="overview-container">
      <div className="col">
        <OverviewCard
          metric="Total Users"
          value={data.users}
          color="primary"
          icon="fas fa-users"
        />
        <OverviewCard
          metric="CA Files"
          value={data.cafiles}
          color="success"
          icon="fas fa-file-alt"
        />
        <OverviewCard
          metric="Course Files (PDF)"
          value={data.pdffiles}
          color="orange"
          icon="fas fa-book"
        />
        <OverviewCard
          metric="Reports"
          value={data.reports}
          color="danger"
          icon="fas fa-chart-line"
        />
        <OverviewCard
          metric="Questions"
          value={data.questions}
          color="purple"
          icon="fas fa-question"
        />
        <OverviewCard
          metric="Answers"
          value={data.answers}
          color="teal"
          icon="fas fa-check"
        />
      </div>
    </div>
  );
};

const OverviewCard = ({ metric, value, color, icon }) => {
  return (
    <div className={`overview-card card bg-${color} text-white`}>
      <i className={icon}></i>
      <h1 className="card-title">{value}</h1>
      <p className="card-text">{metric}</p>
    </div>
  );
};

export default Overview;
