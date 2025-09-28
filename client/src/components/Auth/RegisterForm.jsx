// components/Auth/RegisterForm.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRegister } from "../../api/hooks.js";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone must be at least 6 characters"),
  position: z.string().min(2, "Position is required"),
  country: z.string().min(1, "Country is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterForm({ onSuccess, onSwitchMode }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const registerMutation = useRegister();

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((r) => r.json())
      .then((arr) => setCountries(arr.map((c) => c.name.common).sort()))
      .catch(() =>
        setCountries(["United States", "Canada", "United Kingdom", "Australia"])
      );
  }, []);

  const onSubmit = async (data) => {
    try {
      setError("");
      await registerMutation.mutateAsync(data);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label className="form-label">Username</label>
        <input
          className="form-input"
          {...register("username")}
          placeholder="Choose username"
        />
        {errors.username && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.username.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          className="form-input"
          {...register("email")}
          placeholder="Enter email"
        />
        {errors.email && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Phone</label>
        <input
          className="form-input"
          {...register("phone")}
          placeholder="Phone number"
        />
        {errors.phone && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.phone.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Position</label>
        <input
          className="form-input"
          {...register("position")}
          placeholder="Job title"
        />
        {errors.position && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.position.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Country</label>
        <select className="form-select" {...register("country")}>
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {errors.country && (
          <span style={{ color: "#dc2626", fontSize: "0.875rem" }}>
            {errors.country.message}
          </span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-input"
          {...register("password")}
          placeholder="Choose password"
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
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create Account"}
      </button>

      <p
        style={{ textAlign: "center", fontSize: "0.875rem", color: "#6b7280" }}
      >
        Already have an account?{" "}
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
          Sign in
        </button>
      </p>
    </form>
  );
}
