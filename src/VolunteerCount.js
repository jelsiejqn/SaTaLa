"use client"

import { useState, useEffect } from "react"
import "./VolunteerCount.css"

import sample1 from './assets/sample1.png'
import sample2 from './assets/sample2.png'
import sample3 from './assets/sample3.png'
import sample4 from './assets/sample4.png'
import sample5 from './assets/sample5.png'
import sample7 from './assets/sample7.png'
import sample8 from './assets/sample8.png'
import sample6 from './assets/sample6.png'

const VolunteerCount = () => {
  // Sample data - in a real app, this would come from your database
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Cleanup",
      date: "2025-06-15",
      time: "09:00 AM",
      image: sample1,
      volunteerCount: 24,
      volunteers: [
        { name: "John Doe", email: "john@example.com", isGuest: false, registeredAt: "2025-05-20T14:30:00" },
        { name: "Jane Smith", email: "jane@example.com", isGuest: true, registeredAt: "2025-05-21T10:15:00" },
        { name: "Robert Johnson", email: "robert@example.com", isGuest: false, registeredAt: "2025-05-22T09:45:00" },
        // More volunteers...
      ],
    },
    {
      id: 2,
      title: "Fundraising Gala",
      date: "2025-07-20",
      time: "06:30 PM",
      image: sample2,
      volunteerCount: 12,
      volunteers: [
        { name: "Emily Wilson", email: "emily@example.com", isGuest: false, registeredAt: "2025-06-10T11:20:00" },
        { name: "Michael Brown", email: "michael@example.com", isGuest: true, registeredAt: "2025-06-12T15:40:00" },
        // More volunteers...
      ],
    },
    {
      id: 3,
      title: "Youth Workshop",
      date: "2025-06-28",
      time: "10:00 AM",
      image: sample3,
      volunteerCount: 8,
      volunteers: [
        { name: "Sarah Johnson", email: "sarah@example.com", isGuest: false, registeredAt: "2025-06-01T09:30:00" },
        { name: "David Lee", email: "david@example.com", isGuest: false, registeredAt: "2025-06-02T14:15:00" },
        // More volunteers...
      ],
    },
    {
      id: 4,
      title: "Charity Run",
      date: "2025-08-05",
      time: "07:00 AM",
      image: sample4,
      volunteerCount: 35,
      volunteers: [
        { name: "Lisa Chen", email: "lisa@example.com", isGuest: true, registeredAt: "2025-07-10T08:45:00" },
        { name: "Kevin Wang", email: "kevin@example.com", isGuest: false, registeredAt: "2025-07-11T16:20:00" },
        // More volunteers...
      ],
    },
    {
      id: 5,
      title: "Art Exhibition",
      date: "2025-07-10",
      time: "11:00 AM",
      image: sample5,
      volunteerCount: 15,
      volunteers: [
        { name: "Amanda Taylor", email: "amanda@example.com", isGuest: false, registeredAt: "2025-06-15T13:10:00" },
        { name: "Brian Miller", email: "brian@example.com", isGuest: true, registeredAt: "2025-06-16T10:30:00" },
        // More volunteers...
      ],
    },
    {
      id: 6,
      title: "Food Drive",
      date: "2025-06-22",
      time: "09:00 AM",
      image: sample6,
      volunteerCount: 18,
      volunteers: [
        { name: "Nicole Adams", email: "nicole@example.com", isGuest: false, registeredAt: "2025-05-30T11:45:00" },
        { name: "Thomas Wilson", email: "thomas@example.com", isGuest: true, registeredAt: "2025-06-01T09:20:00" },
        // More volunteers...
      ],
    },
  ])

  const [sortOrder, setSortOrder] = useState("newest")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortedEvents, setSortedEvents] = useState([])

  // Sort events whenever the sort order changes
  useEffect(() => {
    const sorted = [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    setSortedEvents(sorted)
  }, [events, sortOrder])

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
  }

  // Open modal with event details
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setIsModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format registration date and time
  const formatRegistrationDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateTimeString).toLocaleString(undefined, options)
  }

  return (
    <div className="volunteer-count-container">
      <div className="volunteer-header">
        <h2>Event Volunteer Count</h2>
        <div className="sort-control">
          <label htmlFor="sort-select">Sort by: </label>
          <select id="sort-select" value={sortOrder} onChange={handleSortChange}>
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="event-cards-container">
        {sortedEvents.map((event) => (
          <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
            <div className="event-image">
              <img src={event.image || "/placeholder.svg"} alt={event.title} />
            </div>
            <div className="event-details">
              <h3>{event.title}</h3>
              <p className="event-date">
                {formatDate(event.date)} at {event.time}
              </p>
              <div className="volunteer-number">
                <span>{event.volunteerCount}</span>
                <p>Volunteers</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>

            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <p className="modal-date">
                {formatDate(selectedEvent.date)} at {selectedEvent.time}
              </p>
              <div className="volunteer-count-badge">
                <span>{selectedEvent.volunteerCount}</span> Volunteers
              </div>
            </div>

            <div className="volunteer-list-container">
              <h3>Volunteer List</h3>

              <div className="volunteer-table-container">
                <table className="volunteer-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Registration Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEvent.volunteers.map((volunteer, index) => (
                      <tr key={index}>
                        <td>{volunteer.name}</td>
                        <td>{volunteer.email}</td>
                        <td>
                          <span className={volunteer.isGuest ? "guest-badge" : "member-badge"}>
                            {volunteer.isGuest ? "Guest" : "Member"}
                          </span>
                        </td>
                        <td>{formatRegistrationDateTime(volunteer.registeredAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                {/* <button className="export-button">Export to CSV</button> */}
                <button className="close-modal-button" onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VolunteerCount
