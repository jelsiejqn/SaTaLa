import React from 'react';
import './Footer.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';
import logo from './assets/home_logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo and Name */}
        <div className="footer-logo">
          <img src={logo} alt="SaTaLa Logo" className="footer-img" />
          <h2 className="footer-org">SaTaLa</h2>
        </div>

        {/* Social Icons */}
        <div className="footer-socials">
          <a
            href="https://www.facebook.com/sagiptaallake" // ✅ Replace with real URL
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://twitter.com/sagiptaallake" // ✅ Replace with real URL or remove if not applicable
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <FaTwitter />
          </a>
          <a
            href="https://www.instagram.com/sagiptaallake" // ✅ Replace with real URL
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="mailto:info@sagiptaallake.org"
            aria-label="Email"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SaTaLa. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
