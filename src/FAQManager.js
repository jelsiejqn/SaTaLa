import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './FAQManager.css';

const FAQManager = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    image_url: '',
    display_order: 0,
    is_active: true
  });

  // Fetch FAQs from Supabase
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setFaqs(data || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Error fetching FAQs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add or update FAQ
  const saveFaq = async (e) => {
    e.preventDefault();
    
    try {
      if (editingFaq) {
        // Update existing FAQ
        const { error } = await supabase
          .from('faqs')
          .update(formData)
          .eq('id', editingFaq.id);

        if (error) throw error;
        alert('FAQ updated successfully!');
      } else {
        // Add new FAQ
        const { error } = await supabase
          .from('faqs')
          .insert([formData]);

        if (error) throw error;
        alert('FAQ added successfully!');
      }

      setShowModal(false);
      setEditingFaq(null);
      setFormData({
        question: '',
        answer: '',
        image_url: '',
        display_order: 0,
        is_active: true
      });
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Error saving FAQ: ' + error.message);
    }
  };

  // Delete FAQ
  const deleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('FAQ deleted successfully!');
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Error deleting FAQ: ' + error.message);
    }
  };

  // Toggle FAQ active status
  const toggleFaqStatus = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('faqs')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchFaqs();
    } catch (error) {
      console.error('Error updating FAQ status:', error);
      alert('Error updating FAQ status: ' + error.message);
    }
  };

  // Handle edit
  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      image_url: faq.image_url || '',
      display_order: faq.display_order,
      is_active: faq.is_active
    });
    setShowModal(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      image_url: '',
      display_order: faqs.length + 1,
      is_active: true
    });
    setShowModal(true);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  if (loading) {
    return <div className="loading">Loading FAQs...</div>;
  }

  return (
    <div className="faq-manager">
      <div className="faq-manager-header">
        <h2>FAQ Manager</h2>
        <button className="btn-primary" onClick={handleAddNew}>
          Add New FAQ
        </button>
      </div>

      <div className="faq-list">
        {faqs.length === 0 ? (
          <p className="no-faqs">No FAQs found. Add your first FAQ!</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className={`faq-item ${!faq.is_active ? 'inactive' : ''}`}>
              <div className="faq-content">
                <div className="faq-order">#{faq.display_order}</div>
                <div className="faq-details">
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                  {faq.image_url && (
                    <div className="faq-image-preview">
                      <img src={faq.image_url} alt="FAQ" />
                    </div>
                  )}
                </div>
                <div className="faq-status">
                  <span className={`status-badge ${faq.is_active ? 'active' : 'inactive'}`}>
                    {faq.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="faq-actions">
                <button className="btn-edit" onClick={() => handleEdit(faq)}>
                  Edit
                </button>
                <button 
                  className={`btn-toggle ${faq.is_active ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleFaqStatus(faq.id, faq.is_active)}
                >
                  {faq.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn-delete" onClick={() => deleteFaq(faq.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit FAQ */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingFaq ? 'Edit FAQ' : 'Add New FAQ'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <form onSubmit={saveFaq} className="modal-form">
              <div className="form-group">
                <label htmlFor="question">Question *</label>
                <input
                  type="text"
                  id="question"
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="answer">Answer *</label>
                <textarea
                  id="answer"
                  rows="4"
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  type="url"
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="display_order">Display Order</label>
                <input
                  type="number"
                  id="display_order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  />
                  Active (visible on website)
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingFaq ? 'Update FAQ' : 'Add FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManager;