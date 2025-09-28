// pages/Dashboard.jsx
import StatsChart from "../components/Stats/StatsChart.jsx";
import { useStats } from "../api/hooks.js";

export default function Dashboard({ currentUser }) {
  const { data: stats } = useStats();

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Dashboard</h1>
        <p style={{ color: "#6b7280", margin: 0 }}>
          Overview of your content management system
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats?.usersTotal || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats?.articlesTotal || 0}</div>
          <div className="stat-label">Total Articles</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {stats?.letters
              ? Object.values(stats.letters).reduce((a, b) => a + b, 0)
              : 0}
          </div>
          <div className="stat-label">Total Letters (R,I,M,E,S)</div>
        </div>
      </div>

      <div className="chart-container">
        <h2
          style={{
            marginBottom: "1.5rem",
            fontSize: "1.25rem",
            fontWeight: "600",
          }}
        >
          Letter Frequency Analysis
        </h2>
        <StatsChart />
      </div>

      {!currentUser && (
        <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>Welcome to IBF CMS</h3>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            Sign in to create and manage articles, and contribute to our
            analytics.
          </p>
        </div>
      )}
    </div>
  );
}
