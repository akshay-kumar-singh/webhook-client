// SkeletonLoader.js
import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ count = 1 }) => {
  return (
    <div className="skeleton-grid">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-avatar"></div>
            <div className="skeleton-text">
              <div className="skeleton-line short"></div>
              <div className="skeleton-line shorter"></div>
            </div>
          </div>
          <div className="skeleton-content">
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line"></div>
            <div className="skeleton-line half"></div>
          </div>
          <div className="skeleton-footer">
            <div className="skeleton-tag"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;