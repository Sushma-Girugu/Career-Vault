import { useEffect, useState } from "react";
import "./App.css";

import Projects from "./components/Projects/Projects";
import JobTest from "./components/JobTest/JobTest";
import Auth from "./components/Auth/Auth";
import Gemini from "./components/Gemini/Gemini";
const API = "http://localhost:5000/api";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setIsAuthenticated(false);
  };
  // =====================================================
  // NAVIGATION
  // =====================================================

  const [activePage, setActivePage] = useState("Dashboard");

  const navigation = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Profile", icon: "◉" },
    { name: "Skills", icon: "◆" },
    { name: "Projects", icon: "▣" },
    { name: "Job Applications", icon: "▤" },
    { name: "Job Test", icon: "✓" },
    { name: "Resume", icon: "▥" },
    { name: "Gemini AI", icon: "✦"},
  ];

  // =====================================================
  // PROFILE
  // =====================================================

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

  const [profileLoading, setProfileLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // SKILLS
  // =====================================================

  const [skills, setSkills] = useState([]);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState("Beginner");
  const [skillLoading, setSkillLoading] = useState(false);

  // =====================================================
  // JOB APPLICATIONS
  // =====================================================

  const [applications, setApplications] = useState([]);

  const [applicationForm, setApplicationForm] = useState({
    company: "",
    jobTitle: "",
    status: "Applied",
    applicationDate: "",
    jobLink: ""
  });

  const [editingApplicationId, setEditingApplicationId] = useState(null);

  // =====================================================
  // STATS
  // =====================================================

  const [stats, setStats] = useState({
    skills: 0,
    projects: 0,
    applications: 0,
    profile: 0
  });

  // =====================================================
  // AUTH HEADERS
  // =====================================================

  const getHeaders = () => {
    const token = localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    };
  };

  // =====================================================
  // NAVIGATION HANDLER
  // =====================================================

  const handleNavigation = (page) => {
    setActivePage(page);
    setMessage("");
    setError("");
  };

  // =====================================================
  // PROFILE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  // =====================================================
  // PROFILE COMPLETION
  // =====================================================

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

    const percentage = Math.round((completed / fields.length) * 100);

    setStats((prev) => ({
      ...prev,
      profile: percentage
    }));

    return percentage;
  };

  // =====================================================
  // VALIDATE PROFILE
  // =====================================================

  const validateProfile = () => {
    setError("");

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (profile.phone && !/^[0-9]{10}$/.test(profile.phone)) {
      setError("Phone number must contain exactly 10 digits.");
      return false;
    }

    if (profile.year && !/^\d{4}$/.test(profile.year)) {
      setError("Graduation year must contain 4 digits.");
      return false;
    }

    if (
      profile.linkedin &&
      !profile.linkedin.startsWith("http")
    ) {
      setError("LinkedIn URL must start with http:// or https://");
      return false;
    }

    if (
      profile.github &&
      !profile.github.startsWith("http")
    ) {
      setError("GitHub URL must start with http:// or https://");
      return false;
    }

    if (
      profile.portfolio &&
      !profile.portfolio.startsWith("http")
    ) {
      setError("Portfolio URL must start with http:// or https://");
      return false;
    }

    return true;
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No login token found.");
        return;
      }

      const response = await fetch(`${API}/profile`, {
        method: "GET",
        headers: getHeaders()
      });

      const data = await response.json();

      if (response.status === 404) {
        console.log("No profile created yet.");
        calculateProfileCompletion(profile);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile");
      }

      const savedProfile = data.profile || data;

      if (savedProfile) {
        setProfile((prev) => ({
          ...prev,
          ...savedProfile
        }));

        calculateProfileCompletion(savedProfile);
      }
    } catch (err) {
      console.error("Profile loading error:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateProfile()) {
      return;
    }

    try {
      setProfileLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first.");
        return;
      }

      const response = await fetch(`${API}/profile`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(profile)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      const savedProfile = data.profile || data;

      setProfile((prev) => ({
        ...prev,
        ...savedProfile
      }));

      calculateProfileCompletion(savedProfile);

      setMessage("Profile saved successfully.");

      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Profile save error:", err);
      setError(err.message || "Failed to save profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // LOAD SKILLS
  // =====================================================

  const loadSkills = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setSkills([]);
        return;
      }

      const response = await fetch(`${API}/skills`, {
        method: "GET",
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load skills");
      }

      setSkills(Array.isArray(data) ? data : []);

      setStats((prev) => ({
        ...prev,
        skills: Array.isArray(data) ? data.length : 0
      }));
    } catch (err) {
      console.error("Skills fetch error:", err);
    }
  };

  // =====================================================
  // ADD SKILL
  // =====================================================

  const addSkill = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!skillName.trim()) {
      alert("Please enter a skill name.");
      return;
    }

    try {
      setSkillLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(`${API}/skills`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          name: skillName.trim(),
          level: skillLevel
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add skill");
      }

      setSkillName("");
      setSkillLevel("Beginner");

      await loadSkills();

      alert("Skill added successfully!");
    } catch (err) {
      console.error("Skill save error:", err);
      alert(err.message || "Server connection failed.");
    } finally {
      setSkillLoading(false);
    }
  };

  // =====================================================
  // DELETE SKILL
  // =====================================================

  const deleteSkill = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this skill?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(`${API}/skills/${id}`, {
        method: "DELETE",
        headers: getHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete skill");
      }

      await loadSkills();

      alert("Skill deleted successfully!");
    } catch (err) {
      console.error("Skill delete error:", err);
      alert(err.message || "Server connection failed.");
    }
  };

  // =====================================================
  // LOAD JOB APPLICATIONS
  // =====================================================

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setApplications([]);
        return;
      }

      const response = await fetch(
        `${API}/job-applications`,
        {
          method: "GET",
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load applications"
        );
      }

      setApplications(Array.isArray(data) ? data : []);

      setStats((prev) => ({
        ...prev,
        applications: Array.isArray(data) ? data.length : 0
      }));
    } catch (err) {
      console.error(
        "Job applications fetch error:",
        err
      );
    }
  };

  // =====================================================
  // APPLICATION FORM CHANGE
  // =====================================================

  const handleApplicationChange = (e) => {
    const { name, value } = e.target;

    setApplicationForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =====================================================
  // SAVE APPLICATION
  // =====================================================

  const saveApplication = async (e) => {
    if (e) {
      e.preventDefault();
    }

    if (!applicationForm.company.trim()) {
      alert("Please enter company name.");
      return;
    }

    if (!applicationForm.jobTitle.trim()) {
      alert("Please enter job role.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      let response;

      if (editingApplicationId) {
        response = await fetch(
          `${API}/job-applications/${editingApplicationId}`,
          {
            method: "PUT",
            headers: getHeaders(),
            body: JSON.stringify(applicationForm)
          }
        );
      } else {
        response = await fetch(
          `${API}/job-applications`,
          {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify(applicationForm)
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save job application"
        );
      }

      if (editingApplicationId) {
        alert("Job application updated successfully!");
      } else {
        alert("Job application added successfully!");
      }

      clearApplicationForm();
      await loadApplications();
    } catch (err) {
      console.error(
        "Job application save error:",
        err
      );

      alert(
        err.message || "Server connection failed."
      );
    }
  };

  // =====================================================
  // EDIT APPLICATION
  // =====================================================

  const editApplication = (application) => {
    setApplicationForm({
      company: application.company || "",
      jobTitle: application.jobTitle || "",
      status: application.status || "Applied",
      appliedDate: application.applicationDate
        ? application.applicationDate.substring(0, 10)
        : "",
      jobLink: application.jobLink || ""
    });

    setEditingApplicationId(application._id);

    setActivePage("Job Applications");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =====================================================
  // DELETE APPLICATION
  // =====================================================

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job application?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        return;
      }

      const response = await fetch(
        `${API}/job-applications/${id}`,
        {
          method: "DELETE",
          headers: getHeaders()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete application"
        );
      }

      alert("Job application deleted successfully!");

      await loadApplications();
    } catch (err) {
      console.error(
        "Job application delete error:",
        err
      );

      alert(
        err.message || "Server connection failed."
      );
    }
  };

  // =====================================================
  // CLEAR APPLICATION FORM
  // =====================================================

  const clearApplicationForm = () => {
    setApplicationForm({
      company: "",
      jobTitle: "",
      status: "Applied",
      applicationDate: "",
      jobLink: ""
    });

    setEditingApplicationId(null);
  };

  // =====================================================
  // LOAD DATA WHEN APP STARTS
  // =====================================================

  useEffect(() => {
    loadProfile();
    loadSkills();
    loadApplications();
  }, []);

  // =====================================================
  // RENDER
  // =====================================================
    if (!isAuthenticated) {
    return (
      <Auth onLogin={handleLogin} />
    );
  }
  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">
          CareerVault
        </div>

        <nav>
          {navigation.map((item) => (
            <button
              key={item.name}
              type="button"
              className={
                activePage === item.name
                  ? "nav-item active"
                  : "nav-item"
              }
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

      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main-content">

        {/* =================================================
            TOP BAR
        ================================================= */}

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

            <button
              type="button"
              className="secondary-btn"
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </button>

          </div>

        </header>

        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* =================================================
            DASHBOARD
        ================================================= */}

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
                  />

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
                  <span>◆</span>
                  Add Skill
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

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Resume")
                  }
                >
                  <span>📄</span>
                  Resume
                  <b>→</b>
                </button>

                <button
                  type="button"
                  className="action-btn"
                  onClick={() =>
                    handleNavigation("Job Test")
                  }
                >
                  <span>✓</span>
                  Job Tests
                  <b>→</b>
                </button>

              </div>

            </div>

          </section>
        )}

        {/* =================================================
            PROFILE
        ================================================= */}

        {activePage === "Profile" && (
          <section className="profile-page">

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
                      type="text"
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="10 digit phone number"
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
                    Add your academic information.
                  </p>

                </div>

                <div className="form-grid">

                  <div className="field">

                    <label>
                      College / University *
                    </label>

                    <input
                      type="text"
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      placeholder="College / University"
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
                      placeholder="Computer Science"
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
                    Add your professional profiles.
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

                  <div className="field">

                    <label>
                      Portfolio
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
                    Write a short professional bio.
                  </p>

                </div>

                <div className="field">

                  <label>
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Write a short description about yourself..."
                    rows="5"
                  />

                </div>

              </div>

              {/* SAVE */}

              <div className="form-actions">

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={profileLoading}
                >
                  {profileLoading
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>

            </form>

          </section>
        )}

        {/* =================================================
            SKILLS
        ================================================= */}

        {activePage === "Skills" && (
          <section>

            <div className="section-heading">

              <div>
                <h2>
                  Skills
                </h2>

                <p>
                  Add and manage your technical skills.
                </p>
              </div>

            </div>

            <div className="panel">

              <form onSubmit={addSkill}>

                <div className="field">

                  <label>
                    Skill Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter skill name"
                    value={skillName}
                    onChange={(e) =>
                      setSkillName(e.target.value)
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Skill Level
                  </label>

                  <select
                    value={skillLevel}
                    onChange={(e) =>
                      setSkillLevel(e.target.value)
                    }
                  >
                    <option value="Beginner">
                      Beginner
                    </option>

                    <option value="Intermediate">
                      Intermediate
                    </option>

                    <option value="Advanced">
                      Advanced
                    </option>
                  </select>

                </div>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={skillLoading}
                >
                  {skillLoading
                    ? "Adding..."
                    : "Add Skill"}
                </button>

              </form>

            </div>

            <div className="panel">

              <div className="panel-header">

                <div>
                  <h3>
                    My Skills
                  </h3>

                  <p>
                    {skills.length} skill
                    {skills.length !== 1
                      ? "s"
                      : ""} added
                  </p>
                </div>

              </div>

              {skills.length === 0 ? (
                <p>
                  No skills added yet.
                </p>
              ) : (
                <ul className="skills-list">

                  {skills.map((skill) => (
                    <li key={skill._id}>

                      <div>
                        <strong>
                          {skill.name}
                        </strong>

                        <span>
                          {" - "}
                          {skill.level}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteSkill(skill._id)
                        }
                      >
                        Delete
                      </button>

                    </li>
                  ))}

                </ul>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            PROJECTS
        ================================================= */}

        {activePage === "Projects" && (
          <section>

            <div className="section-heading">

              <div>
                <h2>
                  Projects
                </h2>

                <p>
                  Add and manage your projects.
                </p>
              </div>

            </div>

            <Projects />

          </section>
        )}
      {/* =================================================
    GEMINI AI
================================================= */}

{activePage === "Gemini AI" && (
  <Gemini
    profile={profile}
    skills={skills}
  />
)}
        {/* =================================================
            JOB APPLICATIONS
        ================================================= */}

        {activePage === "Job Applications" && (
          <section>

            <div className="section-heading">

              <div>
                <h2>
                  Job Applications
                </h2>

                <p>
                  Track your job applications
                  and their current status.
                </p>
              </div>

            </div>

            <div className="panel">

              <h3>
                {editingApplicationId
                  ? "Edit Job Application"
                  : "Add Job Application"}
              </h3>

              <form onSubmit={saveApplication}>

                <div className="field">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name"
                    value={
                      applicationForm.company
                    }
                    onChange={
                      handleApplicationChange
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Job Role
                  </label>

                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={
                      applicationForm.jobTitle
                    }
                    onChange={
                      handleApplicationChange
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      applicationForm.status
                    }
                    onChange={
                      handleApplicationChange
                    }
                  >
                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Interview">
                      Interview
                    </option>

                    <option value="Selected">
                      Selected
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>

                </div>

                <div className="field">

                  <label>
                    Applied Date
                  </label>

                  <input
                    type="date"
                    name="applicationDate"
                    value={
                      applicationForm.applicationDate
                    }
                    onChange={
                      handleApplicationChange
                    }
                  />

                </div>

                <div className="field">

                  <label>
                    Job Link
                  </label>

                  <input
                    type="url"
                    name="jobLink"
                    placeholder="https://..."
                    value={
                      applicationForm.jobLink
                    }
                    onChange={
                      handleApplicationChange
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingApplicationId
                    ? "Update Application"
                    : "Add Application"}
                </button>

                {editingApplicationId && (
                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={
                      clearApplicationForm
                    }
                  >
                    Cancel Edit
                  </button>
                )}

              </form>

            </div>

            <div className="panel">

              <h3>
                My Applications
              </h3>

              {applications.length === 0 ? (
                <p>
                  No job applications added yet.
                </p>
              ) : (
                <ul className="applications-list">

                  {applications.map(
                    (application) => (
                      <li
                        key={application._id}
                      >

                        <div>

                          <strong>
                            {application.company}
                          </strong>

                          <span>
                            {" - "}
                            {application.role}
                          </span>

                          <p>
                            Status:{" "}
                            <strong>
                              {application.status}
                            </strong>
                          </p>

                          <p>
                            Applied:{" "}
                            {application.applicationDate
                              ? application.applicationDate.substring(
                                  0,
                                  10
                                )
                              : "N/A"}
                          </p>

                          {application.jobLink && (
                            <a
                              href={
                                application.jobLink
                              }
                              target="_blank"
                              rel="noreferrer"
                            >
                              Job Link
                            </a>
                          )}

                        </div>

                        <div>

                          <button
                            type="button"
                            onClick={() =>
                              editApplication(
                                application
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteApplication(
                                application._id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </li>
                    )
                  )}

                </ul>
              )}

            </div>

          </section>
        )}

        {/* =================================================
            JOB TEST
        ================================================= */}

        {activePage === "Job Test" && (
          <section>

            <JobTest />

          </section>
        )}

        {/* =================================================
            RESUME
        ================================================= */}

        {activePage === "Resume" && (
          <section>

            <div className="section-heading">

              <div>
                <h2>
                  Resume
                </h2>

                <p>
                  Manage your resume.
                </p>
              </div>

            </div>

            <div className="panel">

              <h3>
                Resume Module
              </h3>

              <p>
                Your resume builder can be
                connected here.
              </p>

            </div>

          </section>
        )}

      </main>

    </div>
  );
}

export default App;