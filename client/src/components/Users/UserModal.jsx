// components/Users/UserModal.jsx
export default function UserModal({ user, onClose, articles }) {
  if (!user) return null;

  const userArticles = articles?.filter((a) => a.userId === user._id) || [];
  const postFrequency = userArticles.length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Profile</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div>
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Country:</strong> {user.country}
          </p>
          <p>
            <strong>Position:</strong> {user.position}
          </p>
          <p>
            <strong>Articles Posted:</strong> {postFrequency}
          </p>
          <p>
            <strong>Member Since:</strong>{" "}
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
