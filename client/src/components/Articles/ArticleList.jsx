import Skeleton from "../Common/Skeleton.jsx";
import { useArticles, useDeleteArticle } from "../../api/hooks.js";

export default function ArticleList({ currentUser, onEdit, filterUserId }) {
  const params = filterUserId ? { userId: filterUserId } : undefined;
  const { data, isLoading } = useArticles(params);
  const deleteMutation = useDeleteArticle();

  if (isLoading) {
    return (
      <div className="grid">
        <Skeleton className="skel-card" />
        <Skeleton className="skel-card" />
        <Skeleton className="skel-card" />
      </div>
    );
  }

  const items = data?.items || [];

  return (
    <div>
      <div className="card-header">
        <h3 className="card-title">All Articles</h3>
      </div>

      <div className="grid">
        {items.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}
          >
            No articles yet.{" "}
            {currentUser
              ? "Create your first article!"
              : "Sign in to create articles."}
          </div>
        ) : (
          items.map((article) => (
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
                    onClick={() => onEdit?.(article)}
                    aria-label={`Edit ${article.title}`}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    disabled={deleteMutation.isPending}
                    aria-busy={deleteMutation.isPending ? "true" : "false"}
                    onClick={() => {
                      if (deleteMutation.isPending) return;
                      if (confirm("Delete this article?"))
                        deleteMutation.mutate(article._id);
                    }}
                  >
                    {deleteMutation.isPending ? "Deleting…" : "Delete"}
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
