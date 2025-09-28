// client/src/pages/Dashboard.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useStats, useArticles } from "../api/hooks.js";
import StatsChart from "../components/Stats/StatsChart.jsx";
import ArticleList from "../components/Articles/ArticleList.jsx";
import ArticleEditorModal from "../components/Articles/ArticleEditorModal.jsx";

export default function Dashboard({ currentUser }) {
  // Stats and users
  const { data: stats } = useStats();
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/api/users").then((r) => r.data),
  });

  // Filters + data
  const [filterUserId, setFilterUserId] = useState("");
  const { data: articlesData } = useArticles(
    filterUserId ? { userId: filterUserId } : undefined
  );

  // Modal editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const openCreate = () => {
    setEditingArticle(null);
    setEditorOpen(true);
  };
  const openEdit = (article) => {
    setEditingArticle(article);
    setEditorOpen(true);
  };
  const closeEditor = () => setEditorOpen(false);
  const onSaved = () => {
    // react-query hooks in useCreateArticle/useUpdateArticle already invalidate stats and articles
  };

  return (
    <div className="grid grid-2">
      {/* Left: Stats and Chart */}
      <div className="card">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.usersTotal || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.articlesTotal || 0}</div>
            <div className="stat-label">Total Articles</div>
          </div>
        </div>

        <div className="chart-container">
          <StatsChart />
        </div>
      </div>

      {/* Right: Users and Article Management */}
      <div className="grid">
        {/* Active users */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Active Users ({users?.length || 0})</h3>
          </div>
          <div className="grid-2">
            {users?.map((u) => (
              <div
                key={u._id}
                style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}
              >
                <div className="user-avatar">
                  {u.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{u.username}</div>
                  <div style={{ color: "#64748b", fontSize: "0.85rem" }}>
                    {u.position} • {u.country}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Article Management */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Article Management</h3>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <select
                className="form-select"
                value={filterUserId}
                onChange={(e) => setFilterUserId(e.target.value)}
                aria-label="Filter by user"
              >
                <option value="">All Users</option>
                {users?.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.username} ({u.articleCount})
                  </option>
                ))}
              </select>
              {currentUser && (
                <button className="btn btn-primary" onClick={openCreate}>
                  Create Article
                </button>
              )}
            </div>
          </div>

          <h4 style={{ marginBottom: "0.75rem" }}>All Articles</h4>
          <ArticleList
            currentUser={currentUser}
            onEdit={openEdit}
            filterUserId={filterUserId}
          />
        </div>
      </div>

      {/* Editor Modal (Create/Edit) */}
      <ArticleEditorModal
        open={editorOpen}
        initial={editingArticle}
        onClose={closeEditor}
        onSaved={onSaved}
      />
    </div>
  );
}
