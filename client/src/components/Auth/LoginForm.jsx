// components/Auth/LoginForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../../api/hooks.js";

export default function LoginForm({ onSuccess, onSwitchMode }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const login = useLogin();

  const onSubmit = async (data) => {
    try {
      setError("");
      const result = await login.mutateAsync({
        login: data.login,
        password: data.password,
      });
      onSuccess(result);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Email or Username</label>
        <input
          className="form-input"
          {...register("login", { required: "Email or username is required" })}
          placeholder="Enter email or username"
        />
        {errors.login && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.login.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          {...register("password", { required: "Password is required" })}
          placeholder="Enter password"
        />
        {errors.password && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.password.message}
          </span>
        )}
      </div>

      {error && (
        <div
          style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: "100%", marginBottom: "1rem" }}
        disabled={login.isPending}
      >
        {login.isPending ? "Signing in..." : "Sign In"}
      </button>

      <p
        style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}
      >
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          style={{
            background: "none",
            border: "none",
            color: "#1e40af",
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
