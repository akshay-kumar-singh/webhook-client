import React from 'react';
import './EventCard.css';

const EventCard = ({ formatted }) => {
  return (
    <div className="event-card">
      {formatted.split('\n').map((line, i) => (
        <p key={i}>{line}</p>
      ))}
    </div>
  );
};

export default EventCard;
