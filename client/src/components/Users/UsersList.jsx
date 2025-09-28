// components/Users/UserList.jsx
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client.js";

export default function UserList({ onUserClick }) {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get("/api/users").then((r) => r.data),
  });

  return (
    <div className="user-list">
      <h3>Active Users ({users?.length || 0})</h3>
      <div className="user-grid">
        {users?.map((user) => (
          <div
            key={user._id}
            className="user-card"
            onClick={() => onUserClick(user)}
          >
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
