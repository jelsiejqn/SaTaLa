import React from 'react';
import './Developers.css';
import id1 from './assets/ID-Dionne.jpg'
import id2 from './assets/ID-Jelsie.PNG'
import id3 from './assets/ID-Jamie.jpg'

const developers = [
  {
    name: 'Blacer, Dionne Catherine',
    role: 'Developer',
    img: id1,
  },
  {
    name: 'Hernandez, Jose Maria',
    role: 'Developer',
    img: id3,
  },
    {
    name: 'Joaquin, Jelsie Kianna',
    role: 'Developer',
    img: id2,
  }
];

const Developers = () => (
  <div className="developers-page">
      <br/ >   <br/ >
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
