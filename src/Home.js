import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import './Home.css';
import HomeStats from './HomeStats';

import bgImage from './assets/home_bg.png';
import abtImage from './assets/img-about.png';
import logoImage from './assets/img-logo.png';
import faq1 from './assets/faq-img1.png';
import faq2 from './assets/faq-img2.png';
import faq3 from './assets/faq-img3.png';

function Home() {
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleVolunteerClick = () => {
    navigate('/events'); // ✅ Route to Events page
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
              Sagip Taal Lake (SaTaLa) is a non-governmental organization that aims to bring awareness and solutions to reduce Taal Lake’s pollution through community involvement and education.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4 */}
      <div className="faq-container">
        {/* FAQ Cards */}
        {[{
          img: faq2,
          question: "What am I volunteering for?",
          answer: "Volunteering with SaTaLa means offering your time and energy for meaningful causes—like reforestation, clean-up drives, and other nature-focused events..."
        }, {
          img: faq3,
          question: "How do I Volunteer?",
          answer: "To join an event, you can create an account and register for the one that interests you..."
        }, {
          img: faq1,
          question: "Where can I see the events I can sign up for?",
          answer: "The events you can sign up for will be posted on the Events page of the website..."
        }].map((item, index) => (
          <div className="faq-card" key={index}>
            <div className="faq-inner">
              <div className="faq-front">
                <img src={item.img} alt={item.question} className="faq-image" />
                <p className="faq-question">{item.question}</p>
              </div>
              <div className="faq-back">
                <p className="faq-answer">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
