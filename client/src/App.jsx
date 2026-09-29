import { useEffect, useState } from "react";
import "./App.css";

import Projects from "./components/Projects/Projects";
import JobTest from "./components/JobTest/JobTest";
import Resume from "./components/Resume";

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
    { name: "Resume", icon: "▥" }
  ];

  // =====================================================
  // PROFILE STATE
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
  // SKILLS STATE
  // =====================================================

  const [skills, setSkills] = useState([]);

  const [skillName, setSkillName] = useState("");

  const [skillLevel, setSkillLevel] =
    useState("Beginner");

  // =====================================================
  // PROJECT STATE
  // =====================================================

  const [projectCount, setProjectCount] = useState(0);

  // =====================================================
  // JOB APPLICATION STATE
  // =====================================================

  const [applications, setApplications] = useState([]);

  const [applicationForm, setApplicationForm] =
    useState({
      company: "",
      role: "",
      status: "Applied",
      appliedDate: "",
      jobLink: ""
    });

  const [editingApplicationId, setEditingApplicationId] =
    useState(null);

  // =====================================================
  // DASHBOARD STATS
  // =====================================================

  const [stats, setStats] = useState({
    profile: 0,
    skills: 0,
    projects: 0,
    applications: 0
  });

  // =====================================================
  // COMMON HELPERS
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

  const calculateProfileCompletion = (data) => {
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

    const percentage = Math.round(
      (completed / fields.length) * 100
    );

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

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    if (
      profile.phone &&
      !/^[0-9]{10}$/.test(
        profile.phone
      )
    ) {
      setError(
        "Phone number must contain exactly 10 digits."
      );
      return false;
    }

    if (
      profile.year &&
      !/^\d{4}$/.test(
        profile.year
      )
    ) {
      setError(
        "Graduation year must contain 4 digits."
      );
      return false;
    }

    return true;
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const saveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert(
        "Please login first."
      );
      return;
    }

    try {
      setProfileLoading(true);

      const response = await fetch(
        `${API}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify(profile)
        }
      );

      const data =
        await response.json();

      if (
        response.status === 401
      ) {
        logout();
        return;
      }

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to save profile."
        );
        return;
      }

      if (data.profile) {
        setProfile(data.profile);

        calculateProfileCompletion(
          data.profile
        );
      } else {
        calculateProfileCompletion(
          profile
        );
      }

      setMessage(
        "Profile saved successfully!"
      );

      setError("");
    } catch (err) {
      console.log(
        "Profile save error:",
        err
      );

      setError(
        "Server connection failed."
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // =====================================================
  // LOAD SKILLS
  // =====================================================

  async function loadSkills() {
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

      if (response.ok) {
        const skillList =
          Array.isArray(data)
            ? data
            : data.skills || [];

        setSkills(skillList);

        setStats((previous) => ({
          ...previous,
          skills: skillList.length
        }));
      } else {
        console.log(
          "Failed to load skills:",
          data
        );
      }
    } catch (err) {
      console.log(
        "Skills fetch error:",
        err
      );
    }
  }

  // =====================================================
  // ADD SKILL
  // =====================================================

  const addSkill = async () => {
    if (!skillName.trim()) {
      alert(
        "Please enter a skill name."
      );
      return;
    }

    try {
      const response = await fetch(
        `${API}/skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            name: skillName.trim(),
            level: skillLevel
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to add skill."
        );
        return;
      }

      setSkillName("");
      setSkillLevel("Beginner");

      await loadSkills();

      alert(
        "Skill added successfully!"
      );
    } catch (err) {
      console.log(
        "Skill save error:",
        err
      );

      alert(
        "Server connection failed."
      );
    }
  };

  // =====================================================
  // DELETE SKILL
  // =====================================================

  const deleteSkill = async (id) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this skill?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/skills/${id}`,
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
        alert(
          data.message ||
            "Failed to delete skill."
        );
        return;
      }

      await loadSkills();

      alert(
        "Skill deleted successfully!"
      );
    } catch (err) {
      console.log(
        "Skill delete error:",
        err
      );

      alert(
        "Server connection failed."
      );
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
  // JOB APPLICATION FORM
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
        alert(
          data.message ||
            "Failed to save job application."
        );
        return;
      }

      clearApplicationForm();

      await loadApplications();

      alert(
        editingApplicationId
          ? "Job application updated successfully!"
          : "Job application added successfully!"
      );
    } catch (err) {
      console.log(
        "Application save error:",
        err
      );

      alert(
        "Server connection failed."
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

    setEditingApplicationId(
      application._id
    );

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
        alert(
          data.message ||
            "Failed to delete job application."
        );
        return;
      }

      await loadApplications();

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
  // AUTH SCREEN
  // =====================================================

  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          background: "#f5f7fb"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "35px",
            background: "white",
            borderRadius: "16px",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)"
          }}
        >
          <h1>CareerVault</h1>

          <p>
            Your Personal Career
            Management Platform
          </p>

          <h2>
            {authMode === "login"
              ? "Login"
              : "Create Account"}
          </h2>

          {authMode ===
            "register" && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={authForm.name}
              onChange={
                handleAuthChange
              }
              style={{
                width: "100%",
                padding: "12px",
                marginBottom:
                  "12px",
                boxSizing:
                  "border-box"
              }}
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={authForm.email}
            onChange={
              handleAuthChange
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom:
                "12px",
              boxSizing:
                "border-box"
            }}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              authForm.password
            }
            onChange={
              handleAuthChange
            }
            style={{
              width: "100%",
              padding: "12px",
              marginBottom:
                "15px",
              boxSizing:
                "border-box"
            }}
          />

          <button
            onClick={
              authMode === "login"
                ? login
                : register
            }
            disabled={authLoading}
            style={{
              width: "100%",
              padding: "12px",
              cursor:
                authLoading
                  ? "not-allowed"
                  : "pointer"
            }}
          >
            {authLoading
              ? "Please wait..."
              : authMode === "login"
              ? "Login"
              : "Register"}
          </button>

          <p>
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() =>
                setAuthMode(
                  authMode === "login"
                    ? "register"
                    : "login"
                )
              }
            >
              {authMode === "login"
                ? "Register"
                : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE DESCRIPTION
  // =====================================================

  const getPageDescription = () => {
    if (
      activePage === "Dashboard"
    ) {
      return "Welcome back! Here's your career overview.";
    }

    if (
      activePage === "Profile"
    ) {
      return "Manage your personal and professional information.";
    }

    if (
      activePage ===
      "Job Applications"
    ) {
      return "Track and manage your job applications.";
    }

    if (
      activePage === "Job Test"
    ) {
      return "Practice and prepare for technical job tests.";
    }

    return `Manage your ${activePage.toLowerCase()} information.`;
  };

  // =====================================================
  // DASHBOARD
  // =====================================================

  const renderDashboard = () => {
    return (
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
              Your current career
              progress
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
                value={
                  profile.branch
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Branch / Course"
              />
            </div>

            <div className="field">
              <label>
                Graduation Year
              </label>

              <input
                type="text"
                name="year"
                value={
                  profile.year
                }
                onChange={
                  handleProfileChange
                }
                placeholder="2027"
              />
            </div>

            <div className="field">
              <label>
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={
                  profile.phone
                }
                onChange={
                  handleProfileChange
                }
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
                value={
                  profile.location
                }
                onChange={
                  handleProfileChange
                }
                placeholder="City, State"
              />
            </div>

            <div className="field">
              <label>
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedin"
                value={
                  profile.linkedin
                }
                onChange={
                  handleProfileChange
                }
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
                value={
                  profile.github
                }
                onChange={
                  handleProfileChange
                }
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
                value={
                  profile.portfolio
                }
                onChange={
                  handleProfileChange
                }
                placeholder="https://..."
              />
            </div>

            <div className="field full-width">
              <label>
                Bio
              </label>

              <textarea
                name="bio"
                value={
                  profile.bio
                }
                onChange={
                  handleProfileChange
                }
                placeholder="Write a short professional bio..."
                rows="5"
              ></textarea>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <button
              type="button"
              className="primary-btn"
              onClick={
                saveProfile
              }
              disabled={
                profileLoading
              }
            >
              {profileLoading
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </div>
      </section>
    );
  };

  // =====================================================
  // SKILLS
  // =====================================================

  const renderSkills = () => {
    return (
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
                value={
                  skillName
                }
                onChange={(e) =>
                  setSkillName(
                    e.target.value
                  )
                }
                placeholder="Java, Python, React..."
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
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={addSkill}
          >
            Add Skill
          </button>
        </div>

        <div
          className="panel"
          style={{
            marginTop: "20px"
          }}
        >
          <h3>
            My Skills
          </h3>

          {skills.length === 0 ? (
            <p>
              No skills added yet.
            </p>
          ) : (
            <div>
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
                      <strong>
                        {
                          skill.name
                        }
                      </strong>

                      <span
                        style={{
                          marginLeft:
                            "10px"
                        }}
                      >
                        {
                          skill.level
                        }
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteSkill(
                          skill._id
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
  // JOB APPLICATIONS
  // =====================================================

  const renderApplications =
    () => {
      return (
        <section>
          <div className="section-heading">
            <div>
              <h2>
                Job Applications
              </h2>

              <p>
                Track your job
                applications and
                their status.
              </p>
            </div>
          </div>

          <div className="panel">
            <h3>
              {editingApplicationId
                ? "Edit Job Application"
                : "Add Job Application"}
            </h3>

            <div className="form-grid">
              <div className="field">
                <label>
                  Company *
                </label>

                <input
                  type="text"
                  name="company"
                  value={
                    applicationForm.company
                  }
                  onChange={
                    handleApplicationChange
                  }
                  placeholder="Company Name"
                />
              </div>

              <div className="field">
                <label>
                  Job Role *
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
                  value={
                    applicationForm.jobLink
                  }
                  onChange={
                    handleApplicationChange
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <button
              type="button"
              className="primary-btn"
              onClick={
                saveApplication
              }
            >
              {editingApplicationId
                ? "Update Application"
                : "Add Application"}
            </button>

            {editingApplicationId && (
              <button
                type="button"
                style={{
                  marginLeft:
                    "10px"
                }}
                onClick={
                  clearApplicationForm
                }
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div
            className="panel"
            style={{
              marginTop: "20px"
            }}
          >
            <h3>
              My Applications
            </h3>

            {applications.length ===
            0 ? (
              <p>
                No job applications
                added yet.
              </p>
            ) : (
              <div>
                {applications.map(
                  (
                    application
                  ) => (
                    <div
                      key={
                        application._id
                      }
                      style={{
                        padding:
                          "18px 0",
                        borderBottom:
                          "1px solid #eee"
                      }}
                    >
                      <h4>
                        {
                          application.company
                        }{" "}
                        -{" "}
                        {
                          application.role
                        }
                      </h4>

                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {
                          application.status
                        }
                      </p>

                      <p>
                        <strong>
                          Applied:
                        </strong>{" "}
                        {application.appliedDate
                          ? application.appliedDate.substring(
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

      </main>
    </div>
  );
}

export default App;