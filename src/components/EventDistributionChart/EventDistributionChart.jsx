import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { motion } from "framer-motion";
import "./EventDistributionChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#06d6a0",
  "#f59e0b",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

const EventDistributionChart = ({ distributionData, loading }) => {
  const data = {
    labels: (distributionData.labels || []).map((label) =>
      label.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())
    ),
    datasets: [
      {
        data: distributionData.values || [],
        backgroundColor: COLORS.slice(0, distributionData.labels?.length || 0),
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverBorderWidth: 4,
        hoverOffset: 8,
      },
    ],
  };

  const total = (distributionData.values || []).reduce((a, b) => a + b, 0);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "rgba(59, 130, 246, 0.3)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 14,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: "700",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return ` ${value} events (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <motion.div
      className="distribution-chart-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="dist-chart-header">
        <h3 className="dist-chart-title">
          <span className="dist-chart-icon">🎯</span>
          Event Distribution
        </h3>
        <p className="dist-chart-subtitle">Breakdown by event type</p>
      </div>
      <div className="dist-chart-body">
        {loading ? (
          <div className="dist-chart-loading">
            <div className="dist-loading-spinner"></div>
            <span>Loading distribution...</span>
          </div>
        ) : (distributionData.labels || []).length === 0 ? (
          <div className="dist-chart-empty">
            <span className="dist-empty-icon">🎯</span>
            <p>No event data yet</p>
          </div>
        ) : (
          <div className="dist-chart-content">
            <div className="doughnut-wrapper">
              <Doughnut data={data} options={options} />
              <div className="doughnut-center">
                <span className="center-value">{total}</span>
                <span className="center-label">Total</span>
              </div>
            </div>
            <div className="dist-legend">
              {(distributionData.labels || []).map((label, index) => {
                const value = distributionData.values[index];
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return (
                  <div className="legend-item" key={label}>
                    <div
                      className="legend-color"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <div className="legend-info">
                      <span className="legend-label">
                        {label.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      <span className="legend-value">
                        {value} <span className="legend-pct">({percentage}%)</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventDistributionChart;
