import React from "react";
import "./Footer.css"; // still use CSS for layout and styling
import bgImage from "./assets/home_bg.png";
import logoImage from "./assets/home_logo.png";

import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer
      className="footer"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
      }}

      
    >

        
      <div className="footer-container">
        <div className="footer-left">
            <img src = {logoImage} className = "footer-logo"/>
          <h3>SaTaLa</h3>
          <p>Reviving the lake, one tree at a time.</p>
        </div>

        <div className="footer-center">
          <ul>
            <li><a href="/about">About</a></li>
            {/* <li><a href="/events">Events</a></li> */}
            {/* <li><a href="/faq">FAQs</a></li> */}
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-right">
        <section className="social-section">
          <h2 className="follow-title">Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.facebook.com/sagiptaallake" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/sagiptaallake" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
            <a href="https://twitter.com/sagiptaallake" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="social-icon" />
            </a>
          </div>
        </section>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SaTaLa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
