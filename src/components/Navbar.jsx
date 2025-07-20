// src/components/Navbar/Navbar.jsx
import React from 'react';
import './Navbar.css';

const Navbar = ({ username, totalRepos }) => {
  return (
    <nav className="navbar">
      <h2 className="navbar-title">GitHub Tracker</h2>
      <div className="navbar-info">
        <span>@{username}</span>
        <span>Total Repos: {totalRepos}</span>
      </div>
    </nav>
  );
};

export default Navbar;
