import { useState } from "react";
import RegisterForm from "../components/Auth/RegisterForm.jsx";
import LoginForm from "../components/Auth/LoginForm.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("register");
  return (
    <div>
      <div>
        <button onClick={() => setMode("register")}>Register</button>
        <button onClick={() => setMode("login")}>Login</button>
      </div>
      {mode === "register" ? (
        <RegisterForm onDone={() => setMode("login")} />
      ) : (
        <LoginForm onDone={() => {}} />
      )}
    </div>
  );
}
