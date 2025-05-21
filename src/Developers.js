import React from 'react';
import './Developers.css';

const developers = [
  {
    name: 'Blacer, Dionne Catherine',
    role: 'Developer',
    img: '/assets/devs/juan.jpg',
  },
  {
    name: 'Hernandez, Jose Maria',
    role: 'Developer',
    img: '/assets/devs/maria.jpg',
  },
    {
    name: 'Joaquin, Jelsie Kianna',
    role: 'Developer',
    img: '/assets/devs/maria.jpg',
  }
];

const Developers = () => (
  <div className="developers-page">
    <h1>Meet the Developers</h1>
    <div className="dev-grid">
      {developers.map((dev, index) => (
        <div className="dev-card" key={index}>
          <img src={dev.img} alt={dev.name} />
          <h3>{dev.name}</h3>
          <p>{dev.role}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Developers;
