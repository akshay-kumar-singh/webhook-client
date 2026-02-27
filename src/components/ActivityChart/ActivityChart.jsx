import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { motion } from "framer-motion";
import "./ActivityChart.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatFullDate = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const getStepSize = (max) => {
  if (max <= 10) return 2;
  if (max <= 30) return 5;
  if (max <= 50) return 10;
  if (max <= 100) return 20;
  if (max <= 250) return 50;
  if (max <= 500) return 100;
  if (max <= 1000) return 200;
  if (max <= 5000) return 1000;
  return Math.ceil(max / 5 / 1000) * 1000;
};

const ActivityChart = ({ trendData, timeRange, onTimeRangeChange, loading }) => {
  const chartRef = useRef(null);

  const rawLabels = trendData.labels || [];
  const rawEvents = trendData.events || [];
  const rawLines = trendData.linesChanged || [];

  let labels, events, lines, tooltipDates;

  if (timeRange === "1y") {
    // Aggregate daily data into months — always show Jan to Dec
    const buckets = {};
    rawLabels.forEach((dateStr, i) => {
      const d = new Date(dateStr);
      const month = d.getMonth(); // 0-11
      if (!buckets[month]) {
        buckets[month] = { ev: 0, ln: 0 };
      }
      buckets[month].ev += rawEvents[i] || 0;
      buckets[month].ln += rawLines[i] || 0;
    });
    const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    labels = MONTHS; // Jan, Feb, Mar ... Dec
    events = MONTHS.map((_, i) => buckets[i]?.ev || 0);
    lines = MONTHS.map((_, i) => buckets[i]?.ln || 0);
    tooltipDates = FULL_MONTHS;
  } else {
    // 7 days — show "Mon", "Tue" or short date
    labels = rawLabels.map((dateStr) => {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
    });
    events = rawEvents;
    lines = rawLines;
    tooltipDates = rawLabels.map(formatFullDate);
  }

  const maxVal = Math.max(...events, ...lines, 0);
  const step = getStepSize(maxVal);

  const createGradient = (ctx, r, g, b) => {
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
    grad.addColorStop(0.7, `rgba(${r},${g},${b},0.04)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    return grad;
  };

  const small = labels.length <= 10;

  const data = {
    labels,
    datasets: [
      {
        label: "Events",
        data: events,
        borderColor: "#3b82f6",
        backgroundColor: (ctx) => createGradient(ctx.chart.ctx, 59, 130, 246),
        borderWidth: 2.5,
        pointRadius: small ? 5 : 4,
        pointHoverRadius: 8,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Lines Changed",
        data: lines,
        borderColor: "#8b5cf6",
        backgroundColor: (ctx) => createGradient(ctx.chart.ctx, 139, 92, 246),
        borderWidth: 2.5,
        pointRadius: small ? 5 : 4,
        pointHoverRadius: 8,
        pointBackgroundColor: "#8b5cf6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 12, weight: "600" },
          color: "#64748b",
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(99, 102, 241, 0.35)",
        borderWidth: 1,
        cornerRadius: 12,
        padding: 16,
        titleFont: { family: "'Inter', sans-serif", size: 13, weight: "700" },
        bodyFont: { family: "'Inter', sans-serif", size: 12, weight: "500" },
        bodySpacing: 6,
        displayColors: true,
        usePointStyle: true,
        caretSize: 6,
        caretPadding: 8,
        callbacks: {
          title: (ctx) => {
            const idx = ctx[0]?.dataIndex;
            return tooltipDates[idx] || ctx[0]?.label || "";
          },
          label: (ctx) => {
            const v = ctx.raw;
            const prefix = ctx.dataset.label === "Lines Changed" && v > 0 ? "+" : "";
            return ` ${ctx.dataset.label}: ${prefix}${v.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 12, weight: "600" },
          color: "#64748b",
          maxRotation: 0,
          autoSkip: false,
        },
        border: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(226, 232, 240, 0.5)", drawBorder: false },
        ticks: {
          font: { family: "'Inter', sans-serif", size: 11, weight: "500" },
          color: "#94a3b8",
          padding: 10,
          stepSize: step,
          callback: (v) => (v >= 1000 ? `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k` : v),
        },
        border: { display: false },
      },
    },
  };

  const ranges = [
    { label: "7 Days", value: "7d" },
    { label: "1 Year", value: "1y" },
  ];

  return (
    <motion.div
      className="activity-chart-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="chart-header">
        <div className="chart-title-section">
          <h3 className="chart-title">
            <span className="chart-icon">📈</span>
            Activity Trends
          </h3>
          <p className="chart-subtitle">Events and code changes over time</p>
        </div>
        <div className="time-range-selector">
          {ranges.map((r) => (
            <button
              key={r.value}
              className={`range-btn ${timeRange === r.value ? "active" : ""}`}
              onClick={() => onTimeRangeChange(r.value)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="chart-body">
        {loading ? (
          <div className="chart-loading">
            <div className="chart-loading-spinner"></div>
            <span>Loading trends...</span>
          </div>
        ) : labels.length === 0 ? (
          <div className="chart-empty">
            <span className="empty-icon">📊</span>
            <p>No activity data for this period</p>
          </div>
        ) : (
          <Line ref={chartRef} data={data} options={options} />
        )}
      </div>
    </motion.div>
  );
};

export default ActivityChart;
