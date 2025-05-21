import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Make sure this is correctly configured
import logo from './assets/home_logo.png';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for changes in session
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

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
          <button className="dev-btn" onClick={() => navigate('/developers')}>
            Developers
          </button>

          {/* Profile Icon */}
          <div
            className="profile-container"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <MdOutlineAccountCircle className="profile-icon" />

            {showDropdown && (
              <div className="dropdown">
                {session ? (
                  <>
                    <div onClick={() => navigate('/account')}>
                      <p className="dropdown-txt">View Account Settings</p>
                    </div>
                    <div onClick={handleLogout}>
                      <p className="dropdown-txt">Logout</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={() => navigate('/signup')}>
                      <p className="dropdown-txt">Sign Up</p>
                    </div>
                    <div onClick={() => navigate('/login')}>
                      <p className="dropdown-txt">Login</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
