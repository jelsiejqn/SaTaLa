import React from "react";
import "./Footer.css"; // still use CSS for layout and styling
import bgImage from "./assets/home_bg.png";
import logoImage from "./assets/home_logo.png";

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
            <li><a href="/events">Events</a></li>
            <li><a href="/faq">FAQs</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-right">
          <p>Follow us:</p>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SaTaLa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
