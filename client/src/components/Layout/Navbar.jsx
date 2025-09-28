// components/Layout/Navbar.jsx
export default function Navbar({
  currentUser,
  onLoginClick,
  onLogout,
  currentPage,
  onNavigate,
}) {
  return (
    <nav className="navbar">
      <a href="#" className="navbar-brand">
        IBF CMS
      </a>

      {/* <ul className="navbar-nav">
        <li>
          <a
            href="#"
            className={`nav-link ${
              currentPage === "dashboard" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("dashboard");
            }}
          >
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`nav-link ${currentPage === "articles" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate("articles");
            }}
          >
            Articles
          </a>
        </li>
      </ul> */}

      <div className="navbar-actions">
        {currentUser ? (
          <div className="user-menu">
            <div className="user-avatar">
              {currentUser.username?.charAt(0).toUpperCase()}
            </div>
            <span>{currentUser.username}</span>
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onLoginClick}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
