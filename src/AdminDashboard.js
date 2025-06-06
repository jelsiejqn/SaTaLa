import React, { useState } from "react";
import "./AdminDashboard.css";
import bgImage from "./assets/home_bg.png"; // adjust path as needed
import HomeStats from "./HomeStats";
import EventsManager from "./EventsManager";
import VolunteerCount from "./VolunteerCount";
import FAQManager from "./FAQManager"; // Import the new FAQ Manager component

const AdminDashboard = () => {
  const [activeView, setActiveView] = useState("eventsManager");

  const renderContent = () => {
    switch (activeView) {
      // case "orgProgress":
      //   return <div> <br /> <br /> <br /> <br /> <HomeStats /> </div>;
      case "eventsManager":
        return <div> <EventsManager /> </div>;
      case "volunteers":
        return <div> <br /><VolunteerCount /></div>;
      case "faqManager":
        return <div> <FAQManager /> </div>;
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
            {/* <li
              className={`menu-item ${
                activeView === "orgProgress" ? "active" : ""
              }`}
              onClick={() => setActiveView("orgProgress")}
            >
              Progress
            </li> */}
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
            <li
              className={`menu-item ${
                activeView === "faqManager" ? "active" : ""
              }`}
              onClick={() => setActiveView("faqManager")}
            >
              FAQ Manager
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