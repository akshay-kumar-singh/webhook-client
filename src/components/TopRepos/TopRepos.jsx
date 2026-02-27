import React from "react";
import { motion } from "framer-motion";
import "./TopRepos.css";

const TopRepos = ({ repoStats, loading }) => {
  const getTimeAgo = (dateStr) => {
    if (!dateStr) return "N/A";
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const maxEvents = Math.max(...(repoStats || []).map((r) => r.eventCount || 0), 1);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="top-repos-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="top-repos-header">
        <h3 className="top-repos-title">
          <span className="top-repos-icon">🏆</span>
          Top Repositories
        </h3>
        <p className="top-repos-subtitle">Most active by event count</p>
      </div>
      <div className="top-repos-body">
        {loading ? (
          <div className="top-repos-loading">
            <div className="top-repos-spinner"></div>
            <span>Loading repos...</span>
          </div>
        ) : !repoStats || repoStats.length === 0 ? (
          <div className="top-repos-empty">
            <span className="top-repos-empty-icon">📦</span>
            <p>No repository stats yet</p>
          </div>
        ) : (
          <motion.div
            className="top-repos-list"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {repoStats.map((repo, index) => (
              <motion.div
                key={repo.fullName}
                className="top-repo-item"
                variants={itemVariants}
              >
                <div className="repo-rank">
                  <span className="rank-number">#{index + 1}</span>
                </div>
                <div className="repo-details">
                  <div className="repo-name-row">
                    <h4 className="repo-item-name">{repo.name}</h4>
                    <span className="repo-last-active"><span className="active">Active : </span>{getTimeAgo(repo.lastActivity)}</span>
                  </div>
                  <div className="repo-bar-container">
                    <motion.div
                      className="repo-progress-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${(repo.eventCount / maxEvents) * 100}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      style={{
                        background: `linear-gradient(90deg, ${
                          index === 0
                            ? "#3b82f6, #6366f1"
                            : index === 1
                            ? "#8b5cf6, #a855f7"
                            : index === 2
                            ? "#06d6a0, #14b8a6"
                            : index === 3
                            ? "#f59e0b, #f97316"
                            : "#ec4899, #f43f5e"
                        })`,
                      }}
                    />
                  </div>
                  <div className="repo-metrics">
                    <span className="metric">
                      <span className="metric-icon">⚡</span>
                      {repo.eventCount} events
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TopRepos;
