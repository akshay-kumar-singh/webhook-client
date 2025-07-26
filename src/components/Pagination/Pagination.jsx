import React from "react";
import { motion } from "framer-motion";
import "./Pagination.css";

const Pagination = ({ eventsPerPage, totalEvents, currentPage, paginate }) => {
  const totalPages = Math.ceil(totalEvents / eventsPerPage);

  if (totalPages <= 1) return null;

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

  // Generate page numbers with ellipsis logic
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add ellipsis where needed
    let prev = 0;
    for (const page of uniqueRange) {
      if (page - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      paginate(page);
    }
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="pagination-container">
      <div className="pagination">
        {/* Previous Button */}
        <motion.button
          onClick={() => canGoPrevious && paginate(currentPage - 1)}
          disabled={!canGoPrevious}
          className={`pagination-button prev ${!canGoPrevious ? 'disabled' : ''}`}
          variants={buttonVariants}
          whileHover={canGoPrevious ? "hover" : {}}
          whileTap={canGoPrevious ? "tap" : {}}
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
          <span className="button-text">Previous</span>
        </motion.button>

        {/* Page Numbers */}
        <div className="page-numbers">
          {pageNumbers.map((number, index) => {
            if (number === '...') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  ...
                </span>
              );
            }

            return (
              <motion.button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`pagination-button page-number ${
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
            );
          })}
        </div>

        {/* Next Button */}
        <motion.button
          onClick={() => canGoNext && paginate(currentPage + 1)}
          disabled={!canGoNext}
          className={`pagination-button next ${!canGoNext ? 'disabled' : ''}`}
          variants={buttonVariants}
          whileHover={canGoNext ? "hover" : {}}
          whileTap={canGoNext ? "tap" : {}}
        >
          <span className="button-text">Next</span>
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

      {/* Page Info */}
      <div className="pagination-info">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>
    </nav>
  );
};

export default Pagination;