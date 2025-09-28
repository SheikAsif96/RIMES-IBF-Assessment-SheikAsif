// components/Auth/AuthModal.jsx
import { useState } from "react";
import LoginForm from "./LoginForm.jsx";
import RegisterForm from "./RegisterForm.jsx";

export default function AuthModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button
              className={`btn ${
                mode === "login" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setMode("login")}
            >
              Login
            </button>
            <button
              className={`btn ${
                mode === "register" ? "btn-primary" : "btn-secondary"
              }`}
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>
        </div>

        {mode === "login" ? (
          <LoginForm
            onSuccess={onLogin}
            onSwitchMode={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onSuccess={() => setMode("login")}
            onSwitchMode={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}
