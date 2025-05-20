"use client"

import { useState, useEffect } from "react"
import "./Events.css"

import sample1 from './assets/sample1.png'
import sample2 from './assets/sample2.png'
import sample3 from './assets/sample3.png'
import sample4 from './assets/sample4.png'
import sample5 from './assets/sample5.png'
import sample7 from './assets/sample7.png'
import sample8 from './assets/sample8.png'
import sample6 from './assets/sample6.png'

// Sample event data - replace with your actual data
const eventsData = [
  {
    id: 1,
    title: "Community Cleanup",
    shortDescription: "Join us for a beach cleanup",
    description:
      "Help us make our community cleaner and greener! We'll be picking up trash and recyclables from the local beach. All cleaning supplies will be provided. Please wear comfortable clothes and bring water.",
    image: {sample1},
    date: "2025-06-15",
    time: "09:00 AM - 12:00 PM",
  },
  {
    id: 2,
    title: "Fundraising Gala",
    shortDescription: "Annual charity dinner",
    description:
      "Our annual fundraising gala is back! Join us for an evening of fine dining, entertainment, and the opportunity to support our cause. Formal attire is requested. Tickets include a three-course meal and drinks.",
    image: {sample2},
    date: "2025-07-20",
    time: "06:30 PM - 10:00 PM",
  },
  {
    id: 3,
    title: "Youth Workshop",
    shortDescription: "Skills for the future",
    description:
      "A workshop designed to equip young people with essential skills for the future. Topics include digital literacy, financial management, and communication skills. Open to ages 14-18.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-06-28",
    time: "10:00 AM - 03:00 PM",
  },
  {
    id: 4,
    title: "Charity Run",
    shortDescription: "5K for a cause",
    description:
      "Lace up your running shoes for our annual 5K charity run! All proceeds go directly to supporting our education initiatives. Participants will receive a t-shirt and refreshments.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-08-05",
    time: "07:00 AM - 10:00 AM",
  },
  {
    id: 5,
    title: "Art Exhibition",
    shortDescription: "Local artists showcase",
    description:
      "Come appreciate the work of talented local artists at our exhibition. Various art forms will be on display, and some pieces will be available for purchase, with proceeds supporting the artists and our organization.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-07-10",
    time: "11:00 AM - 06:00 PM",
  },
  {
    id: 6,
    title: "Food Drive",
    shortDescription: "Help stock local pantries",
    description:
      "Help us collect non-perishable food items for local food pantries. We're aiming to collect 1,000 items to help families in need. Drop-off points will be set up at various locations.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-06-22",
    time: "09:00 AM - 05:00 PM",
  },
  {
    id: 7,
    title: "Senior Social",
    shortDescription: "Community gathering for seniors",
    description:
      "A special event for our senior community members. Join us for games, refreshments, and good company. Transportation can be arranged for those who need it.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-07-05",
    time: "02:00 PM - 04:30 PM",
  },
  {
    id: 8,
    title: "Environmental Talk",
    shortDescription: "Learn about sustainability",
    description:
      "An informative session on environmental sustainability and how we can make a difference. Guest speakers include environmental scientists and local activists. Q&A session included.",
    image: "/placeholder.svg?height=300&width=300",
    date: "2025-08-15",
    time: "06:00 PM - 08:00 PM",
  },
]

function Events() {
  const [events, setEvents] = useState(eventsData)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("nearest")
  const [isFlipping, setIsFlipping] = useState(false)
  const [flippedCardId, setFlippedCardId] = useState(null)

  // Sort events based on the selected sort order
  useEffect(() => {
    const sortedEvents = [...eventsData].sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return sortOrder === "nearest" ? dateA - dateB : dateB - dateA
    })
    setEvents(sortedEvents)
  }, [sortOrder])

  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
  }

  const handleCardClick = (event) => {
    setFlippedCardId(event.id)
    setIsFlipping(true)

    // Set a timeout to show the modal after the flip animation starts
    setTimeout(() => {
      setSelectedEvent(event)
      setIsModalOpen(true)
      setIsFlipping(false)
    }, 300)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFlippedCardId(null)
  }

  const handleVolunteer = (isGuest) => {
    alert(`You've signed up to volunteer${isGuest ? " as a guest" : ""} for "${selectedEvent.title}"!`)
    closeModal()
  }

  return (
   

    <div className="events-container">
      <h1 className="events-title">Events</h1>

      <div className="sort-container">
        <label htmlFor="sort-select">Sort by: </label>
        <select id="sort-select" value={sortOrder} onChange={handleSortChange} className="sort-select">
          <option value="nearest">Nearest Events</option>
          <option value="farthest">Farthest Events</option>
        </select>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <div
            key={event.id}
            className={`event-card ${flippedCardId === event.id ? "flipping" : ""}`}
            onClick={() => handleCardClick(event)}
          >
            <div className="polaroid">
              <div className="polaroid-image">
                <img src={event.image || "/placeholder.svg"} alt={event.title} />
              </div>
              <div className="polaroid-content">
                <h3>{event.title}</h3>
                <p>{event.shortDescription}</p>
                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
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
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedEvent.image || "/placeholder.svg"} alt={selectedEvent.title} />
              </div>
              <div className="modal-details">
                <h2>{selectedEvent.title}</h2>
                <p className="modal-description">{selectedEvent.description}</p>
                <div className="modal-datetime">
                  <p>
                    <strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedEvent.time}
                  </p>
                </div>
                <div className="modal-buttons">
                  <button className="volunteer-button" onClick={() => handleVolunteer(false)}>
                    Volunteer
                  </button>
                  <button className="volunteer-guest-button" onClick={() => handleVolunteer(true)}>
                    Volunteer as a Guest
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
