import React from "react";
import { motion } from "framer-motion";
import "./Pagination.css";

const Pagination = ({ eventsPerPage, totalEvents, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalEvents / eventsPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) return null;

  const buttonVariants = {
    hover: {
      y: -2,
      boxShadow: "0 4px 12px rgba(58, 134, 255, 0.2)",
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
    },
  };

  const activeVariants = {
    active: {
      backgroundColor: "#3a86ff",
      color: "#fff",
      boxShadow: "0 4px 12px rgba(58, 134, 255, 0.3)",
    },
  };

  return (
    <nav className="pagination-container">
      <div className="pagination">
        <motion.button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button prev"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18L9 12L15 6" />
          </svg>
          <span>Previous</span>
        </motion.button>

        <div className="page-numbers">
          {pageNumbers.map((number) => (
            <motion.button
              key={number}
              onClick={() => paginate(number)}
              className={`pagination-button ${
                currentPage === number ? "active" : ""
              }`}
              variants={
                currentPage === number ? activeVariants : buttonVariants
              }
              animate={currentPage === number ? "active" : ""}
              whileHover="hover"
              whileTap="tap"
            >
              {number}
            </motion.button>
          ))}
        </div>

        <motion.button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === pageNumbers.length}
          className="pagination-button next"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span>Next</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18L15 12L9 6" />
          </svg>
        </motion.button>
      </div>
    </nav>
  );
};

export default Pagination;
