// pages/Articles.jsx
import { useState } from "react";
import ArticleList from "../components/Articles/ArticleList.jsx";
import ArticleEditor from "../components/Articles/ArticleEditor.jsx";

export default function Articles({ currentUser }) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const handleEdit = (article) => {
    setEditingArticle(article);
    setShowEditor(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setEditingArticle(null);
  };

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Articles</h1>
        <div>
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
        <div className="card" style={{ marginBottom: "2rem" }}>
          <div className="card-header">
            <h2 className="card-title">
              {editingArticle ? "Edit Article" : "Create New Article"}
            </h2>
            <button className="btn btn-secondary" onClick={handleEditorClose}>
              Cancel
            </button>
          </div>
          <ArticleEditor initial={editingArticle} onSaved={handleEditorClose} />
        </div>
      )}

      <div className="card">
        <ArticleList currentUser={currentUser} onEdit={handleEdit} />
      </div>
    </div>
  );
}
