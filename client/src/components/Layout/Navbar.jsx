import { useState } from "react";

export default function Navbar({
  currentUser,
  onLoginClick,
  onLogout,
  currentPage,
  onNavigate,
}) {
  const [open, setOpen] = useState(false);

  const NavLink = ({ id, label }) => (
    <a
      href="#"
      className={`nav-link ${currentPage === id ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onNavigate(id);
        setOpen(false);
      }}
      aria-current={currentPage === id ? "page" : undefined}
    >
      {label}
    </a>
  );

  return (
    <nav className="navbar" role="navigation" aria-label="Global">
      <a
        href="#"
        className="navbar-brand"
        onClick={(e) => {
          e.preventDefault();
          onNavigate("dashboard");
        }}
      >
        IBF CMS
      </a>

      {/* Desktop nav */}
      {/* <ul className="navbar-nav desktop-only">
        <li>
          <NavLink id="dashboard" label="Dashboard" />
        </li>
        <li>
          <NavLink id="articles" label="Articles" />
        </li>
      </ul> */}

      <div className="navbar-actions">
        {/* Mobile menu button */}
        <button
          className="btn btn-secondary mobile-only"
          aria-label="Toggle menu"
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        {/* User actions (visible on all) */}
        {currentUser ? (
          <div className="user-menu">
            <div className="user-avatar">
              {currentUser.username?.[0]?.toUpperCase()}
            </div>
            <span className="user-name">{currentUser.username}</span>
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

      {/* Mobile dropdown panel (slides under navbar) */}
      {open && (
        <div className="mobile-menu" role="menu">
          <NavLink id="dashboard" label="Dashboard" />
          <NavLink id="articles" label="Articles" />
          {!currentUser && (
            <button
              className="btn btn-primary"
              onClick={() => {
                onLoginClick();
                setOpen(false);
              }}
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
