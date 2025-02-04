import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('/api/events', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(response => setEvents(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;
