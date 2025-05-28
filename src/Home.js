import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import './Home.css';
import HomeStats from './HomeStats';

import bgImage from './assets/home_bg.png';
import abtImage from './assets/img-about.png';
import logoImage from './assets/img-logo.png';
// Import default FAQ images as fallbacks for missing images only
import faq1 from './assets/faq-img1.png';
import faq2 from './assets/faq-img2.png';
import faq3 from './assets/faq-img3.png';

function Home() {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [error, setError] = useState(null);

  // Default FAQ images mapping for fallback when image_url is missing
  const defaultImages = {
    1: faq2,
    2: faq3,
    3: faq1
  };

  const handleVolunteerClick = () => {
    navigate('/events');
  };

  // Fetch FAQs from Supabase with real-time updates
  const fetchFaqs = async () => {
    try {
      setLoadingFaqs(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        setError('Failed to load FAQs');
        setFaqs([]);
      } else {
        setFaqs(data || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setError('Failed to load FAQs');
      setFaqs([]);
    } finally {
      setLoadingFaqs(false);
    }
  };

  // Get image source with fallback for missing images
  const getImageSource = (faq) => {
    if (faq.image_url && faq.image_url.trim() !== '') {
      return faq.image_url;
    }
    // Use default images based on display order or fall back to first image
    const imageIndex = faq.display_order % 3 || 3; // Cycle through 1, 2, 3
    return defaultImages[imageIndex] || faq1;
  };

  // Set up real-time subscription for FAQ changes
  useEffect(() => {
    fetchFaqs();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('faqs_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'faqs' 
        }, 
        (payload) => {
          console.log('FAQ change detected:', payload);
          // Refetch FAQs when changes occur
          fetchFaqs();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle image load errors
  const handleImageError = (e, faq) => {
    console.warn(`Failed to load image for FAQ: ${faq.question}`);
    const imageIndex = faq.display_order % 3 || 3;
    e.target.src = defaultImages[imageIndex] || faq1;
  };

  return (
    <div className="home">
      {/* Section 1 */}
      <section className="home-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="home-hero-content">
          <h1 className="home-h1">🌱 <br /> Your hands can heal.<br />Volunteer to plant <br /> a Tree Today!</h1>
          <button className="home-volunteer-btn" onClick={handleVolunteerClick}>Volunteer Now</button>
        </div>
      </section>

      {/* Section 2 */}
      <HomeStats />

      {/* Section 3 */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-image">
            <img src={abtImage} alt="Org Visual" />
          </div>
          <div className="about-content">
            <img src={logoImage} alt="Org Logo" className="about-logo" />
            <p className="about-text-title">About Sagip Taal <br /> Lake (SaTaLa)</p>
            <p className="about-text">
              Sagip Taal Lake (SaTaLa) is a non-governmental organization that aims to bring awareness and solutions to reduce Taal Lake's pollution through community involvement and education.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 - Dynamic FAQ Cards */}
      <div className="faq-container">
        {loadingFaqs ? (
          <div className="faq-loading">
            <div className="loading-spinner"></div>
            <p>Loading FAQs...</p>
          </div>
        ) : error ? (
          <div className="faq-error">
            <p>⚠️ {error}</p>
            <button onClick={fetchFaqs} className="retry-button">
              Try Again
            </button>
          </div>
        ) : faqs.length === 0 ? (
          <div className="faq-empty">
            <p>📝 No FAQs available at the moment.</p>
            <p>Check back soon for helpful information!</p>
          </div>
        ) : (
          faqs.map((faq) => (
            <div className="faq-card" key={faq.id}>
              <div className="faq-inner">
                <div className="faq-front">
                  <img 
                    src={getImageSource(faq)} 
                    alt={faq.question} 
                    className="faq-image"
                    onError={(e) => handleImageError(e, faq)}
                    loading="lazy"
                  />
                  <p className="faq-question">{faq.question}</p>
                </div>
                <div className="faq-back">
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;