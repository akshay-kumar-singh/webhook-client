// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import './Home.css';

function Home() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ repo: '', action: '' });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:5000/webhook');
        const data = await res.json();
        setEvents(data);
        setFiltered(data);
      } catch (err) {
        console.error('❌ Error fetching events:', err);
      }
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const { repo, action } = filters;
      const result = events.filter((event) => {
        const matchesRepo = repo ? event.repo?.includes(repo) : true;
        const matchesAction = action ? event.action === action : true;
        const matchesSearch = searchText
          ? event.commit_messages?.some((msg) =>
              msg.toLowerCase().includes(searchText.toLowerCase())
            )
          : true;
        return matchesRepo && matchesAction && matchesSearch;
      });

      setFiltered(result);
    };

    applyFilters();
  }, [filters, searchText, events]);

  const repoList = [...new Set(events.map((e) => e.repo?.split('/')?.[1]))].filter(Boolean);

  return (
    <div>
      <Navbar username="akshay-kumar-singh" totalRepos={repoList.length} />
      <FilterBar
        repos={repoList}
        onFilterChange={(type, value) =>
          setFilters((prev) => ({ ...prev, [type]: value }))
        }
        onSearchChange={setSearchText}
      />
      <div className="app-container">
        {filtered.length === 0 ? (
          <p>No matching events found.</p>
        ) : (
          filtered.map((event, index) => (
            <EventCard key={index} formatted={event.formatted} />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
