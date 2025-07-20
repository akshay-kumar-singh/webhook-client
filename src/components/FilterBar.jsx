// src/components/FilterBar/FilterBar.jsx
import React from 'react';
import './FilterBar.css';

const FilterBar = ({ repos, onFilterChange, onSearchChange }) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="🔍 Search commits..."
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select onChange={(e) => onFilterChange('repo', e.target.value)}>
        <option value="">All Repos</option>
        {repos.map((repo, idx) => (
          <option key={idx} value={repo}>
            {repo}
          </option>
        ))}
      </select>

      <select onChange={(e) => onFilterChange('action', e.target.value)}>
        <option value="">All Actions</option>
        <option value="push">Push</option>
        <option value="pull_request">Pull Request</option>
        <option value="merge">Merge</option>
      </select>
    </div>
  );
};

export default FilterBar;
