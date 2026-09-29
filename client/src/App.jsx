import { useEffect, useState } from "react";
import "./App.css";

import JobApplications from "./components/JobApplications/JobApplications";
import Projects from "./components/Projects/Projects";
import JobTest from "./components/JobTest/JobTest";
import Resume from "./components/Resume";

import Auth from "./components/Auth/Auth";
import Gemini from "./components/Gemini/Gemini";

const API = "http://localhost:5000/api";
function App() {
  // =====================================================
  // AUTHENTICATION
  // =====================================================

  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [authMode, setAuthMode] = useState("login");

  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [authLoading, setAuthLoading] = useState(false);

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

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const authHeaders = () => {
    const token = getToken();

    return token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {};
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setMessage("");
    setError("");
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
      (field) =>
        field &&
        field.toString().trim() !== ""
    ).length;

    const percentage = Math.round((completed / fields.length) * 100);

    setStats((previous) => ({
      ...previous,
      profile: percentage
    }));

    return percentage;
  };

  // =====================================================
  // AUTH FORM
  // =====================================================

  const handleAuthChange = (e) => {
    setAuthForm({
      ...authForm,
      [e.target.name]: e.target.value
    });
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async () => {
    if (
      !authForm.email.trim() ||
      !authForm.password
    ) {
      alert(
        "Please enter email and password."
      );
      return;
    }

    try {
      setAuthLoading(true);

      const response = await fetch(
        `${API}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: authForm.email
              .trim()
              .toLowerCase(),
            password: authForm.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Login failed."
        );
        return;
      }

      if (data.token) {
        localStorage.setItem(
          "token",
          data.token
        );
      }

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      setIsAuthenticated(true);

      setAuthForm({
        name: "",
        email: "",
        password: ""
      });

      setActivePage("Dashboard");

      await loadProfile();
      await loadSkills();
      await loadApplications();
      await loadProjects();

      alert("Login successful!");
    } catch (err) {
      console.log(
        "Login error:",
        err
      );

      alert(
        "Server connection failed."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async () => {
    if (
      !authForm.name.trim() ||
      !authForm.email.trim() ||
      !authForm.password
    ) {
      alert(
        "Name, email and password are required."
      );
      return;
    }

    if (authForm.password.length < 6) {
      alert(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setAuthLoading(true);

      const response = await fetch(
        `${API}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: authForm.name.trim(),
            email: authForm.email
              .trim()
              .toLowerCase(),
            password: authForm.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Registration failed."
        );
        return;
      }

      alert(
        "Registration successful! Please login."
      );

      setAuthMode("login");

      setAuthForm({
        name: "",
        email: authForm.email
          .trim()
          .toLowerCase(),
        password: ""
      });
    } catch (err) {
      console.log(
        "Registration error:",
        err
      );

      alert(
        "Server connection failed."
      );
    } finally {
      setAuthLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);

    setProfile({
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

    setSkills([]);
    setApplications([]);

    setActivePage("Dashboard");

    alert("Logged out successfully.");
  };

  // =====================================================
  // PROFILE INPUT
  // =====================================================

  const handleProfileChange = (e) => {
    const {
      name,
      value
    } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value
    }));

    setError("");
    setMessage("");
  };

  // =====================================================
  // LOAD PROFILE
  // =====================================================

  async function loadProfile() {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setProfileLoading(true);

      const response = await fetch(
        `${API}/profile`,
        {
          method: "GET",
          headers: {
            ...authHeaders()
          }
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        console.log(
          "Profile loading failed:",
          data
        );
        return;
      }

      let savedProfile = null;

      if (
        data &&
        data.profile
      ) {
        savedProfile = data.profile;
      } else if (
        Array.isArray(data) &&
        data.length > 0
      ) {
        savedProfile = data[0];
      } else if (
        data &&
        !Array.isArray(data)
      ) {
        savedProfile = data;
      }

      if (savedProfile) {
        setProfile((previous) => ({
          ...previous,
          ...savedProfile
        }));

        calculateProfileCompletion(
          savedProfile
        );
      }
    } catch (err) {
      console.log(
        "Profile loading error:",
        err
      );
    } finally {
      setProfileLoading(false);
    }
  }

  // =====================================================
  // PROFILE VALIDATION
  // =====================================================

  const validateProfile = () => {
    setError("");

    if (!profile.name.trim()) {
      setError(
        "Full name is required."
      );
      return false;
    }

    if (
      profile.name.trim().length < 3
    ) {
      setError(
        "Full name must contain at least 3 characters."
      );
      return false;
    }

    if (!profile.email.trim()) {
      setError(
        "Email address is required."
      );
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(
        profile.email.trim()
      )
    ) {
      setError(
        "Please enter a valid email address."
      );
      return false;
    }

    if (!profile.college.trim()) {
      setError(
        "College / University is required."
      );
      return false;
    }

    if (!profile.branch.trim()) {
      setError(
        "Branch / Course is required."
      );
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
      const response = await fetch(
        `${API}/skills`,
        {
          headers: {
            ...authHeaders()
          }
        }
      );

      const data =
        await response.json();

      if (response.status === 404) {
  console.log("No profile created yet.");

  const emptyProfile = {
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
  };

  setProfile(emptyProfile);
  calculateProfileCompletion(emptyProfile);

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
  // LOAD PROJECTS
  // =====================================================

  async function loadProjects() {
    try {
      const response = await fetch(
        `${API}/projects`,
        {
          headers: {
            ...authHeaders()
          }
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        const projectList =
          Array.isArray(data)
            ? data
            : data.projects || [];

        setProjectCount(
          projectList.length
        );

        setStats((previous) => ({
          ...previous,
          projects:
            projectList.length
        }));
      }
    } catch (err) {
      console.log(
        "Projects fetch error:",
        err
      );
    }
  }

  // =====================================================
  // LOAD JOB APPLICATIONS
  // =====================================================

  async function loadApplications() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setApplications([]);
        return;
      }

      const response = await fetch(
        `${API}/job-applications`,
        {
          headers: {
            ...authHeaders()
          }
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        const applicationList =
          Array.isArray(data)
            ? data
            : data.applications || [];

        setApplications(
          applicationList
        );

        setStats((previous) => ({
          ...previous,
          applications:
            applicationList.length
        }));
      } else {
        console.log(
          "Failed to load applications:",
          data
        );
      }
    } catch (err) {
      console.log(
        "Job applications fetch error:",
        err
      );
    }
  }

  // =====================================================
  // APPLICATION FORM
  // =====================================================

  const handleApplicationChange = (
    e
  ) => {
    setApplicationForm({
      ...applicationForm,
      [e.target.name]:
        e.target.value
    });
  };

  // =====================================================
  // CLEAR APPLICATION FORM
  // =====================================================

  const clearApplicationForm = () => {
    setApplicationForm({
      company: "",
      role: "",
      status: "Applied",
      appliedDate: "",
      jobLink: ""
    });

    setEditingApplicationId(
      null
    );
  };

  // =====================================================
  // SAVE APPLICATION
  // =====================================================

  const saveApplication = async () => {
    if (
      !applicationForm.company.trim()
    ) {
      alert(
        "Please enter company name."
      );
      return;
    }

    if (
      !applicationForm.role.trim()
    ) {
      alert(
        "Please enter job role."
      );
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
            headers: {
              "Content-Type":
                "application/json",
              ...authHeaders()
            },
            body: JSON.stringify(
              applicationForm
            )
          }
        );
      } else {
        response = await fetch(
          `${API}/job-applications`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              ...authHeaders()
            },
            body: JSON.stringify(
              applicationForm
            )
          }
        );
      }

      const data =
        await response.json();

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

  const editApplication = (
    application
  ) => {
    setApplicationForm({
      company:
        application.company || "",
      role:
        application.role || "",
      status:
        application.status ||
        "Applied",
      appliedDate:
        application.appliedDate
          ? application.appliedDate.substring(
              0,
              10
            )
          : "",
      jobLink:
        application.jobLink || ""
    });

    setEditingApplicationId(application._id);

    setActivePage("Job Applications");

    setActivePage(
      "Job Applications"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =====================================================
  // DELETE APPLICATION
  // =====================================================

  const deleteApplication = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
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
          headers: {
            ...authHeaders()
          }
        }
      );

      const data =
        await response.json();

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
        "Job application deleted successfully!"
      );
    } catch (err) {
      console.log(
        "Application delete error:",
        err
      );

      alert(
        "Server connection failed."
      );
    }
  };

  // =====================================================
  // INITIAL DATA LOAD
  // =====================================================

