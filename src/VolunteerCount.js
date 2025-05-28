"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration is missing')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const VolunteerCount = () => {
  const [eventsWithVolunteers, setEventsWithVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch all events and their volunteer counts
  const fetchEventsAndVolunteers = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Fetching events...')
      
      // First, get all events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (eventsError) {
        throw eventsError
      }

      console.log('Events fetched:', events)

      if (!events || events.length === 0) {
        setEventsWithVolunteers([])
        setLoading(false)
        return
      }

      // For each event, get volunteer count and volunteer details
      const eventsWithVolunteerData = await Promise.all(
        events.map(async (event) => {
          console.log(`Fetching volunteers for event ID: ${event.id}`)
          
          const { data: volunteers, error: volunteersError } = await supabase
            .from('volunteers')
            .select('*')
            .eq('event_id', event.id)
            .order('created_at', { ascending: false })

          if (volunteersError) {
            console.error(`Error fetching volunteers for event ${event.id}:`, volunteersError)
            return {
              ...event,
              volunteerCount: 0,
              volunteers: []
            }
          }

          console.log(`Volunteers for event ${event.id}:`, volunteers)

          return {
            ...event,
            volunteerCount: volunteers ? volunteers.length : 0,
            volunteers: volunteers || []
          }
        })
      )

      console.log('Final events with volunteers:', eventsWithVolunteerData)
      setEventsWithVolunteers(eventsWithVolunteerData)

    } catch (error) {
      console.error('Error in fetchEventsAndVolunteers:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchEventsAndVolunteers()
  }, [])

  // Set up real-time subscriptions and event listeners
  useEffect(() => {
    console.log('Setting up real-time subscriptions...')

    const eventsChannel = supabase
      .channel('events-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events'
      }, (payload) => {
        console.log('Events table changed:', payload)
        fetchEventsAndVolunteers()
      })
      .subscribe()

    const volunteersChannel = supabase
      .channel('volunteers-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'volunteers'
      }, (payload) => {
        console.log('Volunteers table changed:', payload)
        fetchEventsAndVolunteers()
      })
      .subscribe()

    // Listen for custom volunteer registration events from Events component
    const handleVolunteerRegistered = (event) => {
      console.log('New volunteer registered via Events component:', event.detail)
      fetchEventsAndVolunteers()
    }

    window.addEventListener('volunteerRegistered', handleVolunteerRegistered)

    return () => {
      console.log('Cleaning up subscriptions...')
      eventsChannel.unsubscribe()
      volunteersChannel.unsubscribe()
      window.removeEventListener('volunteerRegistered', handleVolunteerRegistered)
    }
  }, [])

  const handleEventClick = (eventData) => {
    console.log('Event clicked:', eventData)
    setSelectedEvent(eventData)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEvent(null)
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateTimeString) => {
    try {
      return new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateTimeString
    }
  }

  const exportToCSV = () => {
    if (!selectedEvent?.volunteers?.length) {
      alert('No volunteers to export')
      return
    }

    const headers = ['Name', 'Email', 'Status', 'Registration Date']
    const rows = selectedEvent.volunteers.map(volunteer => [
      volunteer.name || 'N/A',
      volunteer.email || 'N/A',
      volunteer.is_guest ? 'Guest' : 'Member',
      formatDateTime(volunteer.created_at)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedEvent.title?.replace(/[^a-z0-9]/gi, '_') || 'event'}_volunteers.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #f3f3f3',
          borderTop: '5px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <p>Loading events and volunteers...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
        <h3>Error Loading Data</h3>
        <p>{error}</p>
        <button 
          onClick={fetchEventsAndVolunteers}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #ecf0f1',
        paddingBottom: '15px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>
          Event Volunteer Management ({eventsWithVolunteers.length} events)
        </h1>
        <button 
          onClick={fetchEventsAndVolunteers}
          style={{
            padding: '8px 16px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>

      {/* Events Grid */}
      {eventsWithVolunteers.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#6c757d' }}>No Events Found</h3>
          <p style={{ color: '#6c757d' }}>Create some events to see volunteer data here.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px',
          marginBottom: '30px'
        }}>
          {eventsWithVolunteers.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventClick(event)}
              style={{
                border: '1px solid #ddd',
                borderRadius: '12px',
                padding: '20px',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)'
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              {/* Event Image */}
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: '100%',
                    height: '180px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '15px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}

              {/* Event Details */}
              <h3 style={{ 
                margin: '0 0 10px 0', 
                color: '#2c3e50',
                fontSize: '18px'
              }}>
                {event.title || 'Untitled Event'}
              </h3>

              {event.date && (
                <p style={{ 
                  margin: '0 0 15px 0', 
                  color: '#7f8c8d',
                  fontSize: '14px'
                }}>
                  📅 {formatDate(event.date)} {event.time && `at ${event.time}`}
                </p>
              )}

              {/* Volunteer Count Badge */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{
                  backgroundColor: event.volunteerCount > 0 ? '#27ae60' : '#95a5a6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  👥 {event.volunteerCount} Volunteer{event.volunteerCount !== 1 ? 's' : ''}
                </div>
                
                <div style={{ 
                  color: '#3498db', 
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  Click to view →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}
          onClick={closeModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '900px',
              maxHeight: '80vh',
              width: '90%',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#7f8c8d'
              }}
            >
              ×
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: '25px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
                {selectedEvent.title}
              </h2>
              {selectedEvent.date && (
                <p style={{ margin: '0 0 15px 0', color: '#7f8c8d' }}>
                  📅 {formatDate(selectedEvent.date)} {selectedEvent.time && `at ${selectedEvent.time}`}
                </p>
              )}
              <div style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                👥 {selectedEvent.volunteerCount} Total Volunteer{selectedEvent.volunteerCount !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Volunteers List */}
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
                Volunteer List
              </h3>

              {!selectedEvent.volunteers || selectedEvent.volunteers.length === 0 ? (
                <div style={{
                  padding: '40px',
                  textAlign: 'center',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  color: '#6c757d'
                }}>
                  <p>No volunteers registered for this event yet.</p>
                </div>
              ) : (
                <>
                  {/* Export Button */}
                  <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                    <button
                      onClick={exportToCSV}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      📊 Export to CSV
                    </button>
                  </div>

                  {/* Volunteers Table */}
                  <div style={{ overflow: 'auto' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid #ddd'
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                          {/* <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Phone</th> */}
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.volunteers.map((volunteer, index) => (
                          <tr key={volunteer.id || index} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px' }}>{volunteer.name || 'N/A'}</td>
                            <td style={{ padding: '12px' }}>{volunteer.email || 'N/A'}</td>
                            {/* <td style={{ padding: '12px' }}>{volunteer.phone || 'N/A'}</td> */}
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                backgroundColor: volunteer.is_guest ? '#f39c12' : '#27ae60',
                                color: 'white'
                              }}>
                                {volunteer.is_guest ? 'Guest' : 'Member'}
                              </span>
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px', color: '#7f8c8d' }}>
                              {formatDateTime(volunteer.created_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{ 
              marginTop: '30px', 
              textAlign: 'center',
              borderTop: '1px solid #eee',
              paddingTop: '20px'
            }}>
              <button
                onClick={closeModal}
                style={{
                  padding: '10px 30px',
                  backgroundColor: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default VolunteerCount