import React from "react";
import { motion } from "framer-motion";
import "./Navbar.css";

const Navbar = ({
  username,
  totalRepos,
  avatarUrl,
  userFullName,
  bio,
  followers,
  following,
  stats,
  loading,
  currentStreak,
  longestStreak,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const statCards = [
    {
      emoji: "📚",
      value: loading ? "--" : totalRepos.toLocaleString(),
      label: "Repositories",
    },
    {
      emoji: "⚡",
      value: loading ? "--" : stats.totalEvents.toLocaleString(),
      label: "Events",
    },
    {
      emoji: "💻",
      value: loading ? "--" : `${(stats.linesOfCode / 1000).toFixed(1)}k`,
      label: "Lines of Code",
    },
    // {
    //   emoji: "👥",
    //   value: loading ? "--" : (followers ?? 0).toLocaleString(),
    //   label: "Followers",
    // },
    // {
    //   emoji: "👤",
    //   value: loading ? "--" : (following ?? 0).toLocaleString(),
    //   label: "Following",
    // },
    {
      emoji: "🏆",
      value: loading ? "--" : longestStreak,
      label: "Highest Streak",
    },
    {
      emoji: "🔥",
      value: loading ? "--" : currentStreak,
      label: "Current Streak",
    },
  ];

  return (
    <motion.header
      className="navbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar-content">
        <motion.div className="user-profile" variants={itemVariants}>
          <motion.div
            className="avatar-container"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {avatarUrl ? (
              <motion.img
                src={avatarUrl}
                alt={`${username}'s avatar`}
                className="avatar"
                variants={pulseVariants}
                animate="pulse"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <motion.div
              className="avatar-fallback"
              style={{ display: avatarUrl ? "none" : "flex" }}
              variants={pulseVariants}
              animate="pulse"
            >
              {username?.charAt(0).toUpperCase()}
            </motion.div>
          </motion.div>
          <div className="user-info">
            <motion.h2
              className="username"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              👤 @{username}
            </motion.h2>
            {userFullName && (
              <motion.p className="full-name" variants={itemVariants}>
                {userFullName}
              </motion.p>
            )}
            {bio && (
              <motion.p className="user-bio" variants={itemVariants}>
                {bio}
              </motion.p>
            )}
          </div>
        </motion.div>

        <motion.div className="stats-container" variants={itemVariants}>
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="stat-emoji"
                animate={{
                  rotate: [0, 10, -10, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.5,
                  },
                }}
              >
                {card.emoji}
              </motion.div>
              <motion.span
                className="stat-value"
                animate={loading ? { opacity: [0.5, 1, 0.5] } : {}}
                transition={loading ? { duration: 1.5, repeat: Infinity } : {}}
              >
                {card.value}
              </motion.span>
              <span className="stat-label">{card.label}</span>
              <motion.div
                className={`stat-gradient stat-gradient-${index}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Navbar;