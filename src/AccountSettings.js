import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './AccountSettings.css';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }

      const currentUser = session?.user;
      setUser(currentUser);

      if (currentUser) {
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
        } else {
          setProfile(userProfile);
          setFirstName(userProfile.first_name);
          setLastName(userProfile.last_name);
        }
      }
    };

    getUserData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('Update error:', error);
      setMessage('Update failed. Please try again.');
    } else {
      setMessage('Profile updated successfully!');
      setProfile((prev) => ({
        ...prev,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }));
    }

    setLoading(false);
  };

  if (!user || !profile) {
    return <div className="account-settings">Loading account details...</div>;
  }

  return (
    <div className="account-settings-container">
      <div className="account-settings">
        <h2>Account Settings</h2>
        <div className="account-info">
          <p><strong>Email:</strong> {user.email}</p>

          <label>
            <strong>First Name:</strong>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
            />
          </label>

          <label>
            <strong>Last Name:</strong>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
            />
          </label>

          <p><strong>Joined On:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>

        <button onClick={handleUpdate} className="update-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        {message && <p className="update-message">{message}</p>}
      </div>
    </div>
  );
};

export default AccountSettings;
