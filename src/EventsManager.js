import React, { useState } from "react";
import "./EventsManager.css"; // replace with your actual CSS file name

const EventsManager = () => {
  const [sortBy, setSortBy] = useState("recent");

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    // Sorting logic goes here
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Form handling logic goes here
  };

  return (
    <div className="content">
      {/* Events Manager Section */}
      <div className="section" id="events-manager">
        <h2>Events Manager</h2>
        {/* Note: Add any logic for 12-hour cancel window in backend */}

        <table className="sortby-container">
          <tbody>
            <tr>
              <td>
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="recent">Sort by</option>
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <br />

        {/* Upload Form */}
        <center>
          <form onSubmit={handleFormSubmit} id="eventsForm">
            <table className="booking-container">
              <tbody>
                <tr>
                  <td className="td-date">
                    <input
                      type="file"
                      name="fileUpload"
                      id="fileUpload"
                      accept="image/*"
                      required
                    />
                  </td>

                  <td className="td-details">
                    <textarea
                      name="event-name"
                      placeholder="Event Name"
                      required
                    ></textarea>
                  </td>

                  <td className="td-booker">
                    <input
                      type="date"
                      name="date"
                      placeholder="MM/DD/YYYY"
                      required
                    />
                  </td>

                  <td className="td-review">
                    <textarea
                      name="desc"
                      className="desc"
                      placeholder="Description"
                      required
                    ></textarea>
                  </td>

                  <td>
                    <button type="submit" name="add-event" className="btn-add">
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          <br />
        </center>
      </div>
    </div>
  );
};

export default EventsManager;
