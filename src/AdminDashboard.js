import React, { useState } from "react";
import "./AdminDashboard.css";
import bgImage from "./assets/home_bg.png"; // adjust path as needed
import HomeStats from "./HomeStats";

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("orgProgress");

  const renderContent = () => {
    switch (activeView) {
      case "orgProgress":
        return <div> <br /> <br /> <br /> <br /> <HomeStats /> </div>;
      case "eventsManager":
        return <div>{/* Events Manager content */}</div>;
      case "volunteers":
        return <div>{/* Volunteers content */}</div>;
      default:
        return null;
    }
  };

  return (
    <div
      className="dashboard-bg-wrapper"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "150vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: "80px",
      }}
    >
        
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-title">Admin Dashboard</h2>
          <ul className="menu-list">
            <li
              className={`menu-item ${
                activeView === "orgProgress" ? "active" : ""
              }`}
              onClick={() => setActiveView("orgProgress")}
            >
              Progress
            </li>
            <li
              className={`menu-item ${
                activeView === "eventsManager" ? "active" : ""
              }`}
              onClick={() => setActiveView("eventsManager")}
            >
              Events Manager
            </li>
            <li
              className={`menu-item ${
                activeView === "volunteers" ? "active" : ""
              }`}
              onClick={() => setActiveView("volunteers")}
            >
              Volunteers
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
