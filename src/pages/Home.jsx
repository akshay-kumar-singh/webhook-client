import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard/EventCard";
import Navbar from "../components/Navbar/Navbar";
import FilterBar from "../components/FilterBar/FilterBar";
import Pagination from "../components/Pagination/Pagination";
import ActivityChart from "../components/ActivityChart/ActivityChart";
// import EventDistributionChart from "../components/EventDistributionChart/EventDistributionChart";
import TopRepos from "../components/TopRepos/TopRepos";
import RepoGrid from "../components/RepoGrid/RepoGrid";
import {
  fetchEventsFromServer,
  fetchCodeStats,
  fetchUserReposAndData,
  fetchTotalLinesOfCode,
  fetchStreakData,
  fetchRepoStats,
  fetchActivityTrends,
  fetchEventDistribution,
} from "../api/eventApi";
import SkeletonLoader from "../components/SkeletonLoader/SkeletonLoader";
import Footer from "../components/Footer/Footer";
import "./Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ repo: "", action: "" });
  const [stats, setStats] = useState({
    totalEvents: 0,
    linesOfCode: 0,
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    totalRepos: 0,
    user: null,
    repos: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const eventsPerPage = 8;

  // New state for charts & repos
  const [trendData, setTrendData] = useState({ labels: [], events: [], linesChanged: [] });
  const [timeRange, setTimeRange] = useState("7d");
  const [distributionData, setDistributionData] = useState({ labels: [], values: [] });
  const [repoStats, setRepoStats] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Calculate pagination display info
  const getPaginationInfo = () => {
    if (totalItems === 0) {
      return { start: 0, end: 0, total: 0 };
    }
    const start = (currentPage - 1) * eventsPerPage + 1;
    const end = Math.min(currentPage * eventsPerPage, totalItems);
    return { start, end, total: totalItems };
  };

  const paginationInfo = getPaginationInfo();

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const data = await fetchStreakData();
        setCurrentStreak(data.currentStreak);
        setLongestStreak(data.longestStreak);
      } catch (err) {
        console.error("Failed to load streak", err);
      }
    };
    loadStreak();
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const data = await fetchUserReposAndData();
        setUserData(data);
      } catch (error) {
        console.error("Error loading user data:", error);
        setUserData({
          totalRepos: 0,
          user: { login: "akshay-kumar-singh" },
          repos: [],
        });
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const codeStats = await fetchTotalLinesOfCode();
        const eventStats = await fetchCodeStats();

        setStats((prev) => ({
          ...prev,
          totalEvents: eventStats.totalEvents,
          linesOfCode: codeStats.totalLines,
        }));
      } catch (error) {
        console.error("Error loading stats:", error);
        setError("Failed to load statistics");
      }
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchEventsFromServer({
          page: currentPage,
          limit: eventsPerPage,
          repo: filters.repo,
          action: filters.action,
          search: searchText
        });
        setEvents(data?.events || (Array.isArray(data) ? data : []));
        setTotalItems(data?.totalEvents || (Array.isArray(data) ? data.length : 0));
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    
    // Simple debounce to prevent aggressive fetching while typing
    const timeoutId = setTimeout(() => {
      loadEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [currentPage, filters, searchText]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchText]);

  // Load chart data
  useEffect(() => {
    const loadChartData = async () => {
      setChartLoading(true);
      try {
        const [trends, distribution, stats] = await Promise.all([
          fetchActivityTrends(timeRange),
          fetchEventDistribution(),
          fetchRepoStats(),
        ]);
        setTrendData(trends);
        setDistributionData(distribution);
        setRepoStats(stats);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setChartLoading(false);
      }
    };
    loadChartData();
  }, [timeRange]);

  const repoList = [
    ...new Set(repoStats.map((r) => r.name)),
  ].filter(Boolean);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (error && !userData.user) {
    return (
      <div className="app-container">
        <div className="error-message">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            <span>🔄</span>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar
        username={userData.user?.login || "akshay-kumar-singh"}
        totalRepos={userData.totalRepos}
        avatarUrl={userData.user?.avatar_url}
        userFullName={userData.user?.name}
        bio={userData.user?.bio}
        followers={userData.user?.followers}
        following={userData.user?.following}
        stats={stats}
        loading={loading}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />

      <main className="main-content">
        {/* Charts Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
              Dashboard Overview
              <span className="title-accent"></span>
            </h2>
          </div>

          <div className="charts-row">
            <div className="chart-col chart-col-wide">
              <ActivityChart
                trendData={trendData}
                timeRange={timeRange}
                onTimeRangeChange={handleTimeRangeChange}
                loading={chartLoading}
              />
            </div>
            {/* <div className="chart-col chart-col-narrow">
              <EventDistributionChart
                distributionData={distributionData}
                loading={chartLoading}
              />
            </div> */}
          </div>

          <div className="charts-row charts-row-bottom">
            <div className="chart-col chart-col-half">
              <TopRepos repoStats={repoStats} loading={chartLoading} />
            </div>
            <div className="chart-col chart-col-half">
              <RepoGrid repos={userData.repos} loading={!userData.user} />
            </div>
          </div>
        </section>

        {/* Activity Section */}
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">⚡</span>
              Recent Activity
              <span className="title-accent"></span>
            </h2>
          </div>

          <FilterBar
            repos={repoList}
            onFilterChange={(type, value) =>
              setFilters((prev) => ({ ...prev, [type]: value }))
            }
            onSearchChange={setSearchText}
            disabled={loading}
            searchPlaceholder="Search commits or repositories..."
          />

          <div className="events-wrapper">
            {loading ? (
              <div className="loading-section">
                <div className="loading-header">
                  <div className="loading-spinner"></div>
                  <span>Loading your activities...</span>
                </div>
                <SkeletonLoader count={5} />
              </div>
            ) : error ? (
              <div className="error-section">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Something went wrong</h3>
                <p className="error-text">{error}</p>
                <p className="error-subtext">
                  Some features may not work properly. Try refreshing the page.
                </p>
              </div>
            ) : events.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No matching events found</h3>
                <p>
                  {searchText || filters.repo || filters.action
                    ? "Try adjusting your search terms or filters to find more results"
                    : "No recent activity to display. Your commits will appear here."}
                </p>
                {(searchText || filters.repo || filters.action) && (
                  <button
                    className="clear-filters-btn"
                    onClick={() => {
                      setSearchText("");
                      setFilters({ repo: "", action: "" });
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="results-summary">
                  <span className="results-count">
                    {paginationInfo.total > 0 ? (
                      <>
                        Showing {paginationInfo.start}-{paginationInfo.end} of{" "}
                        {paginationInfo.total} activities
                      </>
                    ) : (
                      "No activities found"
                    )}
                  </span>
                </div>

                <div className="event-grid">
                  {events.map((event, index) => (
                    <EventCard
                      key={`${event.repo}-${event.timestamp}-${index}`}
                      formatted={event.formatted}
                      event={event}
                    />
                  ))}
                </div>

                {totalItems > eventsPerPage && (
                  <div className="pagination-wrapper">
                    <Pagination
                      eventsPerPage={eventsPerPage}
                      totalEvents={totalItems}
                      currentPage={currentPage}
                      paginate={setCurrentPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;