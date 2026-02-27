import React from "react";
import { motion } from "framer-motion";
import "./EventCard.css";

const EventCard = ({ formatted, event }) => {
  const getActionIcon = () => {
    switch (event.action) {
      case "push":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        );
      case "pull_request":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M13 6h3a2 2 0 0 1 2 2v7" />
            <line x1="6" y1="9" x2="6" y2="21" />
          </svg>
        );
      case "merge":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 3v14" />
            <path d="M15 3v14" />
            <path d="M3 18h18" />
            <path d="M3 6h18" />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        );
    }
  };

  const getActionColor = () => {
    switch (event.action) {
      case "push":
        return "#3a86ff";
      case "pull_request":
        return "#8338ec";
      case "merge":
        return "#06d6a0";
      default:
        return "#ffbe0b";
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" }
    },
    hover: { y: -5 }
  };

  const iconVariants = {
    hidden: { scale: 0.8 },
    visible: { scale: 1, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="event-card"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <div className="event-header">
        <motion.div
          className="action-icon"
          style={{ backgroundColor: `${getActionColor()}20` }}
          variants={iconVariants}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke={getActionColor()}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {getActionIcon().props.children}
          </svg>
        </motion.div>
        <div className="event-meta">
          <h3 className="repo-name">{event.repo?.split("/")[1] || event.repo}</h3>
          <span className="event-time">
            {new Date(event.timestamp).toLocaleString()}
          </span>
          {(event.from_branch || event.to_branch) && (
            <div className="branch-flow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" />
              </svg>
              <span className="branch-name">{event.from_branch || '—'}</span>
              <span className="branch-arrow">→</span>
              <span className="branch-name">{event.to_branch || '—'}</span>
            </div>
          )}
        </div>
      </div>

      <motion.div 
        className="event-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {formatted.split("\n").map((line, i) => (
          <p className="event-line" key={i}>
            {line}
          </p>
        ))}
      </motion.div>

      <div className="event-footer">
        <span
          className="event-action"
          style={{ backgroundColor: getActionColor() }}
        >
          {event.action.replace("_", " ")}
        </span>
        {event.lines_changed !== undefined && event.lines_changed !== 0 && (
          <span className={`lines-changed ${event.lines_changed > 0 ? 'lines-added' : 'lines-removed'}`}>
            {event.lines_changed > 0 ? '+' : ''}{event.lines_changed.toLocaleString()} lines
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;