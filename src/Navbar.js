import React, { useState } from 'react';
import './Navbar.css';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import logo from './assets/home_logo.png';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <img
          src={logo}
          alt="Logo"
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />

        {/* Right Side */}
        <div className="navbar-right">
          <button className="adopt-btn" onClick={() => navigate('/events')}>
            Events
          </button>
          <button className="volunteer-btn" onClick={() => navigate('/signup')}>
            Volunteer
          </button>
          <button className="dev-btn" onClick={() => navigate('/developers')}>Developers</button>


          {/* Profile Icon */}
          <div
            className="profile-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <MdOutlineAccountCircle className="profile-icon" />

            {showDropdown && (
              <div className="dropdown">
                <div onClick={() => navigate('/signup')}>
                  <p className="dropdown-txt">Sign Up</p>
                </div>
                <div onClick={() => navigate('/login')}>
                  <p className="dropdown-txt">Login</p>
                </div>
                {/* <div onClick={() => navigate('/guest')}>
                  <p className="dropdown-txt">Volunteer as Guest</p>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
