// pages/Dashboard.jsx - Updated version
import { useState } from "react";
import StatsChart from "../components/Stats/StatsChart.jsx";
import ArticleList from "../components/Articles/ArticleList.jsx";
import ArticleEditor from "../components/Articles/ArticleEditor.jsx";
import UserModal from "../components/Users/UserModal.jsx";
import { useStats, useArticles } from "../api/hooks.js";
import UserList from "../components/Users/UsersList.jsx";

export default function Dashboard({ currentUser }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterUserId, setFilterUserId] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const { data: stats } = useStats();
  const { data: articlesData } = useArticles({ userId: filterUserId });

  return (
    <div>
      {/* Stats Section */}
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

      {/* Chart Section */}
      <div className="chart-container">
        <StatsChart />
      </div>

      {/* User List Section */}
      <div className="card">
        <UserList onUserClick={setSelectedUser} />
      </div>

      {/* Article Management Section */}
      <div className="card">
        <div className="card-header">
          <h2>Article Management</h2>
          <div>
            <select
              value={filterUserId}
              onChange={(e) => setFilterUserId(e.target.value)}
              className="form-select"
            >
              <option value="">All Users</option>
              {/* Add user options dynamically */}
            </select>
            {currentUser && (
              <button
                className="btn btn-primary"
                onClick={() => setShowEditor(true)}
              >
                Create Article
              </button>
            )}
          </div>
        </div>

        {showEditor && (
          <ArticleEditor
            initial={editingArticle}
            onSaved={() => {
              setShowEditor(false);
              setEditingArticle(null);
            }}
          />
        )}

        <ArticleList
          currentUser={currentUser}
          filterUserId={filterUserId}
          onEdit={(article) => {
            setEditingArticle(article);
            setShowEditor(true);
          }}
        />
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          articles={articlesData?.items}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