useEffect(() => {
  const token = getToken();

  if (!token) {
    return;
  }

  loadProfile();
  loadSkills();
  loadApplications();
  loadProjects();
}, []);
  // =====================================================
  // RENDER
  // AUTH SCREEN
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
              onClick={() =>
                handleNavigation("Profile")
              }
              title="Open Profile"
            >
             {currentUser?.name
  ? currentUser.name.charAt(0).toUpperCase()
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
              Build your future with
              CareerVault.
            </h2>

            <p>
              Keep your profile,
              skills, projects,
              applications and resume
              organized in one place.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                handleNavigation(
                  "Profile"
                )
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
                handleNavigation(
                  "Profile"
                )
              }
            >
              Update Profile
            </button>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>
                  Quick Actions
                </h3>

                <p>
                  Manage your career
                  faster.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="quick-action"
              onClick={() =>
                handleNavigation(
                  "Profile"
                )
              }
            >
              <span>👤</span>
              Edit Profile
              <b>→</b>
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={() =>
                handleNavigation(
                  "Skills"
                )
              }
            >
              <span>◆</span>
              Add Skill
              <b>→</b>
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={() =>
                handleNavigation(
                  "Job Applications"
                )
              }
            >
              <span>▤</span>
              Add Application
              <b>→</b>
            </button>

            <button
              type="button"
              className="quick-action"
              onClick={() =>
                handleNavigation(
                  "Resume"
                )
              }
            >
              <span>▥</span>
              View Resume
              <b>→</b>
            </button>
          </div>
        </div>
      </section>
    );
  };

  // =====================================================
  // PROFILE
  // =====================================================

  const renderProfile = () => {
    return (
      <section>
        <div className="section-heading">
          <div>
            <h2>
              My Profile
            </h2>

            <p>
              Keep your professional
              information updated.
            </p>
          </div>
        </div>

        {message && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px"
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              padding: "12px",
              marginBottom: "15px"
            }}
          >
            {error}
          </div>
        )}

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
                value={
                  profile.name
                }
                onChange={
                  handleProfileChange
                }
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
                value={
                  profile.email
                }
                onChange={
                  handleProfileChange
                }
                placeholder="you@example.com"
              />
            </div>

            <div className="field">
              <label>
                College / University *
              </label>

              <input
                type="text"
                name="college"
                value={
                  profile.college
                }
                onChange={
                  handleProfileChange
                }
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
            placeholder="Branch"
            value={profile.branch}
            onChange={handleChange}
          />

          <br />
          <br />

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
              Add and manage your
              technical skills.
            </p>
          </div>
        </div>

        <div className="panel">
          <h3>
            Add New Skill
          </h3>

          <div className="form-grid">
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
                        value={
                  skillLevel
                }
                        onChange={(e) =>
                          setSkillLevel(
                    e.target.value
                  )
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
                <div className="skills-list">

                  {skills.map(
                (skill) => (
                      <div
                    key={
                      skill._id
                    }
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      padding:
                        "12px 0",
                      borderBottom:
                        "1px solid #eee"
                    }}
                  >
                    <div>
    
                      <div>
                        <strong>
                              {
                          skill.name
                        }
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
                  name="role"
                  value={
                    applicationForm.role
                  }
                  onChange={
                    handleApplicationChange
                  }
                  placeholder="Software Engineer"
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
                  name="appliedDate"
                  value={
                    applicationForm.appliedDate
                  }
                  onChange={
                    handleApplicationChange
                  }
                />
              </div>

              <div className="field full-width">
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
                        <p>
                          <a
                            href={
                              application.jobLink
                            }
                            target="_blank"
                            rel="noreferrer"
                          >
                            View Job
                          </a>
                        </p>
                      )}

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
                        style={{
                          marginLeft:
                            "10px"
                        }}
                        onClick={() =>
                          deleteApplication(
                            application._id
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      );
    };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">
            CV
          </div>

          <div>
            <h2>
              CareerVault
            </h2>

            <span>
              Career Management
            </span>
          </div>
        </div>

        <div className="menu-title">
          MAIN MENU
        </div>

        <nav>
          {navigation.map(
            (item) => (
              <button
                type="button"
                key={
                  item.name
                }
                className={`nav-item ${
                  activePage ===
                  item.name
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleNavigation(
                    item.name
                  )
                }
              >
                <span className="nav-icon">
                  {
                    item.icon
                  }
                </span>

                <span>
                  {
                    item.name
                  }
                </span>
              </button>
            )
          )}
        </nav>

        <div className="sidebar-bottom">

          <div className="help-box">
            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>
                Need help?
              </strong>

              <p>
                Build your career
                profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="logout"
            onClick={logout}
          >
            ↪ Sign Out
          </button>

        </div>

      </aside>

        {/* =================================================
            MAIN
        ================================================= */}

      <main className="main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="topbar">

          <div>
            <h1>
              {activePage}
            </h1>

            <p>
              {
                getPageDescription()
              }
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
                handleNavigation(
                  "Profile"
                )
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

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        {activePage ===
          "Dashboard" &&
          renderDashboard()}

        {activePage ===
          "Profile" &&
          renderProfile()}

        {activePage ===
          "Skills" &&
          renderSkills()}

        {activePage ===
          "Projects" && (
          <section>
            <Projects />
          </section>
        )}

        {activePage ===
          "Job Applications" &&
          renderApplications()}

        {activePage ===
          "Job Test" && (
          <section>
            <JobTest />
          </section>
        )}

        {activePage ===
          "Resume" && (
          <section>
            <Resume
              profile={
                profile
              }
            />
          </section>
        )}


      </main></main>

    </div>
  );
}

export default App;