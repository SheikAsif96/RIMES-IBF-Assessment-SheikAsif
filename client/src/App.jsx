import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setAuth } from "./api/client.js";
import Navbar from "./components/Layout/Navbar.jsx";
import AuthModal from "./components/Auth/AuthModal.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Articles from "./pages/Articles.jsx";
import "./styles/global.css";

const queryClient = new QueryClient();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const stored = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (stored && user) {
      setToken(stored);
      setCurrentUser(JSON.parse(user));
      setAuth(stored);
    }
  }, []);

  const handleLogin = (authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
    setToken(authData.token);
    setCurrentUser(authData.user);
    setAuth(authData.token);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setCurrentUser(null);
    setAuth(null);
    setCurrentPage("dashboard");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Navbar
          currentUser={currentUser}
          onLoginClick={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
        />

        <main className="container">
          {currentPage === "dashboard" && (
            <Dashboard currentUser={currentUser} />
          )}
          {currentPage === "articles" && <Articles currentUser={currentUser} />}
        </main>

        {authModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            onLogin={handleLogin}
          />
        )}
      </div>
    </QueryClientProvider>
  );
}
