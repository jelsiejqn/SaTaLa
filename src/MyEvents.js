"use client"

import { useState, useEffect } from "react"
import "./MyEvents.css"

import sample1 from './assets/sample1.png'
import sample2 from './assets/sample2.png'
import sample3 from './assets/sample3.png'
import sample4 from './assets/sample4.png'
import sample5 from './assets/sample5.png'
import sample7 from './assets/sample7.png'
import sample8 from './assets/sample8.png'
import sample6 from './assets/sample6.png'

const MyEvents = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Community Garden Cleanup",
      description:
        "Help us clean up the community garden and prepare it for spring planting. Tools and refreshments will be provided.",
      date: "2025-05-25",
      time: "09:00 AM - 12:00 PM",
      image: sample1,
      status: "current",
    },
    {
      id: 2,
      title: "Food Bank Volunteer",
      description:
        "Sort and package food donations for distribution to families in need. No experience necessary, training provided on site.",
      date: "2025-05-30",
      time: "01:00 PM - 04:00 PM",
      image: sample2,
      status: "current",
    },
    {
      id: 3,
      title: "Beach Cleanup",
      description:
        "Join us for our monthly beach cleanup. Gloves, bags, and tools will be provided. Wear comfortable clothes and bring sunscreen!",
      date: "2025-04-15",
      time: "08:00 AM - 11:00 AM",
      image: sample3,
      status: "current",
    },
    {
      id: 4,
      title: "Senior Center Visit",
      description:
        "Spend time with seniors at the local center. Activities include board games, crafts, and conversation.",
      date: "2025-03-10",
      time: "02:00 PM - 04:00 PM",
      image: sample4,
      status: "cancelled",
    },
  ])

  const [activeTab, setActiveTab] = useState("current")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // Hide vertical scroll ONLY when on this page
  useEffect(() => {
    document.body.style.overflowY = "hidden"
    return () => {
      document.body.style.overflowY = "auto"
    }
  }, [])

  // Determine and update event status (past/current)
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const updatedEvents = events.map((event) => {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0)

      if (event.status !== "cancelled") {
        if (eventDate < today) {
          return { ...event, status: "past" }
        } else {
          return { ...event, status: "current" }
        }
      }
      return event
    })

    setEvents(updatedEvents)
  }, [])

  const filteredEvents = events.filter((event) => event.status === activeTab)

  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setShowModal(true)
  }

  const handleCancelEvent = () => {
    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return { ...event, status: "cancelled" }
      }
      return event
    })
    setEvents(updatedEvents)
    setShowModal(false)
  }

  return (
    <div className="my-events-container">
      <div className="sidebar">
        <h2>My Events</h2>
        <ul>
          <li className={activeTab === "current" ? "active" : ""} onClick={() => setActiveTab("current")}>
            Current Events
          </li>
          <li className={activeTab === "past" ? "active" : ""} onClick={() => setActiveTab("past")}>
            Past Events
          </li>
          <li className={activeTab === "cancelled" ? "active" : ""} onClick={() => setActiveTab("cancelled")}>
            Cancelled Events
          </li>
        </ul>
      </div>

      <div className="content">
        <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Events</h1>

        {filteredEvents.length === 0 ? (
          <p className="no-events">No {activeTab} events found.</p>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card" onClick={() => handleEventClick(event)}>
                <div className="event-image">
                  <img src={event.image || "/placeholder.svg"} alt={event.title} />
                </div>
                <div className="event-info">
                  <h3>{event.title}</h3>
                  <p>
                    {event.date} • {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{selectedEvent.title}</h2>
              <button className="close-button" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-image">
              <img src={selectedEvent.image || "/placeholder.svg"} alt={selectedEvent.title} />
            </div>
            <div className="modal-content">
              <p className="modal-description">{selectedEvent.description}</p>
              <p className="modal-date-time">
                <strong>Date:</strong> {selectedEvent.date}
                <br />
                <strong>Time:</strong> {selectedEvent.time}
              </p>
              {selectedEvent.status === "current" && (
                <button className="cancel-button" onClick={handleCancelEvent}>
                  Cancel My Participation
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyEvents
