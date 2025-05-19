import React, { useState } from 'react';
import './Navbar.css';
import { MdOutlineAccountCircle } from 'react-icons/md';
import logo from './assets/home_logo.png';


const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo" />

        {/* Right Side */}
        <div className="navbar-right">
          <button className="adopt-btn">Events</button>
          <button className="volunteer-btn">Volunteer</button>

          {/* Profile Icon */}
          <div
            className="profile-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
          <MdOutlineAccountCircle className="profile-icon" />

            {showDropdown && (
              <div className="dropdown">
                <div><p className="dropdown-txt"> Sign Up </p> </div>
                <div><p className="dropdown-txt"> Login </p></div>
                <div><p className="dropdown-txt"> Volunteer as Guest </p></div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
