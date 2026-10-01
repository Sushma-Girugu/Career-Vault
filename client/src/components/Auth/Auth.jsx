import { useState } from "react";

const API = "https://career-vault-1xyt.onrender.com/api";

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
        setMessage("Registration successful! You can now log in.");

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
        localStorage.setItem("user", JSON.stringify(data.user));
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

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setMessage("");
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-showcase">

        <div className="auth-brand">
          <div className="auth-logo">
            CV
          </div>

          <div>
            <h1>CareerVault</h1>
            <span>Your Career. Our Support.</span>
          </div>
        </div>

        <div className="auth-showcase-copy">

          <span className="auth-kicker">
            BUILD • LEARN • APPLY • GROW
          </span>

          <h2>
            Plan today.
            <br />
            Build your career tomorrow.
          </h2>

          <p>
            An all-in-one platform to manage your skills,
            projects, applications and complete career journey.
          </p>

        </div>

        <div className="auth-benefits">

          <div>
            <b>01</b>

            <span>
              <strong>Build your profile</strong>

              <small>
                Create a job-ready professional profile.
              </small>
            </span>
          </div>

          <div>
            <b>02</b>

            <span>
              <strong>Track your growth</strong>

              <small>
                Keep skills, projects and applications organized.
              </small>
            </span>
          </div>

          <div>
            <b>03</b>

            <span>
              <strong>Get job ready</strong>

              <small>
                Prepare with tests, resume tools and AI.
              </small>
            </span>
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-card-wrap">

        <div className="auth-card">

          <div className="auth-card-head">

            <span className="auth-kicker">
              {mode === "login"
                ? "WELCOME BACK"
                : "GET STARTED"}
            </span>

            <h2>
              {mode === "login"
                ? "Sign in to CareerVault"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Enter your credentials to continue."
                : "Start building your career profile."}
            </p>

          </div>

          {/* SUCCESS MESSAGE */}
          {message && (
            <div className="auth-message success">
              {message}
            </div>
          )}

          {/* ERROR MESSAGE */}
          {error && (
            <div className="auth-message error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* NAME - REGISTER ONLY */}
            {mode === "register" && (
              <div className="auth-field">

                <label>Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Your full name"
                  required
                />

              </div>
            )}

            {/* EMAIL */}
            <div className="auth-field">

              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                required
              />

            </div>

            {/* PASSWORD */}
            <div className="auth-field">

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
              />

            </div>

            {/* SUBMIT */}
            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

          </form>

          {/* SWITCH LOGIN / REGISTER */}
          <div className="auth-switch">

            {mode === "login" ? (
              <>
                Don't have an account?

                <button
                  type="button"
                  onClick={switchMode}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                Already have an account?

                <button
                  type="button"
                  onClick={switchMode}
                >
                  Sign In
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Auth;