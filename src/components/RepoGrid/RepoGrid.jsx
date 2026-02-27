import React from "react";
import { motion } from "framer-motion";
import "./RepoGrid.css";

const LANGUAGE_COLORS = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "##701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Vue: "#41b883",
  SCSS: "#c6538c",
  EJS: "#a91e50",
  Jupyter: "#DA5B0B",
};

const RepoGrid = ({ repos, loading }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.03 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  };

  return (
    <motion.div
      className="repo-grid-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="repo-grid-header">
        <div className="repo-grid-title-section">
          <h3 className="repo-grid-title">
            <span className="repo-grid-icon">📚</span>
            All Repositories
          </h3>
          <p className="repo-grid-subtitle">
            {repos?.length || 0} repositories • Click to view on GitHub
          </p>
        </div>
      </div>
      <div className="repo-grid-body">
        {loading ? (
          <div className="repo-grid-loading">
            <div className="repo-grid-spinner"></div>
            <span>Loading repositories...</span>
          </div>
        ) : !repos || repos.length === 0 ? (
          <div className="repo-grid-empty">
            <span className="repo-grid-empty-icon">📦</span>
            <p>No repositories found</p>
          </div>
        ) : (
          <div className="repo-grid-scroll">
            <motion.div
              className="repo-cards-list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {repos.map((repo) => (
                <motion.a
                  key={repo.fullName}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="repo-card-link"
                  variants={itemVariants}
                >
                  <div className="repo-card-inner">
                    <div className="repo-card-left">
                      <h4 className="repo-card-name">{repo.name}</h4>
                      {repo.language && (
                        <span className="repo-language">
                          <span
                            className="language-dot"
                            style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || "#94a3b8" }}
                          />
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <div className="repo-card-right">
                      <span className={`repo-visibility-badge ${repo.private ? "private" : "public"}`}>
                        {repo.private ? "🔒 Private" : "🌍 Public"}
                      </span>
                      <div className="repo-card-stats">
                        <span className="repo-stat">⭐ {repo.stars || 0}</span>
                        <span className="repo-stat">🍴 {repo.forks || 0}</span>
                      </div>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RepoGrid;
