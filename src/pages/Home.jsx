import React, { useEffect, useState } from "react";
import EventCard from "../components/EventCard/EventCard";
import Navbar from "../components/Navbar/Navbar";
import FilterBar from "../components/FilterBar/FilterBar";
import Pagination from "../components/Pagination/Pagination";
import {
  fetchEventsFromServer,
  fetchCodeStats,
  fetchUserReposAndData,
  fetchTotalLinesOfCode,
  fetchStreakData,
} from "../api/eventApi";
import SkeletonLoader from "../components/SkeletonLoader/SkeletonLoader";
import Footer from "../components/Footer/Footer";
import "./Home.css";

function Home() {
  const [events, setEvents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ repo: "", action: "" });
  const [stats, setStats] = useState({
    totalEvents: 0,
    linesOfCode: 0,
  });
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    totalRepos: 0,
    user: null,
    repos: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filtered.slice(indexOfFirstEvent, indexOfLastEvent);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const data = await fetchStreakData();
        setCurrentStreak(data.currentStreak);
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
        const data = await fetchEventsFromServer();
        setEvents(data);
        setFiltered(data);

        setStats((prev) => ({
          ...prev,
          totalEvents: data.length,
        }));
      } catch (error) {
        console.error("Error loading events:", error);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const { repo, action } = filters;
    const result = events.filter((event) => {
      const matchesRepo = repo ? event.repo?.includes(repo) : true;
      const matchesAction = action ? event.action === action : true;
      const matchesSearch = searchText
        ? event.commit_messages?.some((msg) =>
            msg.toLowerCase().includes(searchText.toLowerCase())
          ) || event.repo?.toLowerCase().includes(searchText.toLowerCase())
        : true;
      return matchesRepo && matchesAction && matchesSearch;
    });
    setFiltered(result);
    setCurrentPage(1);
  }, [filters, searchText, events]);

  const repoList = [
    ...new Set(events.map((e) => e.repo?.split("/")?.[1])),
  ].filter(Boolean);

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
        stats={stats}
        loading={loading}
        currentStreak={currentStreak}
      />

      <main className="main-content">
        <div className="activity-section">
          <div className="section-header">
            <h2 className="section-title">
              <span className="title-icon">📊</span>
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
            ) : currentEvents.length === 0 ? (
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
                    Showing {currentEvents.length} of {filtered.length}{" "}
                    activities
                  </span>
                </div>

                <div className="event-grid">
                  {currentEvents.map((event, index) => (
                    <EventCard
                      key={`${event.repo}-${event.timestamp}-${index}`}
                      formatted={event.formatted}
                      event={event}
                    />
                  ))}
                </div>

                {filtered.length > eventsPerPage && (
                  <div className="pagination-wrapper">
                    <Pagination
                      eventsPerPage={eventsPerPage}
                      totalEvents={filtered.length}
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

//testing