// components/Articles/ArticleList.jsx
import { useArticles, useDeleteArticle } from "../../api/hooks.js";

export default function ArticleList({ currentUser, onEdit }) {
  const { data, isLoading } = useArticles();
  const deleteMutation = useDeleteArticle();

  if (isLoading) return <div>Loading articles...</div>;

  return (
    <div>
      <div className="card-header">
        <h3 className="card-title">All Articles</h3>
      </div>

      <div className="grid">
        {data?.items?.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
          >
            No articles yet.{" "}
            {currentUser
              ? "Create your first article!"
              : "Sign in to create articles."}
          </div>
        ) : (
          data?.items?.map((article) => (
            <div key={article._id} className="article-item">
              <div className="article-meta">
                <span>By User {article.userId}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="article-title">{article.title}</h3>

              <div className="article-body">
                {article.body.length > 200
                  ? `${article.body.substring(0, 200)}...`
                  : article.body}
              </div>

              {currentUser && article.userId === currentUser.id && (
                <div className="article-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => onEdit(article)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      if (confirm("Delete this article?")) {
                        deleteMutation.mutate(article._id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
