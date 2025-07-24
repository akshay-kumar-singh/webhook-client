import React from "react";
import { motion } from "framer-motion";
import "./FilterBar.css";

const FilterBar = ({
  repos,
  onFilterChange,
  onSearchChange,
  disabled,
  searchPlaceholder,
}) => {
  return (
    <motion.div
      className={`filter-bar ${disabled ? "loading" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="search-input">
        <span className="input-icon">🔍</span>
        <input
          type="text"
          placeholder={searchPlaceholder || "Search repositories..."}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled}
        />
      </div>

      <div className="filter-select">
        <span className="select-icon">📂</span>
        <select
          onChange={(e) => onFilterChange("repo", e.target.value)}
          disabled={disabled}
        >
          <option value="">All Repositories</option>
          {repos.map((repo, idx) => (
            <option key={idx} value={repo}>
              {repo}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-select">
        <span className="select-icon">⚡</span>
        <select
          onChange={(e) => onFilterChange("action", e.target.value)}
          disabled={disabled}
        >
          <option value="">All Actions</option>
          <option value="push">🚀 Push</option>
          <option value="pull_request">🔄 Pull Request</option>
          <option value="merge">🔀 Merge</option>
        </select>
      </div>
    </motion.div>
  );
};

export default FilterBar;
