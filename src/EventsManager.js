"use client"

import { useState, useEffect } from "react"
import "./EventsManager.css"


const EventsManager = () => {
  // State for events
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])

  // State for form inputs
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  // State for filtering and sorting
  const [activeFilter, setActiveFilter] = useState("active") // 'active' or 'past'
  const [sortOrder, setSortOrder] = useState("newest") // 'newest' or 'oldest'

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editImageFile, setEditImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState("")

  // Apply filters and sorting whenever events, activeFilter, or sortOrder changes
  useEffect(() => {
    let result = [...events]

    // Filter by active/past
    const currentDate = new Date()
    if (activeFilter === "active") {
      result = result.filter((event) => {
        const eventDateTime = new Date(`${event.date}T${event.time}`)
        return eventDateTime >= currentDate
      })
    } else {
      result = result.filter((event) => {
        const eventDateTime = new Date(`${event.date}T${event.time}`)
        return eventDateTime < currentDate
      })
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    setFilteredEvents(result)
  }, [events, activeFilter, sortOrder])

  // Handle image file selection for new event
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle image file selection for edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add new event
  const handleAddEvent = (e) => {
    e.preventDefault()

    if (!title || !description || !eventDate || !eventTime || !imagePreview) {
      alert("Please fill in all fields")
      return
    }

    const newEvent = {
      id: Date.now(),
      title,
      description,
      date: eventDate,
      time: eventTime,
      image: imagePreview,
      createdAt: new Date().toISOString(),
    }

    setEvents([...events, newEvent])

    // Reset form
    setTitle("")
    setDescription("")
    setEventDate("")
    setEventTime("")
    setImageFile(null)
    setImagePreview("")
  }

  // Open edit modal
  const handleEventClick = (event) => {
    setSelectedEvent(event)
    setEditTitle(event.title)
    setEditDescription(event.description)
    setEditDate(event.date)
    setEditTime(event.time)
    setEditImagePreview(event.image)
    setIsModalOpen(true)
  }

  // Update event
  const handleUpdateEvent = () => {
    if (!editTitle || !editDescription || !editDate || !editTime) {
      alert("Please fill in all fields")
      return
    }

    const updatedEvents = events.map((event) => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          title: editTitle,
          description: editDescription,
          date: editDate,
          time: editTime,
          image: editImagePreview || event.image,
        }
      }
      return event
    })

    setEvents(updatedEvents)
    setIsModalOpen(false)
  }

  // Delete event
  const handleDeleteEvent = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const updatedEvents = events.filter((event) => event.id !== selectedEvent.id)
      setEvents(updatedEvents)
      setIsModalOpen(false)
    }
  }

  // Check if an event is in the past
  const isEventPast = (date, time) => {
    const eventDateTime = new Date(`${date}T${time}`)
    const currentDate = new Date()
    return eventDateTime < currentDate
  }

  return (
    <div className="events-manager">
      <div className="controls-container">
        <div className="filter-buttons">
          <button className={activeFilter === "active" ? "active" : ""} onClick={() => setActiveFilter("active")}>
            Active Events
          </button>
          <button className={activeFilter === "past" ? "active" : ""} onClick={() => setActiveFilter("past")}>
            Past Events
          </button>
        </div>

        <div className="sort-dropdown">
          <label htmlFor="sort-select">Sort by: </label>
          <select id="sort-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <form className="add-event-form" onSubmit={handleAddEvent}>
        <div className="form-group">
          <label htmlFor="image-upload">Image</label>
          <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="event-title">Title</label>
          <input
            type="text"
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-description">Description</label>
          <input
            type="text"
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="event-date">Date</label>
          <input type="date" id="event-date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="event-time">Time</label>
          <input type="time" id="event-time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} />
        </div>

        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      <div className="events-table-container">
        <table className="events-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={isEventPast(event.date, event.time) ? "past-event" : ""}
                >
                  <td>
                    <div className="table-image">
                      <img src={event.image || "/placeholder.svg"} alt={event.title} />
                    </div>
                  </td>
                  <td>{event.title}</td>
                  <td>{event.description}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-events">
                  No {activeFilter} events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Event</h2>

            <div className="edit-form">
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
                {editImagePreview && (
                  <div className="image-preview">
                    <img src={editImagePreview || "/placeholder.svg"} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
              </div>
            </div>

            <div className="modal-buttons">
              <button onClick={handleUpdateEvent} className="update-button">
                Update
              </button>
              <button onClick={handleDeleteEvent} className="delete-button">
                Delete
              </button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsManager
