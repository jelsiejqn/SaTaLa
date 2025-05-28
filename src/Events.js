"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import "./Events.css"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables. Please check your .env.local file.")
  throw new Error("Supabase configuration is missing")
}

const supabase = createClient(supabaseUrl, supabaseKey)

function Events() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("nearest")
  const [isFlipping, setIsFlipping] = useState(false)
  const [flippedCardId, setFlippedCardId] = useState(null)
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")

  // User authentication state
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingUserData, setLoadingUserData] = useState(false)

  // Volunteer form state
  const [isVolunteerFormOpen, setIsVolunteerFormOpen] = useState(false)
  const [volunteerData, setVolunteerData] = useState({
    name: "",
    email: "",
    phone: "",
    isGuest: false,
  })
  const [submittingVolunteer, setSubmittingVolunteer] = useState(false)

  // Check authentication status and fetch user data
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        await fetchUserProfile(user.id)
      }
    }

    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      setLoadingUserData(true)

      // Try to fetch from a users/profiles table first
      const { data: profileData, error: profileError } = await supabase
        .from("users") // or 'profiles' depending on your table name
        .select("*")
        .eq("id", userId)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching user profile:", profileError)
        // Fallback to auth user data
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUserProfile({
          name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
          email: user?.email || "",
          phone: user?.user_metadata?.phone || user?.phone || "",
        })
      } else if (profileData) {
        setUserProfile({
          name: profileData.full_name || profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      // Fallback to basic auth data
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserProfile({
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || user.phone || "",
        })
      }
    } finally {
      setLoadingUserData(false)
    }
  }

  // Fetch events from Supabase
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true })

      if (error) {
        console.error("Error fetching events:", error)
        return
      }

      // Filter out past events for the public view
      const currentDate = new Date()
      const activeEvents =
        data?.filter((event) => {
          const eventDateTime = new Date(`${event.date}T${event.time}`)
          return eventDateTime >= currentDate
        }) || []

      setEvents(activeEvents)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch and set up real-time subscription
  useEffect(() => {
    fetchEvents()

    // Subscribe to changes in the events table
    const eventsSubscription = supabase
      .channel("events_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, (payload) => {
        console.log("Public: Database change received!", payload)
        fetchEvents()
      })
      .subscribe()

    return () => {
      eventsSubscription.unsubscribe()
    }
  }, [])

  // Sort events based on the selected sort order
  useEffect(() => {
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
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

    setTimeout(() => {
      setSelectedEvent(event)
      setIsModalOpen(true)
      setIsFlipping(false)
    }, 300)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setFlippedCardId(null)
    setIsVolunteerFormOpen(false)
    setVolunteerData({
      name: "",
      email: "",
      phone: "",
      isGuest: false,
    })
  }

  // Open volunteer form - simplified logic
  const handleVolunteerClick = () => {
    if (user && userProfile) {
      // Logged-in user: auto-populate with their data
      setVolunteerData({
        name: userProfile.name || "",
        email: userProfile.email || "",
        phone: userProfile.phone || "",
        isGuest: false,
      })
    } else {
      // Not logged in: empty form as guest
      setVolunteerData({
        name: "",
        email: "",
        phone: "",
        isGuest: true,
      })
    }
    setIsVolunteerFormOpen(true)
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setVolunteerData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Submit volunteer registration
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault()

    if (!volunteerData.name.trim() || !volunteerData.email.trim()) {
      alert("Please fill in your name and email")
      return
    }

    try {
      setSubmittingVolunteer(true)

      // Check if user already volunteered for this event
      const { data: existingVolunteer, error: checkError } = await supabase
        .from("volunteers")
        .select("*")
        .eq("event_id", selectedEvent.id)
        .eq("email", volunteerData.email.trim())
        .single()

      if (checkError && checkError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" - that's what we want
        throw checkError
      }

      if (existingVolunteer) {
        alert("You have already registered as a volunteer for this event!")
        return
      }

      // Insert volunteer data with all required fields for VolunteerCount display
      const { data, error } = await supabase
        .from("volunteers")
        .insert([
          {
            event_id: selectedEvent.id,
            event_title: selectedEvent.title,
            name: volunteerData.name.trim(),
            email: volunteerData.email.trim(),
            phone: volunteerData.phone.trim() || null,
            is_guest: volunteerData.isGuest,
            user_id: !volunteerData.isGuest && user ? user.id : null, // Link to user if logged in member
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        throw error
      }

      console.log("Volunteer registered successfully:", data)
      console.log("✅ This volunteer data will now appear in VolunteerCount component")

      alert(
        `Thank you for volunteering${volunteerData.isGuest ? " as a guest" : ""} for "${selectedEvent.title}"!\n\nYour registration will appear in the admin volunteer dashboard.`,
      )
      closeModal()

      // Trigger custom event for immediate VolunteerCount update
      window.dispatchEvent(
        new CustomEvent("volunteerRegistered", {
          detail: {
            eventId: selectedEvent.id,
            volunteerData: data[0],
            eventTitle: selectedEvent.title,
          },
        }),
      )
    } catch (error) {
      console.error("Error registering volunteer:", error)
      alert("Error registering volunteer: " + error.message)
    } finally {
      setSubmittingVolunteer(false)
    }
  }

  // Format time for display
  const formatTime = (time) => {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatEventTime = (time) => {
    return formatTime(time)
  }

  // Filter events based on search term
  const filteredEvents = events.filter((event) => {
    if (!searchTerm.trim()) return true

    const searchLower = searchTerm.toLowerCase()
    return event.title.toLowerCase().includes(searchLower)
  })

  if (loading) {
    return (
      <div className="events-container">
        <div className="loading-spinner">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="events-container">
      <h1 className="events-title">Upcoming Events</h1>

      <div
        className="controls-container"
        style={{ display: "flex", gap: "15px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}
      >
        <div className="search-container" style={{ flex: "1", minWidth: "200px" }}>
          <input
          className="search-input"
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
          />
        </div>
        <div className="sort-container" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <label htmlFor="sort-select">Sort by: </label>
          <select id="sort-select" value={sortOrder} onChange={handleSortChange} className="sort-select">
            <option value="nearest">Upcoming Events</option>
            <option value="farthest">Future Events</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="no-events-message">
          <h2>{searchTerm.trim() ? "No events found" : "No upcoming events"}</h2>
          <p>
            {searchTerm.trim()
              ? `No events match "${searchTerm}". Try a different search term.`
              : "Check back soon for new events!"}
          </p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className={`event-card ${flippedCardId === event.id ? "flipping" : ""}`}
              onClick={() => handleCardClick(event)}
            >
              <div className="polaroid">
                <div className="polaroid-image">
                  <img src={event.image || "/api/placeholder/300/200"} alt={event.title} />
                </div>
                <div className="polaroid-content">
                  <h3>{event.title}</h3>
                  <p>{event.short_description}</p>
                  <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>
              ×
            </button>
            <div className="modal-grid">
              <div className="modal-image">
                <img src={selectedEvent.image || "/api/placeholder/400/300"} alt={selectedEvent.title} />
              </div>
              <div className="modal-details">
                <h2>{selectedEvent.title}</h2>
                <p className="modal-description">{selectedEvent.description}</p>
                <div className="modal-datetime">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Time:</strong> {formatEventTime(selectedEvent.time)}
                  </p>
                </div>

                {!isVolunteerFormOpen ? (
                  <div className="modal-buttons">
                    <button className="volunteer-button" onClick={handleVolunteerClick} disabled={loadingUserData}>
                      {loadingUserData ? "Loading..." : user ? "Volunteer" : "Volunteer (Guest)"}
                    </button>
                  </div>
                ) : (
                  <div className="volunteer-form-container">
                    <h3>Volunteer Registration</h3>
                    <div className="volunteer-status">
                      {user ? (
                        <div className="member-status">
                          <span className="status-badge member">✓ Registered Member</span>
                          <p className="status-description">Your information has been pre-filled from your profile</p>
                        </div>
                      ) : (
                        <div className="guest-status">
                          <span className="status-badge guest">👤 Guest Registration</span>
                          <p className="status-description">
                            You're volunteering as a guest. Consider creating an account for easier future
                            registrations!
                          </p>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleVolunteerSubmit} className="volunteer-form">
                      <div className="form-group">
                        <label htmlFor="volunteer-name">Full Name *</label>
                        <input
                          type="text"
                          id="volunteer-name"
                          name="name"
                          value={volunteerData.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          required
                          disabled={loadingUserData}
                          readOnly={user && !volunteerData.isGuest && volunteerData.name}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            marginTop: "4px",
                            backgroundColor: user && !volunteerData.isGuest && volunteerData.name ? "#f8f9fa" : "white",
                            cursor: user && !volunteerData.isGuest && volunteerData.name ? "not-allowed" : "text",
                          }}
                        />
                        {user && !volunteerData.isGuest && volunteerData.name && (
                          <small style={{ color: "#666", fontSize: "0.8em" }}>Auto-filled from your profile</small>
                        )}
                      </div>

                      <div className="form-group">
                        <label htmlFor="volunteer-email">Email *</label>
                        <input
                          type="email"
                          id="volunteer-email"
                          name="email"
                          value={volunteerData.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          required
                          disabled={loadingUserData}
                          readOnly={user && !volunteerData.isGuest && volunteerData.email}
                          style={{
                            width: "100%",
                            padding: "8px",
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            marginTop: "4px",
                            backgroundColor:
                              user && !volunteerData.isGuest && volunteerData.email ? "#f8f9fa" : "white",
                            cursor: user && !volunteerData.isGuest && volunteerData.email ? "not-allowed" : "text",
                          }}
                        />
                        {user && !volunteerData.isGuest && volunteerData.email && (
                          <small style={{ color: "#666", fontSize: "0.8em" }}>Auto-filled from your profile</small>
                        )}
                      </div>

                      <div className="form-buttons" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button
                          type="submit"
                          disabled={submittingVolunteer || loadingUserData}
                          style={{
                            backgroundColor: "#28a745",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: submittingVolunteer || loadingUserData ? "not-allowed" : "pointer",
                            opacity: submittingVolunteer || loadingUserData ? 0.6 : 1,
                          }}
                        >
                          {submittingVolunteer
                            ? "Registering..."
                            : loadingUserData
                              ? "Loading..."
                              : "Register as Volunteer"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsVolunteerFormOpen(false)}
                          style={{
                            backgroundColor: "#6c757d",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Events
