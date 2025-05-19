// src/StatsSection.js
import React from 'react';
import './HomeStats.css';
import volunteerIcon from './assets/icon_volunteers.png';
import plantIcon from './assets/icon_plant.png';
import actionIcon from './assets/icon_action.png';

const stats = [
  {
    id: 1,
    image: volunteerIcon, 
    number: 78,
    title: 'Volunteers Strong!',
    description: 'Community members who signed up to make a difference, one tree at a time.',
  },
  {
    id: 2,
    image: plantIcon,
    number: 354,
    title: 'Trees Planted',
    description: 'Our ever-growing forest thanks to your support and dedication.',
  },
  {
    id: 3,
    image: actionIcon,
    number: 12,
    title: 'Barangays Reached',
    description: 'Across the region, we’ve started healing one patch at a time.',
  },
];

const HomeStats = () => {
  return (
    <section className="stats-section">
      <div className="stats-container">
        {stats.map((item) => (
          <div key={item.id} className="stats-card">
            <img src={item.image} alt={item.title} className="stats-icon" />
            <h2 className="stats-number">{item.number}</h2>
            <h3 className="stats-title">{item.title}</h3>
            <p className="stats-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeStats;
