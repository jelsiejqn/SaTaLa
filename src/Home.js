import React from 'react';
import './Home.css';
import HomeStats from './HomeStats';

import bgImage from './assets/home_bg.png';

import abtImage from './assets/img-about.png';
import logoImage from './assets/img-logo.png';

import faq1 from './assets/faq-img1.png';
import faq2 from './assets/faq-img2.png';
import faq3 from './assets/faq-img3.png';

function Home() {

  return (
    <div className="home">

{/* Section 1 */}
      <section className="home-hero" style={{ backgroundImage: `url(${bgImage})` }}>
        <div className="home-hero-content">
          <h1 className="home-h1">🌱 <br /> Your hands can heal.<br />Volunteer to plant <br /> a Tree Today!</h1>
          <button className="home-volunteer-btn">Volunteer Now</button>
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
            <p className = "about-text-title">
                About Sagip Taal <br /> Lake (SaTaLa)
            </p>
            <p className="about-text">
              Sagip Taal Lake (SaTaLa) 
is a non-governmental 
organization that aims 
to bring awareness and 
solutions to reduce Taal 
Lake’s pollution through 
community involvement 
and education.
            </p>
          </div>
        </div>
      </section>


    {/* Section 4 */}

<div className="faq-container">

  <div className="faq-card">
    <div className="faq-inner">
      <div className="faq-front">
        <img src={faq2} alt="Beach Clean-Up" className="faq-image" />
        <p className="faq-question">What am I volunteering for?</p>
      </div>
      <div className="faq-back">
        <p className="faq-answer">Volunteering with SaTaLa means offering your time and energy for meaningful causes—like reforestation, clean-up drives, and other nature-focused events. The opportunities vary depending on our current projects, but no matter what, you’re volunteering for something bigger: the planet. 🌍</p>
      </div>
    </div>
  </div>

  <div className="faq-card">
    <div className="faq-inner">
      <div className="faq-front">
        <img src={faq3} alt="Volunteering" className="faq-image" />
        <p className="faq-question">How do I Volunteer?</p>
      </div>
      <div className="faq-back">
        <p className="faq-answer">To join an event, you can create an account and register for the one that interests you. Don’t have an account? No problem—you can still volunteer as a guest! We’ll just need your email so we can keep you updated with event details and reminders. ✋</p>
      </div>
    </div>
  </div>

  <div className="faq-card">
    <div className="faq-inner">
      <div className="faq-front">
        <img src={faq1} alt="Planting Tree" className="faq-image" />
        <p className="faq-question"> Where can I see the events I can sign up for? </p>
      </div>
      <div className="faq-back">
        <p className="faq-answer">Thee events you can sign up for will be posted on the Events page of the website or accessed through this link. There are various events available, such as tree planting, cleanup drives, and more. All upcoming events will be displayed on the Events page, where you can click on an event card to view its description and the date it will take place.</p>
      </div>
    </div>
  </div>

</div>


    </div>
  );
}

export default Home;
