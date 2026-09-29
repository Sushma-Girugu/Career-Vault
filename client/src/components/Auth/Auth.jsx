import { useState } from "react";

const API = "http://localhost:5000/api";

function Auth({ onLogin }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const endpoint =
        mode === "login"
          ? `${API}/auth/login`
          : `${API}/auth/register`;

      const body =
        mode === "login"
          ? {
              email,
              password
            }
          : {
              name,
              email,
              password
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (mode === "register") {
        setMessage(
          "Registration successful! You can now log in."
        );

        setMode("login");
        setName("");
        setPassword("");

        return;
      }

      if (!data.token) {
        throw new Error("Login token was not received");
      }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setMessage("Login successful!");

      onLogin(data.user);

    } catch (err) {
      console.error("Authentication error:", err);

      setError(
        err.message || "Authentication failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f7fb",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "white",
          padding: "35px",
          borderRadius: "16px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.1)"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "8px"
          }}
        >
          CareerVault
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#666",
            marginBottom: "30px"
          }}
        >
          {mode === "login"
            ? "Login to your career dashboard"
            : "Create your CareerVault account"}
        </p>

        {message && (
          <div
            style={{
              background: "#e8f7ee",
              color: "#18794e",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fdecec",
              color: "#c62828",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {mode === "register" && (
            <div style={{ marginBottom: "18px" }}>
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: "18px" }}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "22px" }}>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              required
              minLength={6}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create Account"}
          </button>

        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "22px"
          }}
        >
          {mode === "login" ? (
            <>
              <span>Don't have an account? </span>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setMessage("");
                }}
                style={linkButtonStyle}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span>Already have an account? </span>

              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setMessage("");
                }}
                style={linkButtonStyle}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "7px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxSizing: "border-box",
  fontSize: "14px"
};

const buttonStyle = {
  width: "100%",
  padding: "13px",
  border: "none",
  borderRadius: "8px",
  background: "#4f46e5",
  color: "white",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer"
};

const linkButtonStyle = {
  border: "none",
  background: "none",
  color: "#4f46e5",
  fontWeight: "600",
  cursor: "pointer"
};

export default Auth;