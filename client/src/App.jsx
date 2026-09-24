import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    branch: "",
    year: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
    bio: ""
  });

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    skills: 1,
    projects: 0,
    applications: 0,
    profile: 0
  });

  // ================================
  // NAVIGATION
  // ================================

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Profile", icon: "◉" },
    { name: "Skills", icon: "◆" },
    { name: "Projects", icon: "▣" },
    { name: "Job Applications", icon: "▤" },
    { name: "Job Test", icon: "✓" },
    { name: "Resume", icon: "▥" }
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    setMessage("");
    setError("");
  };

  // ================================
  // LOAD PROFILE
  // ================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);

      const response = await fetch(`${API}/profile`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      if (Array.isArray(data) && data.length > 0) {
        const savedProfile = data[0];

        setProfile((prev) => ({
          ...prev,
          ...savedProfile
        }));

        calculateProfileCompletion(savedProfile);
      }
    } catch (err) {
      console.log("Profile loading error:", err.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // ================================
  // INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  // ================================
  // PROFILE COMPLETION
  // ================================

  const calculateProfileCompletion = (data = profile) => {
    const fields = [
      data.name,
      data.email,
      data.college,
      data.branch,
      data.year,
      data.phone,
      data.location,
      data.linkedin,
      data.github,
      data.portfolio,
      data.bio
    ];

    const completed = fields.filter(
      (field) => field && field.toString().trim() !== ""
    ).length;

    const percentage = Math.round(
      (completed / fields.length) * 100
    );

    setStats((prev) => ({
      ...prev,
      profile: percentage
    }));

    return percentage;
  };

  // ================================
  // VALIDATION
  // ================================

  const validateProfile = () => {
    if (!profile.name.trim()) {
      setError("Full name is required.");
      return false;
    }

    if (profile.name.trim().length < 3) {
      setError("Full name must contain at least 3 characters.");
      return false;
    }

    if (!profile.email.trim()) {
      setError("Email address is required.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(profile.email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    if (!profile.college.trim()) {
      setError("College / University is required.");
      return false;
    }

    if (!profile.branch.trim()) {
      setError("Branch / Course is required.");
      return false;
    }

    if (profile.phone) {
      if (!/^[0-9]{10}$/.test(profile.phone)) {
        setError(
          "Phone number must contain exactly 10 digits."
        );
        return false;
      }
    }

    if (profile.year) {
      if (!/^\d{4}$/.test(profile.year)) {
        setError(
          "Graduation year must contain 4 digits."
        );
        return false;
      }
    }

    if (
      profile.linkedin &&
      !profile.linkedin.startsWith("http")
    ) {
      setError(
        "LinkedIn URL must start with http:// or https://"
      );
      return false;
    }

    if (
      profile.github &&
      !profile.github.startsWith("http")
    ) {
      setError(
        "GitHub URL must start with http:// or https://"
      );
      return false;
    }

    if (
      profile.portfolio &&
      !profile.portfolio.startsWith("http")
    ) {
      setError(
        "Portfolio URL must start with http:// or https://"
      );
      return false;
    }

    return true;
  };

  // ================================
  // SAVE PROFILE
  // ================================

  const saveProfile = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!validateProfile()) {
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json"
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API}/profile`, {
        method: "POST",
        headers,
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save profile"
        );
      }

      const savedProfile = data.profile || profile;

      setProfile((prev) => ({
        ...prev,
        ...savedProfile
      }));

      calculateProfileCompletion(savedProfile);

      setMessage(
        "Profile saved successfully!"
      );
    } catch (err) {
      console.error("Save profile error:", err);

      setError(
        err.message ||
          "Unable to save profile. Please check your backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // RESET PROFILE
  // ================================

  const resetProfile = async () => {
    setMessage("");
    setError("");

    await loadProfile();
  };

  // ================================
  // SIGN OUT
  // ================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setMessage("You have been signed out.");

    setTimeout(() => {
      setActivePage("Dashboard");
    }, 500);
  };

  // ================================
  // INITIAL
  // ================================

  useEffect(() => {
    calculateProfileCompletion(profile);
  }, [
    profile.name,
    profile.email,
    profile.college,
    profile.branch,
    profile.year,
    profile.phone,
    profile.location,
    profile.linkedin,
    profile.github,
    profile.portfolio,
    profile.bio
  ]);

  // ================================
  // RENDER
  // ================================

  return (
    <div className="app">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            CV
          </div>

          <div>
            <h2>CareerVault</h2>
            <span>Career Management</span>
          </div>
        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              type="button"
              key={item.name}
              className={`nav-item ${
                activePage === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation(item.name)
              }
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">

          <div className="help-box">
            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>Need help?</strong>
              <p>
                Build your career profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="logout"
            onClick={handleLogout}
          >
            ↪ Sign Out
          </button>

        </div>

      </aside>

      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="main">

        {/* ======================================
            TOP HEADER
        ====================================== */}

        <header className="topbar">

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              {activePage === "Dashboard"
                ? "Welcome back! Here's your career overview."
                : activePage === "Profile"
                ? "Manage your personal and professional information."
                : `Manage your ${activePage.toLowerCase()} information.`}
            </p>
          </div>

          <div className="user-area">

            <div className="notification">
              ♢
            </div>

            {/* CLICKABLE PROFILE AVATAR */}
            <button
              type="button"
              className="avatar"
              onClick={() =>
                handleNavigation("Profile")
              }
              title="Open Profile"
            >
              {profile.name
                ? profile.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </button>

          </div>

        </header>

        {/* ======================================
            DASHBOARD
        ====================================== */}

        {activePage === "Dashboard" && (

          <section>

            <div className="welcome-card">

              <div>

                <span className="small-label">
                  YOUR CAREER JOURNEY
                </span>

                <h2>
                  Build your future with CareerVault.
                </h2>

                <p>
                  Keep your profile, skills,
                  projects, applications and
                  resume organized in one place.
                </p>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  Complete Profile →
                </button>

              </div>

              <div className="welcome-circle">
                <span>
                  {stats.profile}%
                </span>

                <small>
                  Profile
                </small>
              </div>

            </div>

            <div className="section-heading">

              <div>
                <h2>
                  Career Overview
                </h2>

                <p>
                  Your current career progress
                </p>
              </div>

            </div>

            <div className="stats-grid">

              <div className="stat-card">

                <div className="stat-icon purple">
                  ◉
                </div>

                <div>
                  <span>
                    Profile
                  </span>

                  <strong>
                    {stats.profile}%
                  </strong>

                  <small>
                    Completion
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon blue">
                  ◆
                </div>

                <div>
                  <span>
                    Skills
                  </span>

                  <strong>
                    {stats.skills}
                  </strong>

                  <small>
                    Skills added
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon green">
                  ▣
                </div>

                <div>
                  <span>
                    Projects
                  </span>

                  <strong>
                    {stats.projects}
                  </strong>

                  <small>
                    Projects added
                  </small>
                </div>

              </div>

              <div className="stat-card">

                <div className="stat-icon orange">
                  ▤
                </div>

                <div>
                  <span>
                    Applications
                  </span>

                  <strong>
                    {stats.applications}
                  </strong>

                  <small>
                    Job applications
                  </small>
                </div>

              </div>

            </div>

            <div className="dashboard-grid">

              {/* PROFILE PROGRESS */}

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>
                      Profile Progress
                    </h3>

                    <p>
                      Complete your profile
                      to stand out.
                    </p>
                  </div>

                  <strong>
                    {stats.profile}%
                  </strong>

                </div>

                <div className="progress">

                  <div
                    style={{
                      width: `${stats.profile}%`
                    }}
                  ></div>

                </div>

                <div className="progress-items">

                  <span>
                    {profile.name &&
                    profile.email
                      ? "✓"
                      : "○"}{" "}
                    Basic information
                  </span>

                  <span>
                    {profile.college &&
                    profile.branch
                      ? "✓"
                      : "○"}{" "}
                    Education
                  </span>

                  <span>
                    {profile.linkedin ||
                    profile.github
                      ? "✓"
                      : "○"}{" "}
                    Professional links
                  </span>

                  <span>
                    {profile.bio
                      ? "✓"
                      : "○"}{" "}
                    Bio
                  </span>

                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  Update Profile
                </button>

              </div>

              {/* QUICK ACTIONS */}

              <div className="panel">

                <div className="panel-header">

                  <div>
                    <h3>
                      Quick Actions
                    </h3>

                    <p>
                      Manage your career faster.
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Profile")
                  }
                >
                  <span>👤</span>
                  Update Profile
                  <b>→</b>
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Skills")
                  }
                >
                  <span>⚡</span>
                  Add Skills
                  <b>→</b>
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Projects")
                  }
                >
                  <span>💼</span>
                  Add Project
                  <b>→</b>
                </button>

              </div>

            </div>

          </section>

        )}

        {/* ======================================
            PROFILE PAGE
        ====================================== */}

        {activePage === "Profile" && (

          <section className="profile-page">

            {/* PROFILE HEADER */}

            <div className="profile-header-card">

              <div className="profile-avatar">

                {profile.name
                  ? profile.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}

              </div>

              <div>

                <h2>
                  {profile.name ||
                    "Your Name"}
                </h2>

                <p>
                  {profile.branch ||
                    "Student"}

                  {profile.college
                    ? ` • ${profile.college}`
                    : ""}
                </p>

                <span className="profile-status">
                  ● Profile
                </span>

              </div>

            </div>

            {/* PROFILE FORM */}

            <form
              className="profile-form"
              onSubmit={saveProfile}
            >

              {/* PERSONAL */}

              <div className="form-section">

                <div className="form-title">

                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Tell us about yourself.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="field">

                    <label>
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Phone
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="10 digit phone number"
                      maxLength="10"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Location
                    </label>

                    <input
                      type="text"
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      placeholder="City, State"
                    />

                  </div>

                </div>

              </div>

              {/* EDUCATION */}

              <div className="form-section">

                <div className="form-title">

                  <h3>
                    Education
                  </h3>

                  <p>
                    Your academic information.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="field full">

                    <label>
                      College / University *
                    </label>

                    <input
                      type="text"
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      placeholder="Enter college name"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Branch / Course *
                    </label>

                    <input
                      type="text"
                      name="branch"
                      value={profile.branch}
                      onChange={handleChange}
                      placeholder="e.g. AI & Data Science"
                    />

                  </div>

                  <div className="field">

                    <label>
                      Graduation Year
                    </label>

                    <input
                      type="text"
                      name="year"
                      value={profile.year}
                      onChange={handleChange}
                      placeholder="2027"
                      maxLength="4"
                    />

                  </div>

                </div>

              </div>

              {/* PROFESSIONAL LINKS */}

              <div className="form-section">

                <div className="form-title">

                  <h3>
                    Professional Links
                  </h3>

                  <p>
                    Connect your professional presence.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="field">

                    <label>
                      LinkedIn
                    </label>

                    <input
                      type="url"
                      name="linkedin"
                      value={profile.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />

                  </div>

                  <div className="field">

                    <label>
                      GitHub
                    </label>

                    <input
                      type="url"
                      name="github"
                      value={profile.github}
                      onChange={handleChange}
                      placeholder="https://github.com/..."
                    />

                  </div>

                  <div className="field full">

                    <label>
                      Portfolio Website
                    </label>

                    <input
                      type="url"
                      name="portfolio"
                      value={profile.portfolio}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                    />

                  </div>

                </div>

              </div>

              {/* BIO */}

              <div className="form-section">

                <div className="form-title">

                  <h3>
                    About You
                  </h3>

                  <p>
                    Write a short professional introduction.
                  </p>

                </div>

                <div className="field">

                  <label>
                    Professional Bio
                  </label>

                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell recruiters about your interests, skills and career goals..."
                    rows="5"
                    maxLength="500"
                  />

                  <small>
                    {profile.bio.length}/500
                  </small>

                </div>

              </div>

              {/* MESSAGES */}

              {error && (
                <div className="alert error">
                  ⚠ {error}
                </div>
              )}

              {message && (
                <div className="alert success">
                  ✓ {message}
                </div>
              )}

              {/* ACTIONS */}

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetProfile}
                  disabled={profileLoading}
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="primary-btn save-btn"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ======================================
            OTHER MODULES
        ====================================== */}

        {activePage !== "Dashboard" &&
          activePage !== "Profile" && (

            <section className="coming-soon">

              <div className="coming-icon">

                {
                  navigation.find(
                    (item) =>
                      item.name === activePage
                  )?.icon
                }

              </div>

              <h2>
                {activePage}
              </h2>

              <p>
                This module will connect to
                its backend API and database.
              </p>

              <span>
                Module development in progress
              </span>

            </section>

          )}

      </main>

    </div>
  );
}

export default App;