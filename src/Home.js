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

import about1 from './assets/about-1.png';
import about2 from './assets/about-2.png';
import about3 from './assets/about-3.png';


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

      {/* Section 5 */}
<section className="cards-section">
  <div className="cards-container">
    {/* Card 1 */}
    <div className="card">
      <div className="card-image">
        <img src={about3} alt="Event Image 1" className = "about-img"/>
      </div>
      <div className="card-content">
        <p className="card-description">  <br /> <br />About the Founder <br /> of Sagip Taal Lake</p>
      </div>
      <div className="card-hover">
        <p className="card-hover-text">
         Nelson Terrible, a native of Talisay, Batangas, is deeply passionate about his hometown’s natural beauty. To support it, he built a 12-hectare, 224-room resort called Club Balai Isabel. Despite his efforts to help with local solid waste management, he realized that school visits and cleanups weren’t enough. Due to the size of his business, he took on the responsibility of managing the resort’s waste, aware that the local government couldn’t handle the large amount generated by his resort. </p>  </div>
    </div>

    <br /> <br />

    {/* Card 2 */}
    <div className="card">
      <div className="card-image">
        <img src={about1} alt="Event Image 2" className = "about-img" />
      </div>
      <div className="card-content">
        <p className="card-description"> <br /> <br />The Wake Up Call of <br /> Sagip Taal Lake</p>
      </div>
      <div className="card-hover">
        <p className="card-hover-text">
         During the pandemic of 2020, heavy monsoon rains in August flushed the waterways that led into the lake, expelling an incredible amount of trash all in one go. The lake looked like a garbage dump with Taal Volcano as the backdrop. Witnessing this led concerned citizens to take concrete action.  </p>
      </div>
    </div>

    {/* Card 2 */}
    <div className="card">
      <div className="card-image">
        <img src={about2} alt="Event Image 2" className = "about-img"/>
      </div>
      <div className="card-content">
        <p className="card-description"> <br /> <br />The Project that Started <br /> It all</p>
      </div>
      <div className="card-hover">
        <p className="card-hover-text">
          The first project of SaTaLa was Pera Sa Basura, a program that gives the community an incentive to segregate waste. Segregated waste is in turn bought by a few different junk dealers. As a result of this project, the LGU has reported a reduction of dump truck loads of trash per week from 7 to 2. By any standards, this is significant, and an important milestone in the efforts of the organization.   </p>
      </div>
    </div>

    {/* You can duplicate this structure for more cards */}
  </div>
</section>

      {/* Section 4 - Dynamic FAQ Cards */}
      <br /> <br />  <br /> <br /> <center> 
      <h1> Frquently Asked Questions </h1>
      </center>
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