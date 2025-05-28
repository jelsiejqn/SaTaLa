"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  throw new Error('Supabase configuration is missing')
}

const supabase = createClient(supabaseUrl, supabaseKey)

const EventsManager = () => {
  // Main state
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Add form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    date: '',
    time: '',
    image: null
  })
  const [imagePreview, setImagePreview] = useState('')
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    short_description: '',
    date: '',
    time: '',
    image: null
  })
  const [editImagePreview, setEditImagePreview] = useState('')

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      alert('Error fetching events: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load events on component mount
  useEffect(() => {
    fetchEvents()
  }, [])

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    if (!file) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `event-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('events')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('events')
        .getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  // Handle add form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle add form image change
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // Add new event
  const handleAddEvent = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description || !formData.short_description || 
        !formData.date || !formData.time || !formData.image) {
      alert('Please fill in all fields and select an image')
      return
    }

    try {
      setLoading(true)
      
      // Upload image
      const imageUrl = await uploadImage(formData.image)
      
      // Insert event
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: formData.title,
          description: formData.description,
          short_description: formData.short_description,
          date: formData.date,
          time: formData.time,
          image: imageUrl
        }])
        .select()

      if (error) throw error

      // Reset form
      setFormData({
        title: '',
        description: '',
        short_description: '',
        date: '',
        time: '',
        image: null
      })
      setImagePreview('')

      // Refresh events
      await fetchEvents()
      alert('Event added successfully!')

    } catch (error) {
      console.error('Error adding event:', error)
      alert('Error adding event: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Open edit modal
  const openEditModal = (event) => {
    setEditingEvent(event)
    setEditFormData({
      title: event.title,
      description: event.description,
      short_description: event.short_description || '',
      date: event.date,
      time: event.time,
      image: null
    })
    setEditImagePreview(event.image || '')
    setIsEditModalOpen(true)
  }

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle edit form image change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setEditFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => setEditImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // Update event
  const handleUpdateEvent = async () => {
    if (!editFormData.title || !editFormData.description || !editFormData.short_description || 
        !editFormData.date || !editFormData.time) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      
      let imageUrl = editingEvent.image // Keep existing image by default
      
      // Upload new image if selected
      if (editFormData.image) {
        imageUrl = await uploadImage(editFormData.image)
      }
      
      // Update event in database
      const { data, error } = await supabase
        .from('events')
        .update({
          title: editFormData.title,
          description: editFormData.description,
          short_description: editFormData.short_description,
          date: editFormData.date,
          time: editFormData.time,
          image: imageUrl
        })
        .eq('id', editingEvent.id)
        .select()

      if (error) throw error

      // Close modal and refresh
      setIsEditModalOpen(false)
      setEditingEvent(null)
      await fetchEvents()
      alert('Event updated successfully!')

    } catch (error) {
      console.error('Error updating event:', error)
      alert('Error updating event: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete event
  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      setLoading(true)
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', editingEvent.id)

      if (error) throw error

      // Close modal and refresh
      setIsEditModalOpen(false)
      setEditingEvent(null)
      await fetchEvents()
      alert('Event deleted successfully!')

    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setEditingEvent(null)
    setEditFormData({
      title: '',
      description: '',
      short_description: '',
      date: '',
      time: '',
      image: null
    })
    setEditImagePreview('')
  }

  // Check if event is past
  const isEventPast = (date, time) => {
    const eventDateTime = new Date(`${date}T${time}`)
    return eventDateTime < new Date()
  }

  if (loading && events.length === 0) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading events...</div>
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Events Manager</h1>

      {/* Add Event Form */}
      <div style={{ marginBottom: '40px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Add New Event</h2>
        <form onSubmit={handleAddEvent}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Short Description *
            </label>
            <input
              type="text"
              name="short_description"
              value={formData.short_description}
              onChange={handleInputChange}
              maxLength={100}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Full Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Time *
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Event'}
          </button>
        </form>
      </div>

      {/* Events Table */}
      <div>
        <h2>Events ({events.length})</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Short Description</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length > 0 ? (
                events.map((event) => (
                  <tr key={event.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <img
                        src={event.image || "/api/placeholder/60/60"}
                        alt={event.title}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{event.title}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{event.short_description}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>{event.time}</td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: isEventPast(event.date, event.time) ? '#dc3545' : '#28a745',
                        color: 'white'
                      }}>
                        {isEventPast(event.date, event.time) ? 'Past' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                      <button
                        onClick={() => openEditModal(event)}
                        style={{
                          backgroundColor: '#ffc107',
                          color: '#212529',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '20px', textAlign: 'center', border: '1px solid #ddd' }}>
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingEvent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2>Edit Event</h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleEditImageChange}
                style={{ width: '100%', padding: '8px' }}
              />
              {editImagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img src={editImagePreview} alt="Preview" style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={editFormData.title}
                onChange={handleEditInputChange}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Short Description *
              </label>
              <input
                type="text"
                name="short_description"
                value={editFormData.short_description}
                onChange={handleEditInputChange}
                maxLength={100}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Full Description *
              </label>
              <textarea
                name="description"
                value={editFormData.description}
                onChange={handleEditInputChange}
                rows={4}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditInputChange}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={editFormData.time}
                  onChange={handleEditInputChange}
                  required
                  style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={handleUpdateEvent}
                disabled={loading}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={loading}
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={closeEditModal}
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
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