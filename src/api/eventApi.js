import { BACKEND_URL } from "../config/constants";

export const fetchEventsFromServer = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/events`);
    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchEventsFromServer:", error);
    return [];
  }
};

export const fetchRepoStats = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/events/stats`);
    if (!res.ok) throw new Error("Failed to fetch repo stats");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchRepoStats:", error);
    return [];
  }
};

export const fetchActivityTrends = async (range) => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/webhook/events/trends?range=${range}`
    );
    if (!res.ok) throw new Error("Failed to fetch activity trends");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchActivityTrends:", error);
    return { labels: [], events: [], linesChanged: [] };
  }
};

export const fetchEventDistribution = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/events/distribution`);
    if (!res.ok) throw new Error("Failed to fetch event distribution");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchEventDistribution:", error);
    return { labels: [], values: [] };
  }
};

export const fetchUserReposAndData = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/repos`);
    if (!res.ok) throw new Error("Failed to fetch user repos");
    const data = await res.json();
    return {
      totalRepos: data.totalRepos,
      repos: data.repos,
      user: data.user,
    };
  } catch (err) {
    console.error("❌ Error in fetchUserReposAndData:", err);
    return {
      totalRepos: 0,
      repos: [],
      user: null,
    };
  }
};

export const fetchUserRepoCount = async () => {
  try {
    const data = await fetchUserReposAndData();
    return data.totalRepos;
  } catch (err) {
    console.error("❌ Error in fetchUserRepoCount:", err);
    return 0;
  }
};

export const fetchTotalLinesOfCode = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/repos/total-lines`);
    if (!res.ok) throw new Error("Failed to fetch total lines of code");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchTotalLinesOfCode:", error);
    return { totalLines: 0, totalRepositories: 0, totalEvents: 0 };
  }
};

export const fetchCodeStats = async () => {
  try {
    const data = await fetchTotalLinesOfCode();
    return {
      totalLines: data.totalLines,
      totalEvents: data.totalEvents,
      totalRepositories: data.totalRepositories,
    };
  } catch (error) {
    console.error("❌ Error in fetchCodeStats:", error);
    return { totalLines: 0, totalEvents: 0, totalRepositories: 0 };
  }
};

export const fetchStreakData = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/webhook/streak`);
    if (!res.ok) throw new Error("Failed to fetch streak");
    return await res.json();
  } catch (error) {
    console.error("❌ Error in fetchStreakData:", error);
    return { currentStreak: 0, longestStreak: 0 };
  }
};
